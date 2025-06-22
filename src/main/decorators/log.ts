import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "../../presentation/protocols";

import { LogErrorRepository } from "../../data/protocols/log-error-repository";


export class LogControllerDecorator implements Controller {
  private readonly controller: Controller;
  private readonly logErrorRepository: LogErrorRepository;

  constructor(controller: Controller, logErrorRepository: LogErrorRepository) {
    this.logErrorRepository = logErrorRepository;
    this.controller = controller;
  }

  async handler(httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handler(httpRequest);

    if (httpResponse.statusCode === 500) {
      await this.logErrorRepository.logError(httpResponse.body.stack);
    }

    return httpResponse;
  }
}
