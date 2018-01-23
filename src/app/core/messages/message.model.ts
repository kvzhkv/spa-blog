export class Message {
  isError?: boolean;
  message: string;
  timeOut?: any;

  constructor(message: string, isError?: boolean) {
    if (isError) {
      this.isError = isError;
    }
    this.message = message;
  }
}
