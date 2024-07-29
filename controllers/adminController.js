import jwt from 'jsonwebtoken';
import adminModel from '../models/adminModel.js';
import { FIXED_PASSWORD, JWT_SECRET } from '../config/db.js';


export const registerAdmin = async (req, res) => {
  try {
    const { email } = req.body;
    const admin = new adminModel({ email });
    await admin.save();
    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, passKey } = req.body;

    console.log('Login attempt:', { email, passKey });

    const admin = await adminModel.findOne({ email });

    if (!admin) {
      console.log('Admin not found');
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    if (passKey !== FIXED_PASSWORD) {
      console.log('Invalid passKey');
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ adminId: admin._id }, JWT_SECRET, { expiresIn: '1h' });
    console.log('Login successful, token generated:', token);

    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ error: error.message });
  }
};

