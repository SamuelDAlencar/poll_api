import { forbidden, ok, serverError } from "../helpers/http/http-helper";
import { AccessDeniedError } from "../errors";
import { AuthMiddleware } from "./auth-middleware";
import { LoadAccountByToken } from "../../domain/useCases/load-account-by-token";
import { AccountModel } from "../../domain/models/account";
import { HttpRequest } from "../protocols/http";

interface SutTypes {
  sut: AuthMiddleware;
  loadAccontByTokenStub: LoadAccountByToken;
}

const makeFakeAccount = (): AccountModel => ({
  id: "any_id",
  name: "any_name",
  email: "any_email",
  password: "any_password",
});

const makeFakeRequest = (): HttpRequest => ({
  headers: { "x-access-token": "any_token" },
});

const makeLoadAccountByTokenStub = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load(
      accessToken: string,
      role?: string
    ): Promise<AccountModel | null> {
      return new Promise((resolve) => resolve(makeFakeAccount()));
    }
  }

  const loadAccontByTokenStub = new LoadAccountByTokenStub();

  return loadAccontByTokenStub;
};

const makeSut = (): SutTypes => {
  const loadAccontByTokenStub = makeLoadAccountByTokenStub();

  const sut = new AuthMiddleware(loadAccontByTokenStub);

  return { sut, loadAccontByTokenStub };
};

describe("Auth Middleware", () => {
  test("Should return 403 if no x-access-token exists in headers", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handler({});

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  test("Should call LoadAccountByToken with correct accessToken", async () => {
    const { sut, loadAccontByTokenStub } = makeSut();

    const loadSpy = jest.spyOn(loadAccontByTokenStub, "load");

    await sut.handler(makeFakeRequest());

    expect(loadSpy).toHaveBeenCalledWith("any_token");
  });

  test("Should return 403 if LoadAccountByToken returns null", async () => {
    const { sut, loadAccontByTokenStub } = makeSut();

    jest
      .spyOn(loadAccontByTokenStub, "load")
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));

    const httpResponse = await sut.handler(makeFakeRequest());

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  test("Should return 200 if LoadAccountByToken returns an account", async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handler(makeFakeRequest());

    expect(httpResponse).toEqual(ok({ accountId: "any_id" }));
  });

  test("Should return 500 if LoadAccountByToken throws", async () => {
    const { sut, loadAccontByTokenStub } = makeSut();

    jest
      .spyOn(loadAccontByTokenStub, "load")
      .mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));

    const httpResponse = await sut.handler(makeFakeRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
