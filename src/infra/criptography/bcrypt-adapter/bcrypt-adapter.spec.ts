import bcrypt from "bcrypt";
import { BcryptAdapter } from "./bcrypt-adapter";

const salt = 12;

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt);
};

jest.mock("bcrypt", () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve("hash"));
  },
  async compare(): Promise<boolean> {
    return new Promise((resolve) => resolve(true));
  },
}));

describe("Bcrypt Adapter", () => {
  describe("hash()", () => {
    test("Should call hash with correct values", async () => {
      const sut = makeSut();
      const hashSpy = jest.spyOn(bcrypt, "hash");

      await sut.hash("any_value");

      expect(hashSpy).toHaveBeenCalledWith("any_value", salt);
    });

    test("Should return a valid hash on hash success", async () => {
      const sut = makeSut();
      const hash = await sut.hash("any_value");

      expect(hash).toBe("hash");
    });

    test("Should throw if bcrypt throws", async () => {
      const sut = makeSut();

      jest.spyOn(bcrypt, "hash").mockImplementationOnce(() => {
        throw new Error();
      });

      const promise = sut.hash("any_value");

      await expect(promise).rejects.toThrow();
    });
  });

  describe("compare()", () => {
    test("Should call compare with correct value", async () => {
      const sut = makeSut();
      const compareSpy = jest.spyOn(bcrypt, "compare");

      await sut.compare("any_value", "any_hash");

      expect(compareSpy).toHaveBeenCalledWith("any_value", "any_hash");
    });

    test("Should return true when compare succeeds", async () => {
      const sut = makeSut();
      const isValid = await sut.compare("any_value", "any_hash");

      expect(isValid).toBe(true);
    });

    test("Should return false when compare fails", async () => {
      const sut = makeSut();

      jest.spyOn(bcrypt, "compare").mockImplementationOnce(() => {
        return new Promise((resolve) => resolve(false));
      });

      const isValid = await sut.compare("any_value", "any_hash");

      expect(isValid).toBe(false);
    });

    test("Should throw if bcrypter throws", async () => {
      const sut = makeSut();

      jest.spyOn(bcrypt, "compare").mockImplementationOnce(() => {
        throw new Error();
      });

      const promise = sut.compare("any_value", "any_hash");

      await expect(promise).rejects.toThrow();
    });
  });
});
