import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { SelectAllType } from '../constants/selectAll.type';

interface IsIntSelectAllProperty {
  min?: number;
  max?: number;
}
/**
 * using class-validator
 *
 * @Use @IsIntSelectAll({ min: 0, max: 100 })
 */
export function IsIntSelectAll(property?: object, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isIntSelectAll',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (value === SelectAllType.ALL) return true;
          if (typeof value !== 'number') return false;
          const [property] = args.constraints;
          if (property) {
            const { min, max } = property as IsIntSelectAllProperty;
            if (min && value < min) return false;
            if (max && value > max) return false;
          }
          return true;
        },
      },
    });
  };
}
