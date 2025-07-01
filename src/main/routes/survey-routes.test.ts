import request from "supertest";
import app from "../config/app";
import { MongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper";
import { Collection } from "mongodb";

let surveyCollection: Collection;

describe("Survey Routes", () => {
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

  describe("POST /surveys", () => {
    test("Should return 403 add survey without accessToken", async () => {
      await request(app)
        .post("/api/surveys")
        .send({
          question: "Question",
          answers: [
            { text: "Answer 1", image: "http://image-url.com/1" },
            { text: "Answer 2", image: "http://image-url.com/2" },
          ],
        })
        .expect(403);
    });
  });
});
