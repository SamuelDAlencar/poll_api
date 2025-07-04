/* eslint-disable indent */
import { LoadAccountByEmailRepository } from "../../protocols/db/account/load-account-by-email-repository";
import {
  AuthenticationModel,
  HashComparer,
  Encrypter,
  UpdateAccessTokenRepository,
  Authentication,
} from "./db-authentication-protocols";

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth(authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(
      authentication.email
    );

    if (account) {
      const isValid = await this.hashComparer.compare(
        authentication.password,
        account.password
      );

      if (isValid) {
        const accessToken = await this.tokenGenerator.encrypt(account.id);
        await this.updateAccessTokenRepository.updateAccessToken(
          account.id,
          accessToken
        );

        return accessToken;
      }
    }

    return null;
  }
}
