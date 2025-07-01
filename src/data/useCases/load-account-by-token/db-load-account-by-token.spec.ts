import { Decrypter } from "../../protocols/criptography/decrypter";
import { DbLoadAccountByToken } from "./db-load-account-by-token";

interface SutTypes {
  sut: DbLoadAccountByToken;
  decrypterStub: Decrypter;
}

const makeSut = (): SutTypes => {
  class DecrypterStub implements Decrypter {
    async decrypt(token: string): Promise<string> {
      return new Promise((resolve) => resolve("decrypted_value"));
    }
  }

  const decrypterStub = new DecrypterStub();

  const sut = new DbLoadAccountByToken(decrypterStub);

  return { sut, decrypterStub };
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
});
