import { celebrate, Joi, Segments } from 'celebrate';

const createOrderValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    payment: Joi.string().valid('card', 'online').required().messages({
      'any.only': 'Поле "payment" может быть только "card" или "online".',
      'any.required': 'Поле "payment" обязательно для заполнения.',
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Поле "email" должно быть валидным адресом электронной почты.',
      'any.required': 'Поле "email" обязательно для заполнения.',
    }),
    phone: Joi.string().pattern(/^\+?\d{10,15}$/).required().messages({
      'string.pattern.base': 'Поле "phone" должно содержать корректный номер телефона (10-15 цифр).',
      'any.required': 'Поле "phone" обязательно для заполнения.',
    }),
    address: Joi.string().min(2).required().messages({
      'string.min': 'Поле "address" должно содержать не менее 2 символов.',
      'any.required': 'Поле "address" обязательно для заполнения.',
    }),
    total: Joi.number().greater(0).required().messages({
      'number.greater': 'Поле "total" должно быть больше 0.',
      'any.required': 'Поле "total" обязательно для заполнения.',
    }),
    items: Joi.array().items(
      Joi.string().length(24).hex().required()
        .messages({
          'string.length': 'Каждый элемент в "items" должен быть валидным ObjectId (24 символа).',
          'string.hex': 'Каждый элемент в "items" должен быть в формате hex.',
          'any.required': 'Каждый элемент в "items" обязателен.',
        }),
    ).min(1).required()
      .messages({
        'array.min': 'Поле "items" должно содержать хотя бы один элемент.',
        'any.required': 'Поле "items" обязательно для заполнения.',
      }),
  }),
});

export default createOrderValidator;
