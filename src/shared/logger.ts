/* eslint-disable no-console */

export class Logger {
  private readonly prefix: string;

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  info(message: string): void {
    console.log(`${this.prefix} | ${message}`);
  }

  error(message: string): void {
    console.error(`${this.prefix} | ${message}`);
  }
}
