import { LoginController } from "./login";
import {
  badRequest,
  serverError,
  unauthorized,
  ok,
} from "../../helpers/http/http-helper";
import { MissingParamError } from "../../errors";
import { HttpRequest } from "../../protocols";
import {
  Authentication,
  AuthenticationModel,
} from "../../../domain/useCases/authentication";
import { Validation } from "./login-protocols";

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
    async auth(authentication: AuthenticationModel): Promise<string> {
      return new Promise((resolve) => resolve("any_token"));
    }
  }
  return new AuthenticationStub();
};

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null;
    }
  }
  return new ValidationStub();
};

interface SutTypes {
  sut: LoginController;
  emailValidatorStub: any;
  authenticationStub: any;
  validationStub: Validation;
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const authenticationStub = makeAuthentication();
  const validationStub = makeValidation();
  const sut = new LoginController(authenticationStub, validationStub);

  return {
    sut,
    emailValidatorStub,
    authenticationStub,
    validationStub,
  };
};

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: "any_email@email.com",
    password: "any_password",
  },
});

describe("Login Controller", () => {
  test("Should call Authentication with correct values", async () => {
    const { sut, authenticationStub } = makeSut();

    const authenticationSpy = jest.spyOn(authenticationStub, "auth");

    await sut.handler(makeFakeRequest());

    expect(authenticationSpy).toHaveBeenCalledWith({
      email: "any_email@email.com",
      password: "any_password",
    });
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

  test("Should call Validation with correct value", () => {
    const { sut, validationStub } = makeSut();

    const validateSpy = jest.spyOn(validationStub, "validate");

    const httpRequest = makeFakeRequest();
    sut.handler(httpRequest);

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test("Should return 400 if Validation returns an error", async () => {
    const { sut, validationStub } = makeSut();
    jest
      .spyOn(validationStub, "validate")
      .mockReturnValueOnce(new MissingParamError("any_field"));

    const httpResponse = await sut.handler(makeFakeRequest());

    expect(httpResponse).toEqual(
      badRequest(new MissingParamError("any_field"))
    );
  });
});
