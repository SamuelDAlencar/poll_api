import { MissingParamError } from "../../errors";
import { Validation } from "../../protocols/validation";
import { ValidationComposite } from "./validation-composite";

interface SutTypes {
  sut: ValidationComposite;
  validationStubs: Validation[];
}

const makeSut = (): SutTypes => {
  const validationStubs = [makeValidation(), makeValidation()];

  return {
    sut: new ValidationComposite(validationStubs),
    validationStubs,
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
    const { sut, validationStubs } = makeSut();

    jest
      .spyOn(validationStubs[1], "validate")
      .mockReturnValueOnce(new MissingParamError("field"));

    const error = sut.validate({ field: "any_value" });

    expect(error).toEqual(new MissingParamError("field"));
  });

  test("Should return the first error if more than one fails", () => {
    const { sut, validationStubs } = makeSut();

    jest
      .spyOn(validationStubs[0], "validate")
      .mockReturnValueOnce(new MissingParamError("field1"));
    jest
      .spyOn(validationStubs[1], "validate")
      .mockReturnValueOnce(new MissingParamError("field2"));

    const error = sut.validate({ field: "any_value" });

    expect(error).toEqual(new MissingParamError("field1"));
  });

  test("Should not return if validation succeeds", () => {
    const { sut } = makeSut();

    const error = sut.validate({ field: "any_value" });

    expect(error).toBeFalsy();
  });
});
