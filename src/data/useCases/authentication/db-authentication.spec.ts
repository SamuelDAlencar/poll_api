/* eslint-disable indent */
import {
  AuthenticationModel,
  HashComparer,
  Encrypter,
  UpdateAccessTokenRepository,
  AccountModel,
} from "./db-authentication-protocols";
import { DbAuthentication } from "./db-authentication";
import { LoadAccountByEmailRepository } from "../../protocols/db/account/load-account-by-email-repository";

interface SutTypes {
  sut: DbAuthentication;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
  hashComparerStub: HashComparer;
  encrypterStub: Encrypter;
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository;
}

const makeFakeAccount = (): AccountModel => ({
  id: "any_id",
  name: "any_name",
  email: "any_email@email.com",
  password: "hashed_password",
});

const makeLoadAccountByEmailRepositoryStub =
  (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub
      implements LoadAccountByEmailRepository
    {
      async loadByEmail(email: string): Promise<AccountModel> {
        return new Promise((resolve) => resolve(makeFakeAccount()));
      }
    }

    return new LoadAccountByEmailRepositoryStub();
  };

const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare(value: string, hash: string): Promise<Boolean> {
      return new Promise((resolve) => resolve(true));
    }
  }

  return new HashComparerStub();
};

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve("any_token"));
    }
  }

  return new EncrypterStub();
};

const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken(id: string, token: string): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }

  return new UpdateAccessTokenRepositoryStub();
};

const makeFakeAuthentication = (): AuthenticationModel => ({
  email: "any_email@email.com",
  password: "any_password",
});

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub =
    makeLoadAccountByEmailRepositoryStub();
  const hashComparerStub = makeHashComparer();
  const encrypterStub = makeEncrypter();
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository();

  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  );

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub,
  };
};

describe("DbAuthentication UseCase", () => {
  test("Should call LoadAccountByEmailRepository with correct email", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, "loadByEmail");

    await sut.auth(makeFakeAuthentication());

    expect(loadSpy).toHaveBeenCalledWith("any_email@email.com");
  });

  test("Should throw LoadAccountByEmailRepository throws", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    jest
      .spyOn(loadAccountByEmailRepositoryStub, "loadByEmail")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const promise = sut.auth(makeFakeAuthentication());

    await expect(promise).rejects.toThrow();
  });

  test("Should return null if LoadAccountByEmailRepository returns null", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    jest
      .spyOn(loadAccountByEmailRepositoryStub, "loadByEmail")
      .mockReturnValueOnce(null);

    const accessToken = await sut.auth(makeFakeAuthentication());

    expect(accessToken).toBeNull();
  });

  test("Should call HashComparer with correct values", async () => {
    const { sut, hashComparerStub } = makeSut();

    const compareSpy = jest.spyOn(hashComparerStub, "compare");

    await sut.auth(makeFakeAuthentication());

    expect(compareSpy).toHaveBeenCalledWith("any_password", "hashed_password");
  });

  test("Should throw if HashComparer throws", async () => {
    const { sut, hashComparerStub } = makeSut();

    jest
      .spyOn(hashComparerStub, "compare")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const promise = sut.auth(makeFakeAuthentication());

    await expect(promise).rejects.toThrow();
  });

  test("Should return null if HashComparer returns null", async () => {
    const { sut, hashComparerStub } = makeSut();

    jest
      .spyOn(hashComparerStub, "compare")
      .mockReturnValueOnce(new Promise((resolve) => resolve(false)));

    const accessToken = await sut.auth(makeFakeAuthentication());

    expect(accessToken).toBeNull();
  });

  test("Should call Encrypter with correct id", async () => {
    const { sut, encrypterStub } = makeSut();

    const generateSpy = jest.spyOn(encrypterStub, "encrypt");

    await sut.auth(makeFakeAuthentication());

    expect(generateSpy).toHaveBeenCalledWith("any_id");
  });

  test("Should throw if Encrypter throws", async () => {
    const { sut, encrypterStub } = makeSut();

    jest
      .spyOn(encrypterStub, "encrypt")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const promise = sut.auth(makeFakeAuthentication());

    await expect(promise).rejects.toThrow();
  });

  test("Should call Encrypter with correct id", async () => {
    const { sut } = makeSut();

    const accessToken = await sut.auth(makeFakeAuthentication());

    expect(accessToken).toBe("any_token");
  });

  test("Should call UpdateAccessTokenRepository with correct values", async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();

    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, "updateAccessToken");

    await sut.auth(makeFakeAuthentication());

    expect(updateSpy).toHaveBeenCalledWith("any_id", "any_token");
  });

  test("Should throw if TokenGenerator throws", async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();

    jest
      .spyOn(updateAccessTokenRepositoryStub, "updateAccessToken")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const promise = sut.auth(makeFakeAuthentication());

    await expect(promise).rejects.toThrow();
  });
});
