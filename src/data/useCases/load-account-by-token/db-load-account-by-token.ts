import { LoadAccountByToken } from "../../../domain/useCases/load-account-by-token";
import { Decrypter } from "../../protocols/criptography/decrypter";
import { AccountModel } from "../add-account/db-add-account-protocols";

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(private readonly decrypter: Decrypter) {}

  async load(token: string, role?: string): Promise<AccountModel | null> {
    this.decrypter.decrypt(token);

    return new Promise((resolve) => resolve(null));
  }
}
