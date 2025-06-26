import { MissingParamError } from "../../errors";
import { Validation } from "./validation";
import { ValidationComposite } from "./validation-composite";

interface SutTypes {
  sut: ValidationComposite;
  validationStubs: Validation;
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation();

  return {
    sut: new ValidationComposite([validationStub]),
    validationStubs: validationStub,
  };
};

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null;
    }
  }

  return new ValidationStub();
};

describe("ValidationComposite", () => {
  test("Should return an error if any validation fails", () => {
    const { sut , validationStubs} = makeSut();

    jest.spyOn(validationStubs, "validate").mockReturnValueOnce(
      new MissingParamError("field")
    );

    const error = sut.validate({ field: "any_value" });

    expect(error).toEqual(new MissingParamError("field"));
  });
});
