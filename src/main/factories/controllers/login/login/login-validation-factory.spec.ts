import {
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from "../../../../../validation/validators";
import { EmailValidator } from "../../../../../validation/validators/protocols/email-validator";
import { Validation } from "../../../../../presentation/protocols/validation";
import { makeLoginValidation } from "../../login/login/login-validation-factory";

jest.mock("../../../../../validation/validators/validation-composite");

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

describe("LoginValidation Factory", () => {
  test("Should call ValidationComposite with all required field validations", () => {
    makeLoginValidation();

    const validations: Validation[] = [];

    for (const field of ["email", "password"]) {
      validations.push(new RequiredFieldValidation(field));
    }

    validations.push(new EmailValidation("email", makeEmailValidator()));

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
