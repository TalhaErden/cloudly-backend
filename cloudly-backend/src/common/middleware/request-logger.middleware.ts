import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestLoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now();
    const { method, originalUrl, ip } = req;

    res.on('finish', () => {
      const duration = Date.now() - start;
      const { statusCode } = res;
      
      // ✅ Enhanced logging with response time and status
      this.logger.log(
        `[${new Date().toISOString()}] ${method} ${originalUrl} - ${statusCode} - ${duration}ms - ${ip}`,
      );
    });

    next();
  }
}