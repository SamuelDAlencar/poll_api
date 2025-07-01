import { LoadAccountByToken } from "../../../domain/useCases/load-account-by-token";
import { Decrypter } from "../../protocols/criptography/decrypter";
import { LoadAccountByTokenRepository } from "../../protocols/db/account/load-account-by-token-repository";
import { AccountModel } from "../add-account/db-add-account-protocols";

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load(token: string, role?: string): Promise<AccountModel | null> {
    const accessToken = this.decrypter.decrypt(token);

    if (accessToken) {
      await this.loadAccountByTokenRepository.loadByToken(token, role);
    }

    return new Promise((resolve) => resolve(null));
  }
}
