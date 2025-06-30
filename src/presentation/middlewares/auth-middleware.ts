import { LoadAccountByToken } from "../../domain/useCases/load-account-by-token";
import { AccessDeniedError } from "../errors";
import { forbidden, ok, serverError } from "../helpers/http/http-helper";

export class AuthMiddleware {
  constructor(
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string
  ) {}

  async handler(httpRequest: any): Promise<any> {
    try {
      const accessToken = httpRequest.headers?.["x-access-token"];

      if (accessToken) {
        const account = await this.loadAccountByToken.load(accessToken, this.role);

        if (account) {
          return ok({ accountId: account.id });
        }
      }

      return forbidden(new AccessDeniedError());
    } catch (error) {
      return serverError(error);
    }
  }
}
