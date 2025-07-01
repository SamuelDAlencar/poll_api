import { Controller, HttpRequest } from "../../presentation/protocols";
import { NextFunction, Request, Response } from "express";

export const adaptMiddleware = (middleware: Controller) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const httpRequest: HttpRequest = {
      headers: req.headers,
    };

    const httpResponse = await middleware.handler(httpRequest);

    if (httpResponse.statusCode === 200) {
      Object.assign(req, httpResponse.body);

      next();
    } else {
      res
        .status(httpResponse.statusCode)
        .json({ error: httpResponse.body.message });
    }
  };
};
