import { Decimal } from "decimal.js";

import { Month, Weekday } from "../chrono";
import { TypeError } from "../exception";
import { BuiltinQuote, Quote } from "../quote";
import { units } from "../unit";
import {
  valueAsBoolean,
  valueAsDate,
  valueAsMonth,
  valueAsNumber,
  valueAsQuote,
  valueAsRecord,
  valueAsString,
  valueAsTime,
  valueAsVector,
  valueAsWeekday,
} from "./cast";
import {
  newBooleanValue,
  newDateValue,
  newMonthValue,
  newNumberValue,
  newQuoteValue,
  newRecordValue,
  newStringValue,
  newTimeValue,
  newVectorValue,
  newWeekdayValue,
} from "./constructor";

describe("valueAsBoolean()", () => {
  it("should accept boolean values", () =>
    expect(valueAsBoolean(newBooleanValue(true))).toBe(true));

  it("should throw exception for non-boolean values", () =>
    expect(() => valueAsBoolean(newStringValue("foo"))).toThrow(TypeError));
});

describe("valueAsDate()", () => {
  it("should accept date values", () =>
    expect(valueAsDate(newDateValue(2023, Month.December, 24))).toHaveProperty(
      "type",
      "Date",
    ));

  it("should throw exception for non-date values", () =>
    expect(() => valueAsDate(newBooleanValue(false))).toThrow(TypeError));
});

describe("valueAsMonth()", () => {
  it("should accept month values", () =>
    expect(valueAsMonth(newMonthValue(Month.December))).toBe(Month.December));

  it("should throw exception for non-month values", () =>
    expect(() => valueAsMonth(newStringValue("foo"))).toThrow(TypeError));
});

describe("valueAsNumber()", () => {
  it("should accept number values", () =>
    expect(valueAsNumber(newNumberValue(5))).toBeInstanceOf(Decimal));

  it("should accept measurement units given as arguments", () =>
    expect(
      valueAsNumber(
        newNumberValue(5, units.meter),
        units.kilometer,
        units.meter,
      ),
    ).toBeInstanceOf(Decimal));

  it("should reject measurement units not given as arguments", () =>
    expect(() =>
      valueAsNumber(newNumberValue(1, units.kilogram), units.meter),
    ).toThrow(TypeError));

  it("should accept number without measurement unit even with list of accepted units", () =>
    expect(valueAsNumber(newNumberValue(15), units.centimeter)).toBeInstanceOf(
      Decimal,
    ));

  it("should throw exception for non-number values", () =>
    expect(() => valueAsNumber(newStringValue("foo"))).toThrow(TypeError));
});

describe("valueAsQuote()", () => {
  it("should accept quote values", () =>
    expect(
      valueAsQuote(newQuoteValue(new BuiltinQuote(jest.fn()))),
    ).toBeInstanceOf(Quote));
});

describe("valueAsRecord()", () => {
  it("should accept record values", () =>
    expect(valueAsRecord(newRecordValue([]))).toBeInstanceOf(Map));

  it("should throw exception for non-record values", () =>
    expect(() => valueAsRecord(newStringValue("foo"))).toThrow(TypeError));
});

describe("valueAsString()", () => {
  it("should accept string values", () =>
    expect(valueAsString(newStringValue("foo"))).toBe("foo"));

  it("should throw exception for non-string values", () =>
    expect(() => valueAsString(newNumberValue(5))).toThrow(TypeError));
});

describe("valueAsTime()", () => {
  it("should accept time values", () =>
    expect(valueAsTime(newTimeValue(5, 0, 0))).toHaveProperty("type", "Time"));

  it("should throw exception for non-time values", () =>
    expect(() => valueAsTime(newStringValue("foo"))).toThrow(TypeError));
});

describe("valueAsVector()", () => {
  it("should accept vector values", () =>
    expect(valueAsVector(newVectorValue([newStringValue("foo")]))).toHaveLength(
      1,
    ));

  it("should throw exception for non-vector values", () =>
    expect(() => valueAsVector(newStringValue("foo"))).toThrow(TypeError));
});

describe("valueAsWeekday()", () => {
  it("should accept weekday values", () =>
    expect(valueAsWeekday(newWeekdayValue(Weekday.Friday))).toBe(
      Weekday.Friday,
    ));

  it("should throw exception for non-weekday values", () =>
    expect(() => valueAsWeekday(newMonthValue(Month.April))).toThrow(
      TypeError,
    ));
});
