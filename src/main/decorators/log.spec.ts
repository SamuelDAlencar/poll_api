import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "../../presentation/protocols";
import { LogControllerDecorator } from "./log";

describe("LogController Decorator", () => {
  test("Should call controller handle", async () => {
    class ControllerStub implements Controller {
      async handler(httpRequest: HttpRequest): Promise<HttpResponse> {
        const httpResponse: HttpResponse = {
          statusCode: 200,
          body: {
            name: "any_name",
            email: "any_mail@mail.com",
            password: "any_password",
            passwordConfirmation: "any_password",
          },
        };

        return new Promise((resolve) => resolve(httpResponse));
      }
    }

    const controllerStub = new ControllerStub();
    const handleSpy = jest.spyOn(controllerStub, "handler");
    const sut = new LogControllerDecorator(controllerStub);

    const httpRequest = {
      body: {
        email: "any_mail@mail.com",
        name: "any_name",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };

    await sut.handler(httpRequest);

    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });
});
