import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './src/routes/auth.routes.js';
import userRoutes from './src/routes/user.routes.js';
import equipmentRoutes from './src/routes/equipment.routes.js';
import passwordRoutes from './src/routes/passwords.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/passwords', passwordRoutes);

app.get('/', (req, res) => {
  res.send('BMU Internal System API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
