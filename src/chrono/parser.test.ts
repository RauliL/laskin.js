import { parseMonthValue, parseWeekdayValue } from ".";
import {
  matchesDatePattern,
  matchesTimePattern,
  parseDateValue,
  parseTimeValue,
} from "./parser";
import { Month, Weekday } from "./types";

describe("matchesDatePattern()", () => {
  it.each([
    ["2023-11-24", true],
    ["foo", false],
  ])(
    "should return `true` if given string looks like a date",
    (input, expectedResult) => {
      expect(matchesDatePattern(input)).toBe(expectedResult);
    },
  );
});

describe("matchesTimePattern()", () => {
  it.each([
    ["12:30:00", true],
    ["foo", false],
  ])(
    "should return `true` if given string looks like a time",
    (input, expectedResult) => {
      expect(matchesTimePattern(input)).toBe(expectedResult);
    },
  );
});

describe("parseDateValue()", () => {
  it("should be able to parse valid date", () => {
    expect(parseDateValue("2023-11-24")).toEqual({
      type: "Date",
      year: 2023,
      month: Month.November,
      day: 24,
    });
  });

  it.each(["2023-01-50", "fail"])(
    "should throw exception if given string is not valid date",
    (input) => {
      expect(() => parseDateValue(input)).toThrow(SyntaxError);
    },
  );
});

describe("parseTimeValue()", () => {
  it("should be able to parse valid time", () => {
    expect(parseTimeValue("09:45:05")).toEqual({
      type: "Time",
      hour: 9,
      minute: 45,
      second: 5,
    });
  });

  it.each(["23:70:05", "fail"])(
    "should throw exception if given string is not valid time",
    (input) => {
      expect(() => parseTimeValue(input)).toThrow(SyntaxError);
    },
  );
});

describe("parseMonthValue()", () => {
  it("should be able to parse valid month", () => {
    expect(parseMonthValue("september")).toEqual({
      type: "Month",
      value: Month.September,
    });
  });

  it("should throw exception if given string is not valid month", () => {
    expect(() => parseMonthValue("unknown")).toThrow(SyntaxError);
  });
});

describe("parseWeekdayValue()", () => {
  it("should be able to parse valid weekday", () => {
    expect(parseWeekdayValue("friday")).toEqual({
      type: "Weekday",
      value: Weekday.Friday,
    });
  });

  it("should throw exception if given string is not valid weekday", () => {
    expect(() => parseWeekdayValue("unknown")).toThrow(SyntaxError);
  });
});
