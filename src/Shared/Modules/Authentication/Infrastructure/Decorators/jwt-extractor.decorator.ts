import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const JwtToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string | undefined => {
    const request = ctx.switchToHttp().getRequest();
    const authHeader = request.headers?.authorization;

    if (!authHeader) {
      return undefined;
    }

    return authHeader.replace('Bearer ', '');
  },
);
