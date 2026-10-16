import type { Request, Response } from 'express';
import { validateEmployee } from '../validation/employee';
import Employee from '../models/employeeModel';

export async function getEmployees(req: Request, res: Response) {
  const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
  const filter: { name?: { $regex: string; $options: string } } = {};

  if (search) {
    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.name = { $regex: escapedSearch, $options: 'i' };
  }

  const limit = Math.min(100, Math.max(1, parseInt(String(req.query.limit), 10) || 5));
  const total = await Employee.countDocuments(filter);
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const page = Math.min(totalPages, Math.max(1, parseInt(String(req.query.page), 10) || 1));

  const employees = await Employee.find(filter)
    .sort({ created_at: -1, _id: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.json({ employees, total, page, totalPages });
}

export async function createEmployee(req: Request, res: Response) {
  const { input, error } = validateEmployee(req.body);

  if (!input) {
    return res.status(400).json({
      message: error,
    });
  }

  const employee = await Employee.create(input);
  res.status(201).json(employee);
}

export async function updateEmployee(req: Request, res: Response) {
  const { input, error } = validateEmployee(req.body);

  if (!input) {
    return res.status(400).json({
      message: error,
    });
  }

  const employee = await Employee.findByIdAndUpdate(req.params.id, input, {
    new: true,
    runValidators: true,
  });

  if (!employee) {
    return res.status(404).json({ message: 'Employee not found.' });
  }

  res.json(employee);
}

export async function deleteEmployee(req: Request, res: Response) {
  const employee = await Employee.findByIdAndDelete(req.params.id);

  if (!employee) {
    return res.status(404).json({ message: 'Employee not found.' });
  }

  res.status(204).end();
}


