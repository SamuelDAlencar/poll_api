import { HttpRequest, HttpResponse } from "../protocols/http";
import { badRequest, serverError } from "../helpers/http-helper";
import { EmailValidator, Controller } from "../protocols";
import { MissingParamError, InvalidParamError } from "../errors";

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;

  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }

  handler(httpRequest: HttpRequest): HttpResponse {
    try {
      const { email, password, passwordConfirmation } = httpRequest.body;

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

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError("passwordConfirmation"));
      }

      const isValid = this.emailValidator.isValid(email);

      if (!isValid) {
        return badRequest(new InvalidParamError("email"));
      }
    } catch (error) {
      return serverError();
    }
  }
}
