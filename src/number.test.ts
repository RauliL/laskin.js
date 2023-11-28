import Decimal from "decimal.js";
import { SyntaxError, UnitError } from "./exception";
import {
  isValidNumber,
  parseNumberValue,
  toBaseUnit,
  unitCheck,
  unitConversion,
} from "./number";
import { units } from "./unit";
import { newNumberValue } from "./value";

describe("isValidNumber()", () => {
  it.each(["", "+", "-"])(
    "it should not accept empty string or just a sign as valid number",
    (input) => expect(isValidNumber(input)).toBe(false),
  );

  it.each([".5", "0..5"])(
    "should not accept dot without numeric prefix nor multiple dots as valid number",
    (input) => expect(isValidNumber(input)).toBe(false),
  );

  it.each(["-0.5", "+12", "12.55", "35"])(
    "should accept number without unit as valid number",
    (input) => expect(isValidNumber(input)).toBe(true),
  );

  it.each(["5m", "-55.55h", "0kg"])(
    "should accept number with recognized unit as valid number",
    (input) => expect(isValidNumber(input)).toBe(true),
  );

  it.each(["5zzz", "-5.234ss"])(
    "should not accept number with unrecognized unit as valid number",
    (input) => expect(isValidNumber(input)).toBe(false),
  );
});

describe("parseNumberValue()", () => {
  it("should return 0 value without measurement unit if empty string is given", () => {
    const result = parseNumberValue("");

    expect(result).toHaveProperty("type", "Number");
    expect(result.unit).toBeUndefined();
    expect(result.value.equals(0)).toBe(true);
  });

  it.each([
    ["-5", -5, undefined],
    ["+5", 5, undefined],
    ["15.50km", 15.5, units.kilometer],
  ])(
    "should be able to parse numeric values",
    (input, expectedValue, expectedUnit) => {
      const result = parseNumberValue(input);

      expect(result).toHaveProperty("type", "Number");
      expect(result.unit).toBe(expectedUnit);
      expect(result.value.equals(expectedValue)).toBe(true);
    },
  );

  it("should throw exception if multiple `.' found", () =>
    expect(() => parseNumberValue("15..00")).toThrow(SyntaxError));

  it("should throw exception if unable to recognize the measurement unit", () =>
    expect(() => parseNumberValue("500unknown")).toThrow(SyntaxError));
});

describe("toBaseUnit()", () => {
  it.each([
    [1, units.kilometer, 1000],
    [8500, units.gram, 8.5],
    [1, units.second, 1],
    [1, units.millisecond, 0.001],
    [50, undefined, 50],
  ])(
    "should be able to convert numeric value into it's base unit",
    (value, unit, expectedResult) =>
      expect(
        toBaseUnit(newNumberValue(value, unit)).equals(expectedResult),
      ).toBe(true),
  );
});

describe("unitCheck()", () => {
  it.each([
    [units.meter, units.hour],
    [undefined, units.kilogram],
  ])(
    "should throw exception if units of the two numbers aren't compatible with each other",
    (unit1, unit2) =>
      expect(() =>
        unitCheck(newNumberValue(5, unit1), newNumberValue(10, unit2)),
      ).toThrow(UnitError),
  );

  it("should allow unit on the left side operators even if right one doesn't have one", () => {
    unitCheck(
      newNumberValue(5, units.kilometer),
      newNumberValue(1500),
      newNumberValue(50),
      newNumberValue(1),
    );
  });
});

describe("unitConversion()", () => {
  it.each([
    [1000, undefined, 1000, undefined],
    [1000, units.meter, 1, units.kilometer],
  ])(
    "should find most suitable unit possible for the given value and unit",
    (value, unit, expectedValue, expectedUnit) => {
      const result = unitConversion(new Decimal(value), unit);

      expect(result).toHaveProperty("type", "Number");
      expect(result).toHaveProperty("unit", expectedUnit);
      expect(result.value.equals(expectedValue)).toBe(true);
    },
  );
});
