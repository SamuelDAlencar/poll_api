import { AccessDeniedError } from "../errors";
import { forbidden, ok } from "../helpers/http/http-helper";

export class AuthMiddleware {
  constructor(
    private readonly loadAccountByToken: any = null,
    private readonly role?: string
  ) {}

  async handler(httpRequest: any): Promise<any> {
    const accessToken = httpRequest.headers?.["x-access-token"];

    if (accessToken) {
      const account = await this.loadAccountByToken.load(accessToken);

      if (account) {
        return ok({ accountId: account.id });
      }
    }

    return forbidden(new AccessDeniedError());
  }
}
