import { NextFunction, Request, Response } from "express";
import Product from "../models/product";
import BadRequestError from "../errors/bad-request-error";
import ConflictError from "../errors/conflict-error";
import { Error as MongooseError } from "mongoose";

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products  = await Product.find()
    
    const response = {
      items: products,
      total: products.length,
    }

    res.status(200).json(response)
  } catch (error) {
    next(error)
  };
}

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, image, category, description, price } = req.body;

    if(!title || !category || price === undefined || price === null) {
      throw new BadRequestError("Ошибка валидации данных при создании товара.")
    }

    const existingProduct = await Product.findOne({ title });
    if(existingProduct) {
      throw new ConflictError("Продукт с таким именем уже существует.")
    }

    const newProduct = new Product({
      title,
      image,
      category,
      description,
      price,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return next(new BadRequestError(error.message));
    }
    if (error instanceof Error && error.message.includes('E11000')) {
      return next(new ConflictError("Продукт с таким именем уже существует."));
    }
    return next(error)
  }
}