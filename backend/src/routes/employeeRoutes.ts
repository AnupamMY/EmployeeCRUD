import express from 'express';
import mongoose from 'mongoose';
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from '../controllers/employeeController';

const router = express.Router();

router.route('/')
  .get(getEmployees)
  .post(createEmployee);

router.param('id', (req, res, next, id) => {
  if (!mongoose.isObjectIdOrHexString(id)) {
    return res.status(400).json({ message: 'Invalid employee ID.' });
  }

  next();
});

router.route('/:id')
  .put(updateEmployee)
  .delete(deleteEmployee);

export default router;
