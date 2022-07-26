/* eslint-disable prettier/prettier */
import { ApiBody } from '@nestjs/swagger';

export const ApiMultiFile = (fileName = 'files'): MethodDecorator => (
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) => {
  ApiBody({
    schema: {
      type: 'object',
      properties: {
        user_id: { type: 'number' },
        customer_id: { type: 'string' },
        choose_files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })(target, propertyKey, descriptor);
};