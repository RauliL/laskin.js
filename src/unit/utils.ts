import { UnitError } from "../exception";
import * as units from "./const";
import { Unit, UnitType } from "./types";

export const isBaseUnit = (unit: Unit): boolean => unit.multiplier === 1;

const SYMBOL_MAPPING = new Map<string, Unit>([
  // Length.
  ["mm", units.millimeter],
  ["cm", units.centimeter],
  ["m", units.meter],
  ["km", units.kilometer],

  // Mass.
  ["mg", units.milligram],
  ["g", units.gram],
  ["kg", units.kilogram],

  // Time.
  ["ms", units.millisecond],
  ["s", units.second],
  ["min", units.minute],
  ["h", units.hour],
  ["d", units.day],
]);

export const findUnitBySymbol = (symbol: string): Unit | undefined =>
  SYMBOL_MAPPING.get(symbol);

const ALL_UNIT_MAPPING = new Map([
  ["Length", units.allLengthUnits],
  ["Mass", units.allMassUnits],
  ["Time", units.allTimeUnits],
]);

export const getAllUnitsOf = (type: UnitType): Readonly<Readonly<Unit>[]> => {
  const result = ALL_UNIT_MAPPING.get(type);

  if (!result) {
    throw new UnitError(`Unrecognized unit type: ${type}`);
  }

  return result;
};

const BASE_UNIT_MAPPING = new Map<UnitType, Readonly<Unit>>([
  ["Length", units.meter],
  ["Mass", units.kilogram],
  ["Time", units.second],
]);

export const getBaseUnitOf = (type?: UnitType): Readonly<Unit> | undefined => {
  if (type != null) {
    const result = BASE_UNIT_MAPPING.get(type);

    if (!result) {
      throw new UnitError(`Unrecognized unit type: ${type}`);
    }

    return result;
  }

  return undefined;
};
