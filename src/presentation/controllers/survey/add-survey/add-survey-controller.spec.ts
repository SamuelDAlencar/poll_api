import { AddSurvey, AddSurveyModel, HttpRequest, Validation } from "./add-survey-controller-protocols";
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
  addSurveyStub: AddSurvey;
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null;
    }
  }

  return new ValidationStub();
};

const makeAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add(data: AddSurveyModel): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }

  return new AddSurveyStub();
};

const makeSut = (): SutTypes => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null;
    }
  }

  const validationStub = makeValidation();
  const addSurveyStub = makeAddSurvey();

  const sut = new AddSurveyController(validationStub, addSurveyStub);

  return { sut, validationStub, addSurveyStub };
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

  test("Should call AddSurvey with correct values", async () => {
    const { sut, addSurveyStub } = makeSut();

    const addSpy = jest.spyOn(addSurveyStub, "add");

    const httpRequest = makeFakeRequest();

    await sut.handler(httpRequest);

    expect(addSpy).toHaveBeenCalledWith(httpRequest.body);
  });
});
