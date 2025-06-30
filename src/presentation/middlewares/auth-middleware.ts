import { AccessDeniedError } from "../errors";
import { forbidden } from "../helpers/http/http-helper";

export class AuthMiddleware {
  constructor() {}

  async handler(httpRequest: any): Promise<any> {
    const error = forbidden(new AccessDeniedError());

    return new Promise((resolve) => resolve(error));
  }
}
