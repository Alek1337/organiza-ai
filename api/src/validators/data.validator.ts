import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsValidDateConstraint implements ValidatorConstraintInterface {
  validate(text: string) {
    const data = new Date(text)
    return data.toString() === 'Invalid Date' ? false : true;
  }

  defaultMessage() {
    return 'Text ($value) is not a valid date!';
  }
}

export function IsValidDate(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidDateConstraint,
    });
  };
}


