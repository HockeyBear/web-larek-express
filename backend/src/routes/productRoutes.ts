import { createProductValidator } from '../validators/productValidator';
import { createProduct, getProducts } from '../controllers/productController';
import { Router } from 'express';

const router = Router();

router.get('/product', getProducts)
router.post('/product', createProductValidator, createProduct)

export default router