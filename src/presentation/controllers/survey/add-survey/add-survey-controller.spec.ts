import { HttpRequest, Validation } from "./add-survey-controller-protocols";
import { AddSurveyController } from "./add-survey-controller";

const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: "any_question",
    answers: [{ image: "any_image", answer: "any_answer" }],
  },
});

describe("AddSurvey controller", () => {
  test("should call Validation with Correct values", async () => {
    class ValidationStub implements Validation {
      validate(input: any): Error {
        return null;
      }
    }

    const validationStub = new ValidationStub();
    const sut = new AddSurveyController(validationStub);

    const validateSpy = jest.spyOn(validationStub, "validate");

    const httpRequest = makeFakeRequest();

    await sut.handler(httpRequest);

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });
});
