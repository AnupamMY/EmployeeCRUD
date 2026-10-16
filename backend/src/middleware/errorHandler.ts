import type { ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err.code === 11000) {
    return res.status(409).json({ message: 'An employee with this email already exists.' });
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON body.' });
  }

  if (err.type === 'entity.too.large') {
    return res.status(413).json({ message: 'Request body is too large.' });
  }

  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({ message: Object.values(err.errors).map(error => error.message).join(' ') });
  }

  console.error(err.message);
  res.status(500).json({ message: 'Something went wrong. Please try again.' });
}

export default errorHandler;
