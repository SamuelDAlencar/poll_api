import { Decrypter } from "../../protocols/criptography/decrypter";
import { DbLoadAccountByToken } from "./db-load-account-by-token";

describe("DbLoadAccountByToken Usecase", () => {
  test("Should call Decrypter with correct values", async () => {
    class DecrypterStub implements Decrypter {
      async decrypt(token: string): Promise<string> {
        return new Promise((resolve) => resolve("decrypted_value"));
      }
    }

    const decrypterStub = new DecrypterStub();
    const decrypterSpy = jest.spyOn(decrypterStub, "decrypt");

    const sut = new DbLoadAccountByToken(decrypterStub);

    await sut.load("any_token");

    expect(decrypterSpy).toHaveBeenCalledWith("any_token");
  });
});
