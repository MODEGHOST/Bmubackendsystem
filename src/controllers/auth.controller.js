import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import * as userService from '../services/user.service.js';

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = await userService.findUserByUsername(username);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Temporary fix to allow plain text password login based on user's database screenshot
    // For a real production app, all passwords should be hashed.
    let isPasswordValid = false;
    
    // Check if the stored password looks like a bcrypt hash (starts with $2a$ or $2b$)
    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
        isPasswordValid = await bcrypt.compare(password, user.password);
    } else {
        // Fallback to plain text check if it's not hashed
        isPasswordValid = password === user.password;
    }

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { 
        id: user.id || user.ID, 
        role: user.role, 
        department: user.department,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name
      },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id || user.ID,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        department: user.department,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
