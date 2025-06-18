export class AppClientError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AppClientError";
  }
}
