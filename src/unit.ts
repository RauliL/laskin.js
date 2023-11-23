import { secondsInDay, secondsInHour, secondsInMinute } from "date-fns";
import { Decimal } from "decimal.js";

import { LaskinError, NumberValue, Unit, UnitError, UnitType } from "./types";
import { newNumberValue } from "./value";

// Supported length units.
const millimeter: Unit = {
  type: "Length",
  symbol: "mm",
  multiplier: -1000,
};
const centimeter: Unit = {
  type: "Length",
  symbol: "cm",
  multiplier: -100,
};
const meter: Unit = {
  type: "Length",
  symbol: "m",
  multiplier: 1,
};
const kilometer: Unit = {
  type: "Length",
  symbol: "km",
  multiplier: 1000,
};

// Supported mass units.
const milligram: Unit = {
  type: "Mass",
  symbol: "mg",
  multiplier: -1000000,
};
const gram: Unit = {
  type: "Mass",
  symbol: "g",
  multiplier: -1000,
};
const kilogram: Unit = {
  type: "Mass",
  symbol: "kg",
  multiplier: 1,
};

// Supported time units.
const millisecond: Unit = {
  type: "Time",
  symbol: "ms",
  multiplier: -1000,
};
export const second: Unit = {
  type: "Time",
  symbol: "s",
  multiplier: 1,
};
export const minute: Unit = {
  type: "Time",
  symbol: "min",
  multiplier: secondsInMinute,
};
export const hour: Unit = {
  type: "Time",
  symbol: "h",
  multiplier: secondsInHour,
};
export const day: Unit = {
  type: "Time",
  symbol: "d",
  multiplier: secondsInDay,
};

const isBaseUnit = (unit: Unit): boolean => unit.multiplier === 1;

const SYMBOL_MAPPING = new Map<string, Unit>([
  // Length.
  ["mm", millimeter],
  ["cm", centimeter],
  ["m", meter],
  ["km", kilometer],

  // Mass.
  ["mg", milligram],
  ["g", gram],
  ["kg", kilogram],

  // Time.
  ["ms", millisecond],
  ["s", second],
  ["min", minute],
  ["h", hour],
  ["d", day],
]);

export const findUnitBySymbol = (symbol: string): Unit | undefined =>
  SYMBOL_MAPPING.get(symbol);

const ALL_UNIT_MAPPING = new Map<UnitType, Unit[]>([
  ["Length", [millimeter, centimeter, meter, kilometer]],
  ["Mass", [milligram, gram, kilogram]],
  ["Time", [millisecond, second, minute, hour, day]],
]);

const getAllUnitsOf = (type: UnitType): Readonly<Unit[]> => {
  const result = ALL_UNIT_MAPPING.get(type);

  if (!result) {
    throw new LaskinError(`Unrecognized unit type: ${type}`);
  }

  return result;
};

const BASE_UNIT_MAPPING = new Map<UnitType, Unit>([
  ["Length", meter],
  ["Mass", kilogram],
  ["Time", second],
]);

export const getBaseUnitOf = (type?: UnitType): Readonly<Unit> | undefined => {
  if (type != null) {
    const result = BASE_UNIT_MAPPING.get(type);

    if (!result) {
      throw new LaskinError(`Unrecognized unit type: ${type}`);
    }

    return result;
  }

  return undefined;
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
