import { HttpRequest, HttpResponse } from "../protocols/http";
import { MissingParamError } from "../errors/missing-param-errors";
import { badRequest } from "../helpers/http-helper";
import { Controller } from "../protocols/controller";

export class SignUpController implements Controller {
  handler(httpRequest: HttpRequest): HttpResponse {
    const requiredFields = [
      "name",
      "email",
      "password",
      "passwordConfirmation",
    ];

    for (const requiredField of requiredFields) {
      if (!httpRequest.body[requiredField]) {
        return badRequest(new MissingParamError(requiredField));
      }
    }
  }
}
