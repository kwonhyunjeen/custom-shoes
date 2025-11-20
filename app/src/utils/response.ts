export class ResponseError extends Error {
  constructor(response: Response, message: string = response.statusText) {
    super(message, { cause: response });
    this.name = "ResponseError";
  }
}
