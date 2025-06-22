import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "../../presentation/protocols";
import { LogControllerDecorator } from "./log";

interface SutTypes {
  sut: LogControllerDecorator;
  controllerStub: Controller;
}

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handler(httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = {
        statusCode: 200,
        body: {
          name: "any_name",
        },
      };

      return new Promise((resolve) => resolve(httpResponse));
    }
  }

  return new ControllerStub();
};

const makeSut = (): SutTypes => {
  const controllerStub = makeController();

  const sut = new LogControllerDecorator(controllerStub);

  return { sut, controllerStub };
};

describe("LogController Decorator", () => {
  test("Should call controller handle", async () => {
    const { sut, controllerStub } = makeSut();

    const handleSpy = jest.spyOn(controllerStub, "handler");

    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_mail@mail.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };

    await sut.handler(httpRequest);

    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });
});
