import { InvalidParamError } from "../../errors";
import { CompareFieldValidation } from "./compare-fields-validation";

const makeSut = (): CompareFieldValidation => {
  return new CompareFieldValidation("field", "fieldToCompare");
};

describe("CompareFieldValidation", () => {
  test("Should return a InvalidParamError if validation fails", () => {
    const sut = makeSut();

    const error = sut.validate({
      field: "any_name",
      fieldToCompare: "wrong_value",
    });

    expect(error).toEqual(new InvalidParamError("field"));
  });

  test("Should not return if validation succeeds", () => {
    const sut = makeSut();

    const error = sut.validate({
      field: "any_value",
      fieldToCompare: "any_value",
    });

    expect(error).toBeFalsy();
  });
});
