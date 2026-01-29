import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentSpvId = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): number | null => {
    const request = ctx.switchToHttp().getRequest();
    const spvId = request.user?.spvId;

    // safety: normalize undefined → null
    if (typeof spvId !== 'number') {
      return null;
    }

    return spvId;
  },
);
