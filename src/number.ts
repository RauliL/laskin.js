import { Decimal } from "decimal.js";

import { SyntaxError, UnitError } from "./exception";
import { NumberValue, Unit } from "./types";
import { findUnitBySymbol, getAllUnitsOf, isBaseUnit } from "./unit";
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

export const toBaseUnit = (number: NumberValue): Decimal => {
  const { unit, value } = number;

  if (unit && !isBaseUnit(unit)) {
    if (unit.multiplier > 0) {
      return value.mul(unit.multiplier);
    } else if (unit.multiplier < 0) {
      return value.div(-unit.multiplier);
    }
  }

  return value;
};

export const unitCheck = (a: NumberValue, ...others: NumberValue[]) => {
  for (const b of others) {
    if (a.unit && b.unit) {
      if (a.unit.type !== b.unit.type) {
        throw new UnitError(
          `Cannot compare ${a.unit.type.toLowerCase()} against ${b.unit.type.toLowerCase()}.`,
        );
      }
    } else if (b.unit) {
      throw new UnitError(
        `Cannot compare number without an unit against number which has ${b.unit.type.toLowerCase()} as measurement unit.`,
      );
    }
  }
};

export const unitConversion = (
  value: Decimal,
  baseUnit?: Unit,
): NumberValue => {
  if (baseUnit != null) {
    for (const unit of getAllUnitsOf(baseUnit.type)) {
      const { multiplier } = unit;

      if (multiplier > 0 && value.comparedTo(multiplier) >= 0) {
        value = value.div(multiplier);

        return newNumberValue(value, unit);
      }
    }
  }

  return newNumberValue(value, baseUnit);
};
