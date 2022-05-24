/* eslint-disable prettier/prettier */
import { ApiBody } from '@nestjs/swagger';

export const ApiFile =
  (fileName = 'file'): MethodDecorator =>
    (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      ApiBody({
        schema: {
          type: 'object',
          properties: {
            user_id: { type: 'number' },
            customer_id: { type: 'string' },
            file: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      })(target, propertyKey, descriptor);
    };
