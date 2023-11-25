import { Month, Weekday } from "../chrono";
import { TypeError } from "../exception";
import { BuiltinQuote } from "../quote";
import { units } from "../unit";
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

describe("newBooleanValue()", () => {
  it.each([true, false])("should construct boolean value", (value) =>
    expect(newBooleanValue(value)).toEqual({ type: "Boolean", value }),
  );

  it("should default to `false`", () =>
    expect(newBooleanValue().value).toBe(false));
});

describe("newDateValue()", () => {
  it("should throw exception if the date is not valid", () =>
    expect(() => newDateValue(2023, Month.August, 40)).toThrow(TypeError));

  it("should construct date value when the date is valid", () =>
    expect(newDateValue(2023, Month.March, 5)).toEqual({
      type: "Date",
      year: 2023,
      month: Month.March,
      day: 5,
    }));
});

describe("newMonthValue()", () => {
  it("should construct month value", () =>
    expect(newMonthValue(Month.February)).toEqual({
      type: "Month",
      value: Month.February,
    }));

  it("should default to January", () =>
    expect(newMonthValue().value).toBe(Month.January));
});

describe("newNumberValue()", () => {
  it.each([
    [15, undefined],
    [-5.55, units.gram],
  ])("should construct number value", (value, unit) => {
    const result = newNumberValue(value, unit);

    expect(result).toHaveProperty("type", "Number");
    expect(result).toHaveProperty("unit", unit);
    expect(result.value.equals(value));
  });
});

describe("newQuoteValue()", () => {
  it("should construct quote value", () => {
    const quote = new BuiltinQuote(jest.fn());
    const result = newQuoteValue(quote);

    expect(result).toMatchObject({
      type: "Quote",
      quote,
    });
  });
});

describe("newRecordValue()", () => {
  it("should construct record value", () => {
    const result = newRecordValue([
      ["foo", newBooleanValue(true)],
      ["bar", newBooleanValue(false)],
    ]);

    expect(result).toHaveProperty("type", "Record");
    expect(result.elements.size).toBe(2);
    expect(result.elements.get("foo")).toMatchObject({
      type: "Boolean",
      value: true,
    });
    expect(result.elements.get("bar")).toMatchObject({
      type: "Boolean",
      value: false,
    });
  });
});

describe("newStringValue()", () => {
  it("should construct string value", () =>
    expect(newStringValue("foo")).toEqual({ type: "String", value: "foo" }));

  it("should default to empty string", () =>
    expect(newStringValue().value).toBe(""));
});

describe("newTimeValue()", () => {
  it("should throw exception if the time is not valid", () =>
    expect(() => newTimeValue(23, 59, 70)).toThrow(TypeError));

  it("should construct time value when time is valid", () =>
    expect(newTimeValue(23, 59, 10)).toEqual({
      type: "Time",
      hour: 23,
      minute: 59,
      second: 10,
    }));
});

describe("newVectorValue()", () => {
  it("should construct vector value", () =>
    expect(
      newVectorValue([newStringValue("foo"), newStringValue("bar")]),
    ).toEqual({
      type: "Vector",
      elements: [
        { type: "String", value: "foo" },
        { type: "String", value: "bar" },
      ],
    }));

  it("should default to empty vector", () =>
    expect(newVectorValue().elements).toHaveLength(0));
});

describe("newWeekdayValue()", () => {
  it("should construct weekday value", () =>
    expect(newWeekdayValue(Weekday.Thursday)).toEqual({
      type: "Weekday",
      value: Weekday.Thursday,
    }));

  it("should default to Sunday", () =>
    expect(newWeekdayValue().value).toBe(Weekday.Sunday));
});
