import { Router } from 'express';
import createOrder from '../controllers/orderController';
import createOrderValidator from '../validators/orderValidator';

const router = Router();

router.post('/order', createOrderValidator, createOrder);

export default router;
