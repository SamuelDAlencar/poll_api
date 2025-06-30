import { HttpRequest, Validation } from "./add-survey-controller-protocols";
import { AddSurveyController } from "./add-survey-controller";
import { badRequest } from "../../../helpers/http/http-helper";

const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: "any_question",
    answers: [{ image: "any_image", answer: "any_answer" }],
  },
});

interface SutTypes {
  sut: AddSurveyController;
  validationStub: Validation;
}

const makeSut = (): SutTypes => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null;
    }
  }

  const validationStub = new ValidationStub();
  const sut = new AddSurveyController(validationStub);

  return { sut, validationStub };
};

describe("AddSurvey controller", () => {
  test("should call Validation with Correct values", async () => {
    const { sut, validationStub } = makeSut();

    const validateSpy = jest.spyOn(validationStub, "validate");

    const httpRequest = makeFakeRequest();

    await sut.handler(httpRequest);

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test("should return 400 if Validation fails", async () => {
    const { sut, validationStub } = makeSut();

    jest.spyOn(validationStub, "validate").mockReturnValueOnce(new Error());

    const httpResponse = await sut.handler(makeFakeRequest());

    expect(httpResponse).toEqual(badRequest(new Error()));
  });
});
