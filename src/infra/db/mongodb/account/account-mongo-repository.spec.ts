import { Collection } from "mongodb";
import { MongoHelper } from "../helpers/mongo-helper";
import { AccountMongoRepository } from "./account-mongo-repository";

let accountCollection: Collection;

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository();
};

describe("Account Mongo Repository", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection("accounts");
    accountCollection.deleteMany({});
  });

  describe("add()", () => {
    test("Should return an account on add success", async () => {
      const sut = makeSut();

      const account = await sut.add({
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
      });

      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe("any_name");
      expect(account.email).toBe("any_email@mail.com");
      expect(account.password).toBe("any_password");
    });
  });

  describe("loadByEmail()", () => {
    test("Should return an account on loadByEmail success", async () => {
      const sut = makeSut();

      await accountCollection.insertOne({
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
      });

      const account = await sut.loadByEmail("any_email@mail.com");

      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe("any_name");
      expect(account.email).toBe("any_email@mail.com");
      expect(account.password).toBe("any_password");
    });

    test("Should return null if loadByEmail fails", async () => {
      const sut = makeSut();

      const account = await sut.loadByEmail("any_email@mail.com");

      expect(account).toBeFalsy();
    });
  });

  describe("updateAccessToken()", () => {
    test("Should update the account access token on updateAccessToken success", async () => {
      const sut = makeSut();

      const res = await accountCollection.insertOne({
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
      });

      const id = res.ops[0]._id;

      expect(res.ops[0].accessToken).toBeFalsy();

      await sut.updateAccessToken(id, "any_token");
      const account = await accountCollection.findOne({
        _id: id,
      });

      expect(account).toBeTruthy();
      expect(account.accessToken).toBe("any_token");
    });
  });

  describe("loadByToken()", () => {
    test("Should return an account on loadByToken without role", async () => {
      const sut = makeSut();

      await accountCollection.insertOne({
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
        accessToken: "any_token",
      });

      const account = await sut.loadByToken("any_token");

      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe("any_name");
      expect(account.email).toBe("any_email@mail.com");
      expect(account.password).toBe("any_password");
    });

    test("Should return an account on loadByToken with admin role", async () => {
      const sut = makeSut();

      await accountCollection.insertOne({
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
        accessToken: "any_token",
        role: "admin",
      });

      const account = await sut.loadByToken("any_token", "admin");

      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe("any_name");
      expect(account.email).toBe("any_email@mail.com");
      expect(account.password).toBe("any_password");
    });

    test("Should return null on loadByToken with invalid role", async () => {
      const sut = makeSut();

      await accountCollection.insertOne({
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
        accessToken: "any_token",
        role: "any_token",
      });

      const account = await sut.loadByToken("any_token", "admin");

      expect(account).toBeFalsy();
    });

    test("Should return an account on loadByToken if user is admin", async () => {
      const sut = makeSut();

      await accountCollection.insertOne({
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
        accessToken: "any_token",
        role: "admin",
      });

      const account = await sut.loadByToken("any_token", "admin");

      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe("any_name");
      expect(account.email).toBe("any_email@mail.com");
      expect(account.password).toBe("any_password");
    });

    test("Should return null if loadByEmail fails", async () => {
      const sut = makeSut();

      const account = await sut.loadByEmail("any_email@mail.com");

      expect(account).toBeFalsy();
    });

    test("Should return null if loadByToken fails", async () => {
      const sut = makeSut();

      const account = await sut.loadByToken("any_token");

      expect(account).toBeFalsy();
    });
  });
});
