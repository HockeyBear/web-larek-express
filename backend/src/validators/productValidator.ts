import { celebrate, Joi, Segments } from 'celebrate';

export const createProductValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    title: Joi.string().min(2).max(30).required().messages({
      'string.empty': 'Поле "title" обязательно для заполнения.',
      'string.min': 'Минимальная длина поля "title" - 2 символа.',
      'string.max': 'Максимальная длина поля "title" - 30 символов.',
    }),
    image: Joi.object().keys({
      fileName: Joi.string().required(),
      originalName: Joi.string().required(),
    }).required().messages({
      'object.base': 'Поле "image" должно быть объектом с обязательными параметрами.',
    }),
    category: Joi.string().required().messages({
      'string.empty': 'Поле "category" обязательно для заполнения.',
    }),
    description: Joi.string().allow('').optional(),
    price: Joi.number().required().messages({
      'number.base': 'Поле "price" должно быть числом.',
      'any.required': 'Поле "price" обязательно для заполнения.',
    }),
  }),
});
