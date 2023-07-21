import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { firstValueFrom, of } from 'rxjs';
import { FastifyRequest } from 'fastify';

const statusMessages = {
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  203: 'NonAuthoritativeInfo',
  204: 'NoContent',
  205: 'ResetContent',
  206: 'PartialContent',
};

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  public constructor(private readonly reflector: Reflector) {}

  public async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<any> {
    const body = await firstValueFrom(next.handle());
    const request = context.switchToHttp().getRequest<any>();
    const status =
      this.reflector.get<number>('__httpCode__', context.getHandler()) ||
      (request.method === 'POST' ? 201 : 200);
    const responseTemplate: any = {
      meta: {
        message: statusMessages[status],
        statusCode: status,
        ...(body?.meta || {}),
      },
      response: body && body?.data != null ? body?.data : body,
    };
    return of(responseTemplate);
  }
}
