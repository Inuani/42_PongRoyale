import { Catch, ArgumentsHost, ExceptionFilter, Module, NestModule, MiddlewareConsumer, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { status } from './status';

@Catch()
export class ErrorToKokoFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): any {
	const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

	if (exception.response)
	{
		response
			.status(exception.response.statusCode)
			.json({
				error: exception.response.error,
				message: exception.message,

				// timestamp: new Date().toISOString(),
				// path: request.url,
			});
	}
	
	else if (typeof(exception) == 'string')
		response
		.status(200)
		.json({
			status: exception,
			// timestamp: new Date().toISOString(),
			// path: request.url,
		});
	
	else
		response
		.status(200)
		.json({
			status: status.KO,
			// timestamp: new Date().toISOString(),
			// path: request.url,
		});

  }
}

// @Injectable()
// export class ErrorToKokoMiddleware implements NestMiddleware {
//   use(req: Request, res: Response, next: NextFunction): void {
	
//     try {
//       next();
//     } catch (error) {
//     }
//   }
// }