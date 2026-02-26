import * as passwordService from '../services/passwords.service.js';

export const getAllPasswords = async (req, res) => {
    try {
        const passwords = await passwordService.getAllPasswords();
        res.json(passwords);
    } catch (error) {
        console.error('Error fetching passwords:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลรหัสผ่าน' });
    }
};

export const createPassword = async (req, res) => {
    try {
        const { title, username, password, details, remark } = req.body;
        if (!title || !username || !password) {
            return res.status(400).json({ message: 'กรุณากรอกข้อมูลที่จำเป็น (หัวข้อ, Username, Password) ให้ครบถ้วน' });
        }
        
        await passwordService.createPassword(req.body);
        res.status(201).json({ message: 'เพิ่มรหัสผ่านสำเร็จ' });
    } catch (error) {
        console.error('Error creating password:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเพิ่มรหัสผ่าน' });
    }
};

export const updatePassword = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { title, username, password, details, remark } = req.body;
        if (!title || !username || !password) {
            return res.status(400).json({ message: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน' });
        }
        
        const affectedRows = await passwordService.updatePassword(id, req.body);
        if (affectedRows === 0) {
            return res.status(404).json({ message: 'ไม่พบรหัสผ่านที่ต้องการแก้ไข' });
        }
        res.json({ message: 'อัพเดทรหัสผ่านสำเร็จ' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการแก้ไขรหัสผ่าน' });
    }
};

export const deletePassword = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const affectedRows = await passwordService.deletePassword(id);
        if (affectedRows === 0) {
            return res.status(404).json({ message: 'ไม่พบรหัสผ่านที่ต้องการลบ' });
        }
        res.json({ message: 'ลบรหัสผ่านสำเร็จ' });
    } catch (error) {
        console.error('Error deleting password:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบรหัสผ่าน' });
    }
};
