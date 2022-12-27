import { NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { Response } from 'supertest';

class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request...');
    next();
  }
}

export { LoggerMiddleware };
