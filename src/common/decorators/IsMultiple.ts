import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

/**
 * using class-validator
 *
 * @IsMultiple(multiple)
 * Check value is multiple of `multiple`
 */
export function IsMultiple(property: number, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isMultiple',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [multiple] = args.constraints;
          return (
            typeof value === 'number' && typeof multiple === 'number' && value % multiple === 0
          );
        },
      },
    });
  };
}
