import { NextFunction, Request, Response } from 'express';
import product from '../models/product'; // Подключение модели товара
import { faker } from '@faker-js/faker';
import BadRequestError from '../errors/bad-request-error';
import { Error as MongooseError } from 'mongoose';

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { payment, email, phone, address, total, items } = req.body;

    if (!['card', 'online'].includes(payment)) {
      throw new BadRequestError("Поле \"payment\" может быть только \"card\" или \"online\".");
    }
    if (!email || !email.includes('@')) {
      throw new BadRequestError("Поле \"email\" должно быть валидным адресом электронной почты.");
    }
    if (!phone) {
      throw new BadRequestError("Поле \"phone\" обязательно для заполнения.");
    }
    if (!address) {
      throw new BadRequestError("Поле \"address\" обязательно для заполнения.");
    }
    if (!Array.isArray(items) || items.length === 0) {
      throw new BadRequestError("Поле \"items\" должно содержать хотя бы один элемент.");
    }

    const products = await product.find({ _id: { $in: items } });
    if (products.length !== items.length) {
      throw new BadRequestError("Некоторые товары не найдены в базе данных.")
    }

    const invalidProducts = products.filter((product) => product.price === null);
    if (invalidProducts.length > 0) {
      throw new BadRequestError("Некоторые товары не продаются (цена отсутствует).");
    }

    // Проверка соответствия общей суммы
    const calculatedTotal = products.reduce((sum, product) => sum + (product.price || 0), 0);
    if (calculatedTotal !== total) {
      throw new BadRequestError(`Неверная сумма. Ожидалось ${calculatedTotal}, но получено ${total}.`);
    }

    const orderId = faker.string.uuid();

    res.status(201).json({
      id: orderId,
      total: calculatedTotal,
    });

  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return next(new BadRequestError(error.message))
    }
    return next(error)
  }
};
