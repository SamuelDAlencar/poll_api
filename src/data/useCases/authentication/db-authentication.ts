import {
  Authentication,
  AuthenticationModel,
} from "../../../domain/useCases/authentication";
import { LoadAccountByEmailRepository } from "../../protocols/db/load-account-by-email-repository";

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository;

  constructor(loadAccountByEmailRepository: LoadAccountByEmailRepository) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository;
  }

  auth(authentication: AuthenticationModel): Promise<string> {
    return this.loadAccountByEmailRepository
      .load(authentication.email)
      .then((account) => {
        if (account && account.password === authentication.password) {
          return Promise.resolve("valid_token");
        }
        return Promise.resolve(null);
      });
  }
}
