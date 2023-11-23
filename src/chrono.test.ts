import { isMonth, isWeekday } from "./chrono";

describe("isMonth()", () => {
  it.each([
    ["january", true],
    ["february", true],
    ["shittiary", false],
  ])("should detect valid month names", (input, expectedResult) => {
    expect(isMonth(input)).toBe(expectedResult);
  });
});

describe("isWeekday()", () => {
  it.each([
    ["sunday", true],
    ["monday", true],
    ["caturday", false],
  ])("should detect valid weekday names", (input, expectedResult) => {
    expect(isWeekday(input)).toBe(expectedResult);
  });
});
