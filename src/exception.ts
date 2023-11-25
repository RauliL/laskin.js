import { Position } from "./ast";

export class LaskinError extends Error {
  public readonly position?: Position;

  public constructor(message: string, position?: Position) {
    super(position ? `${position.line}: ${message}` : message);
    this.position = position;
    Object.setPrototypeOf(this, LaskinError.prototype);
  }
}

export class NameError extends LaskinError {
  public constructor(message: string, position?: Position) {
    super(message, position);
    Object.setPrototypeOf(this, NameError.prototype);
  }
}

export class RangeError extends LaskinError {
  public constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, RangeError.prototype);
  }
}

export class SyntaxError extends LaskinError {
  public constructor(message: string, position?: Position) {
    super(message, position);
    Object.setPrototypeOf(this, SyntaxError.prototype);
  }
}

export class TypeError extends LaskinError {
  public constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, TypeError.prototype);
  }
}

export class UnitError extends LaskinError {
  public constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, UnitError.prototype);
  }
}
