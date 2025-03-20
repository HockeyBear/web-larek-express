import { Router } from 'express';
import createProductValidator from '../validators/productValidator';
import { createProduct, getProducts } from '../controllers/productController';

const router = Router();

router.get('/product', getProducts);
router.post('/product', createProductValidator, createProduct);

export default router;
