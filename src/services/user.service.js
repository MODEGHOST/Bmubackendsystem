import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

export const findUserByUsername = async (username) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
  return rows[0];
};

export const createUser = async (userData) => {
  const { username, password, first_name, last_name, department, role } = userData;
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const [result] = await pool.query(
    'INSERT INTO users (username, password, first_name, last_name, department, role) VALUES (?, ?, ?, ?, ?, ?)',
    [username, hashedPassword, first_name, last_name, department, role]
  );
  return result.insertId;
};

export const getAllUsers = async () => {
  const [rows] = await pool.query('SELECT id, username, first_name, last_name, department, role FROM users');
  return rows.map(row => ({...row, ID: row.id}));
};

export const getUserById = async (id) => {
  const [rows] = await pool.query('SELECT id, username, first_name, last_name, department, role FROM users WHERE id = ?', [id]);
  if(rows[0]) {
      return {...rows[0], ID: rows[0].id};
  }
  return null;
};

export const updateUser = async (id, userData) => {
  const { first_name, last_name, department, role } = userData;
  await pool.query(
    'UPDATE users SET first_name = ?, last_name = ?, department = ?, role = ? WHERE id = ?',
    [first_name, last_name, department, role, id]
  );
};

export const deleteUser = async (id) => {
  await pool.query('DELETE FROM users WHERE id = ?', [id]);
};
