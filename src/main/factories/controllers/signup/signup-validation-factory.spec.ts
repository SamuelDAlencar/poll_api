import {
  CompareFieldValidation,
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from "../../../../validation/validators";
import { EmailValidator } from "../../../../validation/validators/protocols/email-validator"; 
import { Validation } from "../../../../presentation/protocols/validation";
import { makeSignUpValidation } from "../../controllers/signup/signup-validation-factory";

jest.mock("../../../../validation/validators/validation-composite");

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

describe("SignUpValidation Factory", () => {
  test("Should call ValidationComposite with all required field validations", () => {
    makeSignUpValidation();

    const validations: Validation[] = [];

    for (const field of ["name", "email", "password", "passwordConfirmation"]) {
      validations.push(new RequiredFieldValidation(field));
    }

    validations.push(
      new CompareFieldValidation("password", "passwordConfirmation")
    );

    validations.push(new EmailValidation("email", makeEmailValidator()));

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
