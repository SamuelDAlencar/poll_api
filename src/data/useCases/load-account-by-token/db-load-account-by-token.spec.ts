import { Decrypter } from "../../protocols/criptography/decrypter";
import { AccountModel } from "../add-account/db-add-account-protocols";
import { DbLoadAccountByToken } from "./db-load-account-by-token";
import { LoadAccountByTokenRepository } from "../../protocols/db/account/load-account-by-token-repository";

interface SutTypes {
  sut: DbLoadAccountByToken;
  decrypterStub: Decrypter;
  LoadAccountByTokenRepositoryStub: LoadAccountByTokenRepository;
}

const makeFakeAccount = (): AccountModel => ({
  id: "any_id",
  name: "any_name",
  email: "any_email@email.com",
  password: "any_password",
});

const makeLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub
    implements LoadAccountByTokenRepository
  {
    async loadByToken(token: string, role?: string): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()));
    }
  }

  return new LoadAccountByTokenRepositoryStub();
};

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt(token: string): Promise<string> {
      return new Promise((resolve) => resolve("decrypted_value"));
    }
  }

  return new DecrypterStub();
};

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypter();
  const loadAccountByTokenRepositoryStub = makeLoadAccountByTokenRepository();

  const sut = new DbLoadAccountByToken(decrypterStub);

  return { sut, decrypterStub, LoadAccountByTokenRepositoryStub: loadAccountByTokenRepositoryStub };
};

describe("DbLoadAccountByToken Usecase", () => {
  test("Should call Decrypter with correct values", async () => {
    const { sut, decrypterStub } = makeSut();

    const decrypterSpy = jest.spyOn(decrypterStub, "decrypt");

    await sut.load("any_token");

    expect(decrypterSpy).toHaveBeenCalledWith("any_token");
  });

  test("Should return null if decrypter returns null", async () => {
    const { sut, decrypterStub } = makeSut();

    jest
      .spyOn(decrypterStub, "decrypt")
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));

    const account = await sut.load("any_token");

    expect(account).toBeNull();
  });

  test("Should call LoadAccountByTokenRepository with correct values", async () => {
    const { sut, LoadAccountByTokenRepositoryStub } = makeSut();

    const LoadByTokenSpy = jest.spyOn(
      LoadAccountByTokenRepositoryStub,
      "loadByToken"
    );

    await sut.load("any_token", " any_role");

    expect(LoadByTokenSpy).toHaveBeenCalledWith("any_token", "any_role");
  });
});
