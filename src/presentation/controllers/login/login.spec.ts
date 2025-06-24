import { LoginController } from "./login";
import {
  badRequest,
  serverError,
  unauthorized,
  ok,
} from "../../helpers/http-helper";
import {
  InvalidParamError,
  MissingParamError,
  UnauthorizedError,
} from "../../errors";
import { HttpRequest } from "../../protocols";
import { Authentication } from "../../../domain/useCases/authentication";

const makeEmailValidator = (): any => {
  class EmailValidatorStub {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(email: string, password: string): Promise<string> {
      return new Promise((resolve) => resolve("any_token"));
    }
  }
  return new AuthenticationStub();
};

interface SutTypes {
  sut: LoginController;
  emailValidatorStub: any;
  authenticationStub: any;
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const authenticationStub = makeAuthentication();
  const sut = new LoginController(emailValidatorStub, authenticationStub);

  return {
    sut,
    emailValidatorStub,
    authenticationStub,
  };
};

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: "any_email@email.com",
    password: "any_password",
  },
});

describe("Login Controller", () => {
  test("Should return 400 if no email is provided", async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        password: "any_password",
      },
    };

    const httpResponse = await sut.handler(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError("email")));
  });

  test("Should return 400 if no password is provided", async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        email: "any_email@email.com",
      },
    };

    const httpResponse = await sut.handler(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError("password")));
  });

  test("Should return 400 if invalid email is provided", async () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);

    const httpRequest = makeFakeRequest();

    const httpResponse = await sut.handler(httpRequest);

    expect(httpResponse).toEqual(badRequest(new InvalidParamError("email")));
  });

  test("Should call EmailValidator with correct email", async () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid");

    const httpRequest = makeFakeRequest();

    await sut.handler(httpRequest);

    expect(isValidSpy).toHaveBeenCalledWith("any_email@email.com");
  });

  test("Should return 500 if EmailValidator throws", async () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
      throw new Error();
    });

    const httpResponse = await sut.handler(makeFakeRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test("Should call Authentication with correct values", async () => {
    const { sut, authenticationStub } = makeSut();

    const authenticationSpy = jest.spyOn(authenticationStub, "auth");

    await sut.handler(makeFakeRequest());

    expect(authenticationSpy).toHaveBeenCalledWith(
      "any_email@email.com",
      "any_password"
    );
  });

  test("Should return 401 if invalid credentials are provided", async () => {
    const { sut, authenticationStub } = makeSut();

    jest
      .spyOn(authenticationStub, "auth")
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));

    const httpResponse = await sut.handler(makeFakeRequest());

    expect(httpResponse).toEqual(unauthorized());
  });

  test("Should return 500 if Authentication throws", async () => {
    const { sut, authenticationStub } = makeSut();

    jest
      .spyOn(authenticationStub, "auth")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const httpResponse = await sut.handler(makeFakeRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test("Should return 200 if valid credentials are provided", async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handler(makeFakeRequest());

    expect(httpResponse).toEqual(ok({ accessToken: "any_token" }));
  });
});
