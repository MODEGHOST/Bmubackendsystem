import db from '../config/db.js';

export const getAllPasswords = async () => {
    const [rows] = await db.execute('SELECT * FROM passwords ORDER BY updated_at DESC');
    return rows;
};

export const createPassword = async (data) => {
    const { title, username, password, details, remark } = data;
    const [result] = await db.execute(
        'INSERT INTO passwords (title, username, password, details, remark) VALUES (?, ?, ?, ?, ?)',
        [title, username, password, details, remark]
    );
    return result.insertId;
};

export const updatePassword = async (id, data) => {
    const { title, username, password, details, remark } = data;
    const [result] = await db.execute(
        'UPDATE passwords SET title = ?, username = ?, password = ?, details = ?, remark = ? WHERE id = ?',
        [title, username, password, details, remark, id]
    );
    return result.affectedRows;
};

export const deletePassword = async (id) => {
    const [result] = await db.execute('DELETE FROM passwords WHERE id = ?', [id]);
    return result.affectedRows;
};
