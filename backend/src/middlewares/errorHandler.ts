import { isCelebrateError } from 'celebrate';
import { Request, Response, NextFunction } from 'express';

const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  if (isCelebrateError(err)) {
    const errorBody = err.details.get('body');
    const message = errorBody?.message || 'Ошибка валидации данных';
    return res.status(400).json({ message });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Произошла неизвестная ошибка';

  res.status(statusCode).json({ message });

  return null;
};

export default errorHandler;
