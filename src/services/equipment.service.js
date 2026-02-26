import pool from '../config/db.js';

// Equipment CRUD operations
export const getAllEquipment = async () => {
  const [rows] = await pool.query(
    'SELECT id AS ID, category, sub_category, asset_group_code, asset_code, name, unit, description, ref_document, status, assigned_to, assigned_date, checklist, current_location, created_at, is_leased FROM equipment ORDER BY id DESC'
  );
  return rows;
};

export const getEquipmentCategories = async () => {
  const [rows] = await pool.query('SELECT DISTINCT category FROM equipment WHERE category IS NOT NULL AND category != ""');
  return rows.map(r => r.category);
};

export const getEquipmentById = async (id) => {
  const [rows] = await pool.query(
    'SELECT id AS ID, category, sub_category, asset_group_code, asset_code, name, unit, description, ref_document, status, assigned_to, assigned_date, checklist, current_location, created_at, is_leased FROM equipment WHERE id = ?',
    [id]
  );
  if(rows[0]){
     return rows[0];
  }
  return null;
};

export const createEquipment = async (equipmentData) => {
  const { 
    category, sub_category, asset_group_code, asset_code, name, 
    unit, description, ref_document, status, checklist, is_leased 
  } = equipmentData;

  const [result] = await pool.query(
    `INSERT INTO equipment 
    (category, sub_category, asset_group_code, asset_code, name, unit, description, ref_document, status, checklist, is_leased) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      category ?? null, 
      sub_category ?? null, 
      asset_group_code ?? null, 
      asset_code, 
      name, 
      unit ?? null, 
      description ?? null, 
      ref_document ?? null, 
      status || 'usable', 
      checklist ?? null,
      is_leased ? 1 : 0
    ]
  );
  return result.insertId;
};

export const updateEquipmentStatus = async (id, statusData) => {
  // If statusData is just a string, handle it for backwards compatibility
  if (typeof statusData === 'string') {
    await pool.query('UPDATE equipment SET status = ? WHERE id = ?', [statusData, id]);
    return;
  }

  // Otherwise, handle the full object
  const { status, assigned_to, assigned_date } = statusData;
  await pool.query(
    'UPDATE equipment SET status = ?, assigned_to = ?, assigned_date = ? WHERE id = ?',
    [status, assigned_to || null, assigned_date || null, id]
  );
};

export const bindEquipment = async (assetCode, username) => {
  // Find the equipment by asset_code
  const [rows] = await pool.query('SELECT * FROM equipment WHERE asset_code = ?', [assetCode]);
  if (rows.length === 0) {
    throw new Error('ไม่พบอุปกรณ์ที่มีรหัสสินทรัพย์นี้');
  }

  const equipment = rows[0];

  // Optional business rule logic: Ensure it is 'usable' (not already borrowed by someone else)
  if (equipment.status !== 'usable' && equipment.status !== 'ว่าง') {
    throw new Error('อุปกรณ์นี้ถูกยืมหรือไม่ได้อยู่ในสถานะพร้อมใช้งาน');
  }

  // Update status to in_use and set assigned_to to the user
  const now = new Date();
  await pool.query(
    'UPDATE equipment SET status = ?, assigned_to = ?, assigned_date = ? WHERE id = ?',
    ['in_use', username, now, equipment.id]
  );
  
  return equipment;
};

export const deleteEquipment = async (id) => {
  await pool.query('DELETE FROM equipment WHERE id = ?', [id]);
};

// Equipment Passwords operations
export const getPasswordsByEquipmentId = async (equipmentId) => {
  const [rows] = await pool.query('SELECT * FROM equipment_passwords WHERE equipment_id = ?', [equipmentId]);
  return rows.map(row => ({...row, ID: row.id}));
};

export const addEquipmentPassword = async (equipmentId, passwordData) => {
  const { password, note } = passwordData;
  const [result] = await pool.query(
    'INSERT INTO equipment_passwords (equipment_id, password, note) VALUES (?, ?, ?)',
    [equipmentId, password, note]
  );
  return result.insertId;
};

export const deleteEquipmentPassword = async (passwordId) => {
  await pool.query('DELETE FROM equipment_passwords WHERE id = ?', [passwordId]);
};

export const toggleLocation = async (id, location) => {
  const query = 'UPDATE equipment SET current_location = ? WHERE id = ?';
  const [result] = await pool.query(query, [location, id]);
  return result;
};

// Borrow History operations
export const getActiveHistory = async () => {
  const [rows] = await pool.query(`
    SELECT h.id, h.equipment_id, e.category, e.asset_code, e.name, h.borrower_name, h.borrow_date, h.return_date, h.status, h.remark 
    FROM borrow_history h
    JOIN equipment e ON h.equipment_id = e.id
    WHERE h.status = 'borrowed'
    ORDER BY h.borrow_date DESC
  `);
  return rows;
};

export const borrowHistoryItem = async (equipmentId, borrowData) => {
  const { borrower_name, return_date, remark } = borrowData;
  const now = new Date();
  
  // Insert into borrow_history as pending
  const [result] = await pool.query(
    'INSERT INTO borrow_history (equipment_id, borrower_name, borrow_date, return_date, status, remark) VALUES (?, ?, ?, ?, "pending_borrow", ?)',
    [equipmentId, borrower_name, now, return_date || null, remark || null]
  );
  
  // Update equipment status to pending_borrow
  await pool.query(
    'UPDATE equipment SET status = "pending_borrow" WHERE id = ?',
    [equipmentId]
  );
  
  return result.insertId;
};

export const returnHistory = async (historyId, received_by) => {
  // Update the history record to pending_return
  // We temporarily store received_by even if pending, so it is finalized on approval
  await pool.query(
    'UPDATE borrow_history SET status = "pending_return", received_by = ? WHERE id = ?',
    [received_by, historyId]
  );
  
  // Find the equipment_id associated with this history
  const [rows] = await pool.query('SELECT equipment_id FROM borrow_history WHERE id = ?', [historyId]);
  if(rows.length > 0) {
     const equipmentId = rows[0].equipment_id;
     // Update the equipment status to pending_return
     await pool.query(
        'UPDATE equipment SET status = "pending_return" WHERE id = ?',
        [equipmentId]
     );
  }
};

export const getPendingRequests = async () => {
  const [rows] = await pool.query(`
    SELECT h.id, h.equipment_id, e.category, e.asset_code, e.name, h.borrower_name, h.borrow_date, h.return_date, h.status, h.remark, h.received_by 
    FROM borrow_history h
    JOIN equipment e ON h.equipment_id = e.id
    WHERE h.status IN ('pending_borrow', 'pending_return')
    ORDER BY h.id DESC
  `);
  return rows;
};

export const approveHistoryRequest = async (historyId) => {
  const [rows] = await pool.query('SELECT * FROM borrow_history WHERE id = ?', [historyId]);
  if (rows.length === 0) return;
  const history = rows[0];
  const now = new Date();
  
  if (history.status === 'pending_borrow') {
    await pool.query('UPDATE borrow_history SET status = "borrowed" WHERE id = ?', [historyId]);
    await pool.query('UPDATE equipment SET status = "borrowed" WHERE id = ?', [history.equipment_id]);
  } else if (history.status === 'pending_return') {
    await pool.query('UPDATE borrow_history SET status = "returned", return_date = ? WHERE id = ?', [now, historyId]);
    await pool.query('UPDATE equipment SET status = "usable", assigned_to = NULL, assigned_date = NULL WHERE id = ?', [history.equipment_id]);
  }
};

export const rejectHistoryRequest = async (historyId, remark) => {
  const [rows] = await pool.query('SELECT * FROM borrow_history WHERE id = ?', [historyId]);
  if (rows.length === 0) return;
  const history = rows[0];
  
  if (history.status === 'pending_borrow') {
    await pool.query('UPDATE borrow_history SET status = "rejected", reject_remark = ? WHERE id = ?', [remark, historyId]);
    await pool.query('UPDATE equipment SET status = "usable" WHERE id = ?', [history.equipment_id]);
  } else if (history.status === 'pending_return') {
    await pool.query('UPDATE borrow_history SET status = "borrowed", reject_remark = ? WHERE id = ?', [remark, historyId]);
    await pool.query('UPDATE equipment SET status = "borrowed" WHERE id = ?', [history.equipment_id]);
  }
};

// Repair operations
export const reportBrokenItem = async (equipmentId, reporterName, problemDetail) => {
  const now = new Date();
  
  // Insert into repair_reports
  const [result] = await pool.query(
    'INSERT INTO repair_reports (equipment_id, reporter_name, problem_detail, report_date, repair_status) VALUES (?, ?, ?, ?, "pending")',
    [equipmentId, reporterName, problemDetail, now]
  );
  
  // Update equipment status to broken
  await pool.query('UPDATE equipment SET status = "broken", assigned_to = NULL, assigned_date = NULL WHERE id = ?', [equipmentId]);
  
  return result.insertId;
};

export const getBrokenItems = async () => {
  const [rows] = await pool.query(`
    SELECT r.id, r.equipment_id, e.category, e.asset_code, e.name, r.reporter_name, r.problem_detail, r.report_date, r.repair_status, r.resolved_date 
    FROM repair_reports r
    JOIN equipment e ON r.equipment_id = e.id
    ORDER BY r.report_date DESC
  `);
  return rows;
};

export const resolveBrokenItem = async (reportId) => {
  const now = new Date();
  
  // Update the report status to repaired
  await pool.query(
    'UPDATE repair_reports SET repair_status = "repaired", resolved_date = ? WHERE id = ?',
    [now, reportId]
  );
  
  // Find the equipment_id associated with this report
  const [rows] = await pool.query('SELECT equipment_id FROM repair_reports WHERE id = ?', [reportId]);
  if(rows.length > 0) {
     const equipmentId = rows[0].equipment_id;
     // Update the equipment back to usable
     await pool.query('UPDATE equipment SET status = "usable" WHERE id = ?', [equipmentId]);
  }
};

export const getDashboardSummary = async () => {
  // 1. Total Equipment Count
  const [[{ totalEquipment }]] = await pool.query('SELECT COUNT(*) as totalEquipment FROM equipment');

  // 2. Broken or Needs Repair Count
  const [[{ brokenEquipment }]] = await pool.query('SELECT COUNT(*) as brokenEquipment FROM equipment WHERE status IN ("broken", "needs_repair")');

  // 3. Borrows this month (borrow history created this month)
  const [[{ borrowsThisMonth }]] = await pool.query(`
    SELECT COUNT(*) as borrowsThisMonth 
    FROM borrow_history 
    WHERE MONTH(borrow_date) = MONTH(CURRENT_DATE()) AND YEAR(borrow_date) = YEAR(CURRENT_DATE())
  `);

  // 4. Equipment counts by category
  const [categoryCounts] = await pool.query('SELECT category AS name, COUNT(*) AS value FROM equipment WHERE category IS NOT NULL GROUP BY category');

  return {
    totalEquipment,
    brokenEquipment,
    borrowsThisMonth,
    categoryCounts
  };
};
