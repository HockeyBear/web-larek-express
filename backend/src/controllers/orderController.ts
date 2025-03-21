import { NextFunction, Request, Response } from 'express';
import { faker } from '@faker-js/faker';
import { Error as MongooseError } from 'mongoose';
import product from '../models/product'; // Подключение модели товара
import BadRequestError from '../errors/bad-request-error';

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { total, items } = req.body;

    const products = await product.find({ _id: { $in: items } });
    if (products.length !== items.length) {
      throw new BadRequestError('Некоторые товары не найдены в базе данных.');
    }

    const invalidProducts = products.filter((item) => item.price === null);
    if (invalidProducts.length > 0) {
      throw new BadRequestError('Некоторые товары не продаются (цена отсутствует).');
    }

    // Проверка соответствия общей суммы
    const calculatedTotal = products.reduce((sum, item) => sum + (item.price || 0), 0);
    if (calculatedTotal !== total) {
      throw new BadRequestError(`Неверная сумма. Ожидалось ${calculatedTotal}, но получено ${total}.`);
    }

    const orderId = faker.string.uuid();

    res.status(201).json({
      id: orderId,
      total: calculatedTotal,
    });
    return null;
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return next(new BadRequestError(error.message));
    }
    return next(error);
  }
};

export default createOrder;
