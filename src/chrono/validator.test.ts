import { Month } from "./types";
import {
  isValidDate,
  isValidMonth,
  isValidTime,
  isValidWeekday,
} from "./validator";

describe("isValidDate()", () => {
  it.each([
    [2023, Month.November, 15, true],
    [2023, Month.September, 40, false],
  ])(
    "should return `true` when the date is valid",
    (year, month, day, expectedResult) => {
      expect(isValidDate(year, month, day)).toBe(expectedResult);
    },
  );
});

describe("isValidTime()", () => {
  it.each([
    [15, 30, 20, true],
    [50, 0, 0, false],
    [-1, 0, 0, false],
    [0, 70, 0, false],
    [0, -5, 0, false],
    [0, 0, 80, false],
    [0, 0, -40, false],
  ])(
    "should return `true` when the time is valid",
    (hour, minute, second, expectedResult) => {
      expect(isValidTime(hour, minute, second)).toBe(expectedResult);
    },
  );
});

describe("isValidMonth()", () => {
  it.each([
    ["january", true],
    ["february", true],
    ["shittiary", false],
  ])("should detect valid month names", (input, expectedResult) => {
    expect(isValidMonth(input)).toBe(expectedResult);
  });
});

describe("isValidWeekday()", () => {
  it.each([
    ["sunday", true],
    ["monday", true],
    ["caturday", false],
  ])("should detect valid weekday names", (input, expectedResult) => {
    expect(isValidWeekday(input)).toBe(expectedResult);
  });
});
