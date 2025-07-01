import request from "supertest";
import app from "../config/app";
import { MongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper";
import { Collection } from "mongodb";
import { sign } from "jsonwebtoken";
import env from "../config/env";

let surveyCollection: Collection;
let accountCollection: Collection;

describe("Survey Routes", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection("surveys");
    accountCollection = await MongoHelper.getCollection("accounts");

    await surveyCollection.deleteMany({});
    await accountCollection.deleteMany({});
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

    test("Should return 204 on add survey with valid accessToken", async () => {
      const res = await accountCollection.insertOne({
        name: "any_name",
        email: "any_email@email.com",
        password: "any_password",
        role: "admin",
      });

      const id = res.ops[0]._id;
      const accessToken = sign({ id }, env.jwtSecret);

      await accountCollection.updateOne(
        { _id: id },
        {
          $set: { accessToken },
        }
      );

      await request(app)
        .post("/api/surveys")
        .set("x-access-token", accessToken)
        .send({
          question: "Question",
          answers: [
            { text: "Answer 1", image: "http://image-url.com/1" },
            { text: "Answer 2", image: "http://image-url.com/2" },
          ],
        })
        .expect(204);
    });
  });
});
