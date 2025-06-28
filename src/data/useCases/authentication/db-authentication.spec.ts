/* eslint-disable indent */
import { AuthenticationModel } from "../../../domain/useCases/authentication";
import { LoadAccountByEmailRepository } from "../../protocols/db/load-account-by-email-repository";
import { AccountModel } from "../add-account/db-add-account-protocols";
import { DbAuthentication } from "./db-authentication";

interface SutTypes {
  sut: DbAuthentication;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
}

const makeFakeAccount = (): AccountModel => ({
  id: "any_id",
  name: "any_name",
  email: "any_email@email.com",
  password: "any_password",
});

const makeLoadAccountByEmailRepositoryStub =
  (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub
      implements LoadAccountByEmailRepository
    {
      async load(email: string): Promise<AccountModel> {
        return new Promise((resolve) => resolve(makeFakeAccount()));
      }
    }

    return new LoadAccountByEmailRepositoryStub();
  };

const makeFakeAuthentication = (): AuthenticationModel => ({
  email: "any_email@email.com",
  password: "any_password",
});

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub =
    makeLoadAccountByEmailRepositoryStub();
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub);

  return {
    sut,
    loadAccountByEmailRepositoryStub,
  };
};

describe("DbAuthentication UseCase", () => {
  test("Should call LoadAccountByEmailRepository with correct email", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, "load");

    await sut.auth(makeFakeAuthentication());

    expect(loadSpy).toHaveBeenCalledWith("any_email@email.com");
  });

  test("Should throw LoadAccountByEmailRepository throws", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    jest
      .spyOn(loadAccountByEmailRepositoryStub, "load")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const promise = sut.auth(makeFakeAuthentication());

    await expect(promise).rejects.toThrow();
  });
});
