import { SyntaxError } from "./exception";
import { NumberValue } from "./types";
import { findUnitBySymbol } from "./unit";
import { newNumberValue } from "./value";

export const isNumber = (input: string): boolean => {
  const { length } = input;
  let start: number;
  let dotSeen = false;

  if (!length) {
    return false;
  }

  if (input[0] === "+" || input[0] === "-") {
    start = 1;
    if (length < 2) {
      return false;
    }
  } else {
    start = 0;
  }

  for (let i = start; i < length; ++i) {
    const c = input[i];

    if (c === ".") {
      if (dotSeen || i === start || i + 1 > length) {
        return false;
      }
      dotSeen = true;
    } else if (!/^[0-9]$/.test(c)) {
      return i > start && findUnitBySymbol(input.substring(i)) != null;
    }
  }

  return true;
};

export const parseNumber = (input: string): NumberValue => {
  const { length } = input;
  let start: number;
  let dotSeen = false;

  if (!length) {
    return newNumberValue(0);
  }

  if (input[0] === "+" || input[0] === "-") {
    start = 1;
  } else {
    start = 0;
  }

  for (let i = start; i < length; ++i) {
    const c = input[i];

    if (c === ".") {
      if (dotSeen || i === start || i + 1 > length) {
        break;
      }
      dotSeen = true;
    } else if (!/^[0-9]$/.test(c)) {
      const symbol = input.substring(i);
      const unit = findUnitBySymbol(symbol);

      if (unit == null) {
        throw new SyntaxError(`Unrecognized measurement unit: ${symbol}`);
      }

      return newNumberValue(input.substring(0, i), unit);
    }
  }

  return newNumberValue(input);
};
