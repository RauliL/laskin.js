import { getBaseUnitOf } from ".";
import { UnitError } from "../exception";
import { UnitType } from "../types";
import { findUnitBySymbol, getAllUnitsOf, isBaseUnit } from "./utils";

describe("isBaseUnit()", () => {
  it.each([
    [1, true],
    [1000, false],
    [-50, false],
  ])(
    "it should return `true` if multiplier of the unit is `1`",
    (multiplier, expectedResult) => {
      expect(isBaseUnit({ type: "Length", symbol: "xxx", multiplier })).toBe(
        expectedResult,
      );
    },
  );
});

describe("findUnitBySymbol()", () => {
  it.each(["ms", "kg", "mm"])(
    "should return the unit when it's symbol is recognized",
    (symbol) => {
      expect(findUnitBySymbol(symbol)).not.toBeUndefined();
    },
  );

  it("should return `undefined` when the symbol is not recognized", () => {
    expect(findUnitBySymbol("xxx")).toBeUndefined();
  });
});

describe("getAllUnitsOf()", () => {
  it("should return array of units when unit type is recognized", () => {
    expect(getAllUnitsOf("Length")).toHaveProperty("length");
  });

  it("should throw exception if unit type is not recognized", () => {
    expect(() => getAllUnitsOf("Unknown" as UnitType)).toThrow(UnitError);
  });
});

describe("getBaseUnitOf()", () => {
  it("should return base unit for the unit type, when it's recognized", () => {
    expect(getBaseUnitOf("Mass")).toHaveProperty("multiplier");
  });

  it("should throw exception if unit type is not recognized", () => {
    expect(() => getBaseUnitOf("Unknown" as UnitType)).toThrow(UnitError);
  });
});
