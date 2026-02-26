import * as userService from '../services/user.service.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
};

export const createUser = async (req, res) => {
  try {
    // Note: Only specific roles should probably hit this, checked by middleware on the route
    const userId = await userService.createUser(req.body);
    res.status(201).json({ message: 'User created successfully', userId });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Failed to create user' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await userService.updateUser(userId, req.body);
    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Failed to update user' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await userService.deleteUser(userId);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
};
