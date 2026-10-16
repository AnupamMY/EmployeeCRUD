import { EMAIL_PATTERN, NAME_MAX_LENGTH, ROLE_MAX_LENGTH } from '../validation/employee';
import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  name: {
     type: String, 
     required: true, 
     trim: true,
     maxlength: NAME_MAX_LENGTH },
  email: { 
    type: String, 
    required: true,
    trim: true, 
    lowercase: true, 
    unique: true,
    maxlength: 254, 
    match: EMAIL_PATTERN },
  role: { 
    type: String, 
    required: true, 
    trim: true, maxlength:
    ROLE_MAX_LENGTH },
  created_at: {
     type: Date, 
     default: Date.now },
});

employeeSchema.set('toJSON', {
  transform: (_doc, employee) => {
    const { _id, __v, ...fields } = employee;
    return { ...fields, id: _id.toString() };
  },
});

export default mongoose.model('Employee', employeeSchema);
