import { AccessDeniedError } from "../errors";
import { forbidden } from "../helpers/http/http-helper";

export class AuthMiddleware {
  constructor(
    private readonly loadAccountByToken: any = null,
    private readonly role?: string
  ) {}

  async handler(httpRequest: any): Promise<any> {
    const accessToken = httpRequest.headers?.["x-access-token"];

    if (accessToken) {
      await this.loadAccountByToken.load(accessToken);
    }

    return forbidden(new AccessDeniedError());
  }
}
