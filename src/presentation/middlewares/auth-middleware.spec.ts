import { HttpRequest } from "../protocols/http";
import { forbidden } from "../helpers/http/http-helper";
import { AccessDeniedError } from "../errors";
import { AuthMiddleware } from "./auth-middleware";
import { LoadAccountByToken } from "../../domain/useCases/load-account-by-token";
import { AccountModel } from "../../domain/models/account";

const makeFakeAccount = (): AccountModel => ({
  id: "any_id",
  name: "any_name",
  email: "any_email",
  password: "any_password",
});

describe("Auth Middleware", () => {
  test("Should return 403 if no x-access-token exists in headers", async () => {
    class LoadAccountByTokenStub implements LoadAccountByToken {
      async load(
        accessToken: string,
        role?: string
      ): Promise<AccountModel | null> {
        return new Promise((resolve) => resolve(makeFakeAccount()));
      }
    }

    const loadAccontByTokenStub = new LoadAccountByTokenStub();

    const sut = new AuthMiddleware(loadAccontByTokenStub);

    const httpResponse = await sut.handler({});

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  test("Should call LoadAccountByToken with correct accessToken", async () => {
    class LoadAccountByTokenStub implements LoadAccountByToken {
      async load(
        accessToken: string,
        role?: string
      ): Promise<AccountModel | null> {
        return new Promise((resolve) => resolve(makeFakeAccount()));
      }
    }

    const loadAccontByTokenStub = new LoadAccountByTokenStub();
    const loadSpy = jest.spyOn(loadAccontByTokenStub, "load");

    const sut = new AuthMiddleware(loadAccontByTokenStub);

    await sut.handler({
      headers: { "x-access-token": "any_token" },
    });

    expect(loadSpy).toHaveBeenCalledWith("any_token");
  });
});
