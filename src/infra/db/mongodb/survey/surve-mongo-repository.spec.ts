import { Collection } from "mongodb";
import { SurveyMongoRepository } from "./survey-mongo-repository";
import { MongoHelper } from "../helpers/mongo-helper";

let surveyCollection: Collection;

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository();
};

describe("Account Mongo Repository", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection("surveys");
    await surveyCollection.deleteMany({});
  });

  test("Should add a survey on success", async () => {
    const sut = makeSut();

    await sut.add({
      question: "any_question",
      answers: [
        {
          image: "any_image",
          answer: "any_answer",
        },
        { answer: "other_answer" },
      ],
    });

    const survey = await surveyCollection.findOne({ question: "any_question" });

    expect(survey).toBeTruthy();
  });
});
