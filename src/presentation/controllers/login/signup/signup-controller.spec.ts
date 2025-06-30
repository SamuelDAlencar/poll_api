import { SignUpController } from "./signup-controller";
import { ServerError, MissingParamError, EmailInUseError } from "../../../errors";
import {
  AddAccount,
  AddAccountModel,
  AccountModel,
  HttpRequest,
  Validation,
  Authentication,
  AuthenticationModel,
} from "./signup-controller-protocols";

import { ok, badRequest, serverError, forbidden } from "../../../helpers/http/http-helper";

interface SutTypes {
  sut: SignUpController;
  addAccountStub: AddAccount;
  validationStub: Validation;
  authenticationStub: Authentication;
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: "any_name",
    email: "any_email@email.com",
    password: "any_password",
    passwordConfirmation: "any_password",
  },
});

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(authentication: AuthenticationModel): Promise<string> {
      return new Promise((resolve) => resolve("any_token"));
    }
  }
  return new AuthenticationStub();
};

const makeFakeAccount = (): AccountModel => ({
  id: "any_id",
  name: "valid_name",
  email: "valid_email@email.com",
  password: "valid_password",
});

const makeAddAccount = (): AddAccount => {
  class MakeAddAccountStub implements AddAccount {
    add(account: AddAccountModel): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()));
    }
  }

  return new MakeAddAccountStub();
};

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null;
    }
  }

  return new ValidationStub();
};

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount();
  const validationStub = makeValidation();
  const authenticationStub = makeAuthentication();

  const sut = new SignUpController(
    addAccountStub,
    validationStub,
    authenticationStub
  );

  return {
    sut,
    addAccountStub,
    validationStub,
    authenticationStub,
  };
};

describe("SignUp Controller", () => {
  test("Should return 500 if AddAccount throws", async () => {
    const { sut, addAccountStub } = makeSut();

    jest.spyOn(addAccountStub, "add").mockImplementationOnce(() => {
      return new Promise((_, reject) => reject(new Error()));
    });

    const httpResponse = await sut.handler(makeFakeRequest());

    expect(httpResponse).toEqual(serverError(new ServerError("any_stack")));
  });

  test("Should call AddAccount with correct values", async () => {
    const { sut, addAccountStub } = makeSut();

    const addSpy = jest.spyOn(addAccountStub, "add");

    await sut.handler(makeFakeRequest());

    expect(addSpy).toHaveBeenCalledWith({
      name: "any_name",
      email: "any_email@email.com",
      password: "any_password",
    });
  });

  test("Should return 200 if valid data is provided", async () => {
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

  test("Should call Authentication with correct values", async () => {
    const { sut, authenticationStub } = makeSut();

    const authenticationSpy = jest.spyOn(authenticationStub, "auth");

    await sut.handler(makeFakeRequest());

    expect(authenticationSpy).toHaveBeenCalledWith({
      email: "any_email@email.com",
      password: "any_password",
    });
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

  test("Should return 403 if AddAccount returns null", async () => {
    const { sut, addAccountStub } = makeSut();

    jest
      .spyOn(addAccountStub, "add")
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));

    const httpResponse = await sut.handler(makeFakeRequest());

    expect(httpResponse).toEqual(forbidden(new EmailInUseError()));
  });
});
