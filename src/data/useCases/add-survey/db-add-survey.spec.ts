import { AddSurveyModel, AddSurveyRepository } from "./db-add-survey-protocols";
import { DbAddSurvey } from "./db-add-survey";

const makeFakeSurveyData = (): AddSurveyModel => ({
  question: "any_question",
  answers: [{ image: "any_image", answer: "any_answer" }],
});

describe("DbAddSurvey Usecase", () => {
  test("Should call AddSurveyRepository with correct values", async () => {
    class AddSurveyRepositoryStub {
      async add(surveyData: AddSurveyModel): Promise<void> {
        return new Promise((resolve) => resolve());
      }
    }

    const surveyData = makeFakeSurveyData();

    const addSurveyRepositoryStub = new AddSurveyRepositoryStub();
    const addSpy = jest.spyOn(addSurveyRepositoryStub, "add");
    const sut = new DbAddSurvey(addSurveyRepositoryStub);

    await sut.add(surveyData);

    expect(addSpy).toHaveBeenCalledWith(surveyData);
  });
});
