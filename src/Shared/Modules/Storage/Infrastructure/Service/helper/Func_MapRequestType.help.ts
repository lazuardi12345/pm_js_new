// map-request-type.helper.ts
import { BadRequestException } from '@nestjs/common';
import { REQUEST_TYPE } from '../Interface/RequestType.interface';

export function mapTypeToRequestType(type: string): REQUEST_TYPE {
  const normalized = type.toLowerCase();

  switch (normalized) {
    case 'customer-internal':
      return REQUEST_TYPE.INTERNAL;

    case 'customer-external': // <-- yang kamu minta
      return REQUEST_TYPE.EXTERNAL;

    default:
      throw new BadRequestException(
        `Invalid type: ${type}. Must be internal, external, or customer-external`,
      );
  }
}
