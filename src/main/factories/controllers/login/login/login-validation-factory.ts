import { Validation } from "../../../../../presentation/protocols/validation";
import { EmailValidation, RequiredFieldValidation, ValidationComposite } from "../../../../../validation/validators";
import { EmailValidatorAdapter } from "../../../../adapters/validators/email-validator-adapter";


export const makeLoginValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ["email", "password"]) {
    validations.push(new RequiredFieldValidation(field));
  }

  validations.push(new EmailValidation("email", new EmailValidatorAdapter()));
  return new ValidationComposite(validations);
};
