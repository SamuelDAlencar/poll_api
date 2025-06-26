import { CompareFieldValidation } from "../../presentation/helpers/validators/compare-fields-validation";
import { RequiredFieldValidation } from "../../presentation/helpers/validators/required-field-validation";
import { ValidationComposite } from "../../presentation/helpers/validators/validation-composite";

export const makeSignupValidation = (): ValidationComposite => {
  return new ValidationComposite([
    new RequiredFieldValidation("name"),
    new RequiredFieldValidation("email"),
    new RequiredFieldValidation("password"),
    new RequiredFieldValidation("passwordConfirmation"),
    new CompareFieldValidation("password", "passwordConfirmation"),
  ]);
};
