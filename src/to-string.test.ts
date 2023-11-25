import { SymbolNode } from "./ast";
import { Month, Weekday } from "./chrono";
import { ScriptedQuote } from "./quote";
import { valueToString } from "./to-string";
import { units } from "./unit";
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
} from "./value";

describe("valueToString()", () => {
  it.each([
    [true, "true"],
    [false, "false"],
  ])("should convert booleans into strings", (value, expectedResult) =>
    expect(valueToString(newBooleanValue(value))).toBe(expectedResult),
  );

  it("should convert dates into strings", () =>
    expect(valueToString(newDateValue(2023, Month.November, 5))).toBe(
      "2023-11-05",
    ));

  it("should convert months into strings", () =>
    expect(valueToString(newMonthValue(Month.April))).toBe("april"));

  it.each([
    [5, undefined, "5"],
    [60.5, units.hour, "60.5h"],
  ])("should convert numbers into strings", (value, unit, expectedResult) =>
    expect(valueToString(newNumberValue(value, unit))).toBe(expectedResult),
  );

  it("should convert quotes into strings", () =>
    expect(
      valueToString(
        newQuoteValue(
          new ScriptedQuote([
            {
              type: "Symbol",
              position: { line: 1, column: 1 },
              id: "foo",
            } as SymbolNode,
          ]),
        ),
      ),
    ).toBe("(foo)"));

  it("should convert records into strings", () =>
    expect(
      valueToString(
        newRecordValue([
          ["foo", newBooleanValue(true)],
          ["bar", newBooleanValue(false)],
        ]),
      ),
    ).toBe("foo=true, bar=false"));

  it("should convert strings into strings", () =>
    expect(valueToString(newStringValue("foo"))).toBe("foo"));

  it("should convert times into strings", () =>
    expect(valueToString(newTimeValue(5, 45, 1))).toBe("05:45:01"));

  it("should convert vectors into strings", () =>
    expect(
      valueToString(newVectorValue([newNumberValue(1), newNumberValue(2)])),
    ).toBe("1, 2"));

  it("should convert weekdays into strings", () =>
    expect(valueToString(newWeekdayValue(Weekday.Saturday))).toBe("saturday"));
});
