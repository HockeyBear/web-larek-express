import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import cors from 'cors';
import { errors } from 'celebrate';
import productRoutes  from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import errorHandler from './middlewares/errorHandler';
import NotFoundError from './errors/not-found-error';
import { requestLogger, errorLogger } from './middlewares/logger';

const {PORT = 3000, DB_ADDRESS = 'mongodb://127.0.0.1:27017/weblarek' } = process.env;

const app = express()

app.use(cors({
  origin: 'http://localhost:5173',
}));

app.use(requestLogger);

app.use(express.json());
app.use('/', productRoutes);
app.use('/', orderRoutes);

app.use((req, res, next) => {
  next(new NotFoundError());
})
app.use(errors());

app.use(errorLogger)

app.use(errorHandler);

app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(DB_ADDRESS, {}).then(() => {
  console.log(`Connected to MongoDB at ${DB_ADDRESS}`);
}).catch((err) => {
  console.error(`Error connecting to MongoDB`, err)
})

app.listen(PORT, () => {console.log(`Server opened on ${PORT} port and db address: ${DB_ADDRESS}`)})