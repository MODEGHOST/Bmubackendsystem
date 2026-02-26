import * as equipmentService from '../services/equipment.service.js';

export const getAllEquipment = async (req, res) => {
  try {
    const equipment = await equipmentService.getAllEquipment();
    res.status(200).json(equipment);
  } catch (error) {
    console.error('Error fetching equipment:', error);
    res.status(500).json({ message: 'Failed to fetch equipment' });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await equipmentService.getEquipmentCategories();
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
};

export const getEquipmentById = async (req, res) => {
  try {
    const equipment = await equipmentService.getEquipmentById(req.params.id);
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }
    res.status(200).json(equipment);
  } catch (error) {
    console.error('Error fetching equipment details:', error);
    res.status(500).json({ message: 'Failed to fetch equipment details' });
  }
};

export const createEquipment = async (req, res) => {
  try {
    const newId = await equipmentService.createEquipment(req.body);
    res.status(201).json({ message: 'Equipment created successfully', id: newId });
  } catch (error) {
    console.error('Error creating equipment:', error);
    res.status(500).json({ message: error.message || 'Failed to create equipment' });
  }
};

export const updateEquipmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    // Pass the entire body so borrower info is updated if present
    await equipmentService.updateEquipmentStatus(req.params.id, req.body);
    res.status(200).json({ message: 'Equipment status updated successfully' });
  } catch (error) {
    console.error('Error updating equipment status:', error);
    res.status(500).json({ message: 'Failed to update equipment status' });
  }
};

export const bindEquipment = async (req, res) => {
  try {
    const { asset_code } = req.body;
    // Assuming the user's name is attached directly to the token as 'name', 
    // or we might need to look it up. The JWT usually has 'username' or 'name'.
    // Let's pass the raw `req.user` details. In auth.middleware, `req.user` usually holds token payload.
    // If the token payload has `username`, we use `req.user.username`. Let's fallback to `req.user.id` or a generic username if missing.
    const username = req.user.username || req.user.name || `User ID: ${req.user.id}`;
    
    if (!asset_code) {
      return res.status(400).json({ message: 'Asset code is required' });
    }

    const assignedEquipment = await equipmentService.bindEquipment(asset_code, username);
    res.status(200).json({ message: 'Equipment bound successfully', equipment: assignedEquipment });
  } catch (error) {
    console.error('Error binding equipment:', error);
    res.status(400).json({ message: error.message || 'Failed to bind equipment' });
  }
};

export const deleteEquipment = async (req, res) => {
  try {
    await equipmentService.deleteEquipment(req.params.id);
    res.status(200).json({ message: 'Equipment deleted successfully' });
  } catch (error) {
    console.error('Error deleting equipment:', error);
    res.status(500).json({ message: 'Failed to delete equipment' });
  }
};

export const getEquipmentPasswords = async (req, res) => {
  try {
    const passwords = await equipmentService.getPasswordsByEquipmentId(req.params.id);
    res.status(200).json(passwords);
  } catch (error) {
    console.error('Error fetching equipment passwords:', error);
    res.status(500).json({ message: 'Failed to fetch equipment passwords' });
  }
};

export const addEquipmentPassword = async (req, res) => {
  try {
    const newId = await equipmentService.addEquipmentPassword(req.params.id, req.body);
    res.status(201).json({ message: 'Password added successfully', id: newId });
  } catch (error) {
    console.error('Error adding equipment password:', error);
    res.status(500).json({ message: 'Failed to add equipment password' });
  }
};

export const deleteEquipmentPassword = async (req, res) => {
    try {
      await equipmentService.deleteEquipmentPassword(req.params.passwordId);
      res.status(200).json({ message: 'Password deleted successfully' });
    } catch (error) {
      console.error('Error deleting equipment password:', error);
      res.status(500).json({ message: 'Failed to delete equipment password' });
    }
  };

export const toggleLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { location } = req.body; // 'office' or 'home'
    
    if (!['office', 'home'].includes(location)) {
      return res.status(400).json({ message: 'Invalid location value' });
    }

    await equipmentService.toggleLocation(id, location);
    res.status(200).json({ message: 'Location updated successfully', location });
  } catch (error) {
    console.error('Error toggling location:', error);
    res.status(500).json({ message: 'Internal server error while updating location' });
  }
};

export const getActiveHistory = async (req, res) => {
  try {
    const history = await equipmentService.getActiveHistory();
    res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching borrow history:', error);
    res.status(500).json({ message: 'Failed to fetch active history' });
  }
};

export const borrowHistoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { borrower_name, remark } = req.body;
    
    if (!borrower_name) {
      return res.status(400).json({ message: 'Borrower name is required' });
    }
    if (!remark) {
      return res.status(400).json({ message: 'Remark is required' });
    }

    const newId = await equipmentService.borrowHistoryItem(id, req.body);
    res.status(201).json({ message: 'Equipment borrowed successfully', id: newId });
  } catch (error) {
    console.error('Error borrowing equipment:', error);
    res.status(500).json({ message: 'Failed to borrow equipment' });
  }
};

export const returnHistoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { received_by } = req.body;
    
    if (!received_by) {
      return res.status(400).json({ message: 'Receiver name (received_by) is required' });
    }

    await equipmentService.returnHistory(id, received_by);
    res.status(200).json({ message: 'Equipment return request submitted successfully' });
  } catch (error) {
    console.error('Error submitting return request:', error);
    res.status(500).json({ message: 'Failed to submit return request' });
  }
};

export const getPendingRequests = async (req, res) => {
  try {
    const requests = await equipmentService.getPendingRequests();
    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching pending requests:', error);
    res.status(500).json({ message: 'Failed to fetch pending requests' });
  }
};

export const approveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    await equipmentService.approveHistoryRequest(id);
    res.status(200).json({ message: 'Request approved successfully' });
  } catch (error) {
    console.error('Error approving request:', error);
    res.status(500).json({ message: 'Failed to approve request' });
  }
};

export const rejectRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { remark } = req.body;
    
    if (!remark) {
      return res.status(400).json({ message: 'Reject remark is required' });
    }

    await equipmentService.rejectHistoryRequest(id, remark);
    res.status(200).json({ message: 'Request rejected successfully' });
  } catch (error) {
    console.error('Error rejecting request:', error);
    res.status(500).json({ message: 'Failed to reject request' });
  }
};

export const reportBrokenEquipment = async (req, res) => {
  try {
    const { equipment_id, problem_detail } = req.body;
    const reporter_name = req.user.username || req.user.name || `User ID: ${req.user.id}`;
    
    if (!equipment_id || !problem_detail) {
      return res.status(400).json({ message: 'Equipment ID and problem detail are required' });
    }

    const newId = await equipmentService.reportBrokenItem(equipment_id, reporter_name, problem_detail);
    res.status(201).json({ message: 'Equipment reported broken successfully', id: newId });
  } catch (error) {
    console.error('Error reporting broken equipment:', error);
    res.status(500).json({ message: 'Failed to report broken equipment' });
  }
};

export const getBrokenReports = async (req, res) => {
  try {
    const reports = await equipmentService.getBrokenItems();
    res.status(200).json(reports);
  } catch (error) {
    console.error('Error fetching broken reports:', error);
    res.status(500).json({ message: 'Failed to fetch broken reports' });
  }
};

export const resolveBrokenReport = async (req, res) => {
  try {
    const { id } = req.params;
    await equipmentService.resolveBrokenItem(id);
    res.status(200).json({ message: 'Equipment marked as repaired successfully' });
  } catch (error) {
    console.error('Error resolving broken report:', error);
    res.status(500).json({ message: 'Failed to mark equipment as repaired' });
  }
};

export const getDashboardSummary = async (req, res) => {
  try {
    const summary = await equipmentService.getDashboardSummary();
    res.status(200).json(summary);
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard summary' });
  }
};
