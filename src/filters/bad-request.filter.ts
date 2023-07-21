import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

@Catch(BadRequestException)
export class BadRequestFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    // const request = ctx.getRequest<FastifyRequest>();
    const status = exception.getStatus();
    // const message = exception.getResponse()['message'];
    // console.log(exception.getResponse());
    response
      .status(status)
      // you can manipulate the response here
      .send(exception.getResponse());
  }
}
