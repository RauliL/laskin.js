import { Month, Weekday } from "../chrono";
import { TypeError } from "../exception";
import { units } from "../unit";
import {
  newDateValue,
  newMonthValue,
  newNumberValue,
  newStringValue,
  newTimeValue,
  newVectorValue,
  newWeekdayValue,
} from "../value";
import { compare } from "./compare";

describe("compare()", () => {
  it.each([
    [newDateValue(2023, 1, 1), newDateValue(2022, 1, 1), 1],
    [newDateValue(2023, 2, 1), newDateValue(2023, 1, 1), 1],
    [newDateValue(2023, 1, 2), newDateValue(2023, 1, 1), 1],
    [newDateValue(2023, 1, 1), newDateValue(2024, 1, 1), -1],
    [newDateValue(2023, 1, 1), newDateValue(2023, 2, 1), -1],
    [newDateValue(2023, 1, 1), newDateValue(2023, 1, 2), -1],
    [newDateValue(2023, 1, 1), newDateValue(2023, 1, 1), 0],
  ])(
    "should be able to compare two dates against each other",
    (date1, date2, expectedResult) => {
      expect(compare(date1, date2)).toBe(expectedResult);
    },
  );

  it.each([
    [Month.February, Month.January, 1],
    [Month.January, Month.February, -1],
    [Month.January, Month.January, 0],
  ])(
    "should be able to compare two months against each other",
    (month1, month2, expectedResult) => {
      expect(compare(newMonthValue(month1), newMonthValue(month2))).toBe(
        expectedResult,
      );
    },
  );

  it.each([
    [1, undefined, 0, undefined, 1],
    [0, undefined, 1, undefined, -1],
    [1, undefined, 1, undefined, 0],
    [1, units.kilometer, 1, units.meter, 1],
    [1, units.gram, 1, units.kilogram, -1],
    [5, units.second, 5, units.second, 0],
  ])(
    "should be able to compare two numbers against each other",
    (value1, unit1, value2, unit2, expectedResult) => {
      expect(
        compare(newNumberValue(value1, unit1), newNumberValue(value2, unit2)),
      ).toBe(expectedResult);
    },
  );

  it.each([
    ["b", "a", 1],
    ["a", "b", -1],
    ["a", "a", 0],
  ])(
    "should be able to compare two strings against each other",
    (string1, string2, expectedResult) => {
      expect(compare(newStringValue(string1), newStringValue(string2))).toBe(
        expectedResult,
      );
    },
  );

  it.each([
    [[newNumberValue(1)], [newNumberValue(0)], 1],
    [[newNumberValue(0)], [newNumberValue(1)], -1],
    [[newNumberValue(1)], [newNumberValue(1)], 0],
    [[newNumberValue(1), newNumberValue(1)], [newNumberValue(1)], 1],
    [[newNumberValue(1)], [newNumberValue(1), newNumberValue(1)], -1],
    [[], [], 0],
  ])(
    "should be able to compare two vectors against each other",
    (vector1, vector2, expectedResult) => {
      expect(compare(newVectorValue(vector1), newVectorValue(vector2))).toBe(
        expectedResult,
      );
    },
  );

  it.each([
    [newTimeValue(1, 0, 0), newTimeValue(0, 0, 0), 1],
    [newTimeValue(0, 1, 0), newTimeValue(0, 0, 0), 1],
    [newTimeValue(0, 0, 1), newTimeValue(0, 0, 0), 1],
    [newTimeValue(0, 0, 0), newTimeValue(1, 0, 0), -1],
    [newTimeValue(0, 0, 0), newTimeValue(0, 1, 0), -1],
    [newTimeValue(0, 0, 0), newTimeValue(0, 0, 1), -1],
    [newTimeValue(0, 0, 0), newTimeValue(0, 0, 0), 0],
  ])(
    "should be able to compare to time values against each other",
    (time1, time2, expectedResult) => {
      expect(compare(time1, time2)).toBe(expectedResult);
    },
  );

  it.each([
    [Weekday.Tuesday, Weekday.Monday, 1],
    [Weekday.Monday, Weekday.Tuesday, -1],
    [Weekday.Wednesday, Weekday.Wednesday, 0],
  ])(
    "should be able to compare two weekdays against each other",
    (weekday1, weekday2, expectedResult) => {
      expect(
        compare(newWeekdayValue(weekday1), newWeekdayValue(weekday2)),
      ).toBe(expectedResult);
    },
  );

  it("should throw exception if trying to compare two non-matching values against each other", () => {
    expect(() => compare(newStringValue("foo"), newNumberValue(5))).toThrow(
      TypeError,
    );
  });
});
