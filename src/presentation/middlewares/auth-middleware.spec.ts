import { HttpRequest } from "../protocols/http";
import { forbidden } from "../helpers/http/http-helper";
import { AccessDeniedError } from "../errors";
import { AuthMiddleware } from "./auth-middleware";

describe("Auth Middleware", () => {
  test("Should return 403 if no x-access-token exists in headers", async () => {
    const sut = new AuthMiddleware();

    const httpResponse = await sut.handler({});

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });
});
