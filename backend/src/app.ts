import express from 'express';
import cors from 'cors';
import employeeRoutes from './routes/employeeRoutes';
import errorHandler from './middleware/errorHandler';

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));

app.use(express.json({ limit: '10kb' }));

app.use('/employees', employeeRoutes);
app.use(errorHandler);

export default app;
