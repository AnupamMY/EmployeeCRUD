import mongoose from 'mongoose';
import Employee from '../models/employeeModel';

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri || /[<>]/.test(uri)) {
    throw new Error('Set MONGODB_URI in backend/.env with your MongoDB password.');
  }
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  await Employee.init();
  console.log('MongoDB connected');
}

export default connectDB;
