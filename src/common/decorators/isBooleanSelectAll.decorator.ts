import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { SelectAllType } from '../constants/selectAll.type';

/**
 * using class-validator
 *
 * @Use @IsBooleanSelectAll()
 */
export function IsBooleanSelectAll(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isBooleanSelectAll',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (value === SelectAllType.ALL) return true;
          return typeof value === 'boolean';
        },
      },
    });
  };
}
