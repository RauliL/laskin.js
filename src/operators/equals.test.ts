import { Month, Weekday } from "../chrono";
import { units } from "../unit";
import {
  newBooleanValue,
  newDateValue,
  newMonthValue,
  newNumberValue,
  newRecordValue,
  newStringValue,
  newTimeValue,
  newVectorValue,
  newWeekdayValue,
} from "../value";
import { equals } from "./equals";

describe("equals()", () => {
  it.each([
    [true, false, false],
    [true, true, true],
    [false, false, true],
  ])(
    "should be able to compare two booleans against each other",
    (value1, value2, expectedResult) => {
      expect(equals(newBooleanValue(value1), newBooleanValue(value2))).toBe(
        expectedResult,
      );
    },
  );

  it.each([
    [newDateValue(2023, 1, 1), newDateValue(2022, 1, 1), false],
    [newDateValue(2023, 1, 1), newDateValue(2023, 2, 1), false],
    [newDateValue(2023, 1, 1), newDateValue(2023, 1, 2), false],
    [newDateValue(2023, 1, 1), newDateValue(2023, 1, 1), true],
  ])(
    "should be able to compare two dates against each other",
    (date1, date2, expectedResult) => {
      expect(equals(date1, date2)).toBe(expectedResult);
    },
  );

  it.each([
    [Month.January, Month.February, false],
    [Month.January, Month.January, true],
  ])(
    "should be able to compare two months against each other",
    (month1, month2, expectedResult) => {
      expect(equals(newMonthValue(month1), newMonthValue(month2))).toBe(
        expectedResult,
      );
    },
  );

  it.each([
    [5, undefined, 5, undefined, true],
    [5, undefined, 6, undefined, false],
    [5, undefined, 5, units.kilogram, false],
    [1000, units.meter, 1, units.kilometer, true],
    [1000, units.meter, 1000, undefined, false],
  ])(
    "should be able to compare two numbers against each other",
    (value1, unit1, value2, unit2, expectedResult) => {
      expect(
        equals(newNumberValue(value1, unit1), newNumberValue(value2, unit2)),
      ).toBe(expectedResult);
    },
  );

  it.each([
    [newRecordValue([]), newRecordValue([]), true],
    [
      newRecordValue([]),
      newRecordValue([["foo", newBooleanValue(false)]]),
      false,
    ],
    [
      newRecordValue([["foo", newBooleanValue(true)]]),
      newRecordValue([["foo", newBooleanValue(true)]]),
      true,
    ],
    [
      newRecordValue([["foo", newBooleanValue(true)]]),
      newRecordValue([["foo", newBooleanValue(false)]]),
      false,
    ],
    [
      newRecordValue([["foo", newBooleanValue(true)]]),
      newRecordValue([["bar", newBooleanValue(true)]]),
      false,
    ],
  ])(
    "should be able to compare two records against each other",
    (record1, record2, expectedResult) => {
      expect(equals(record1, record2)).toBe(expectedResult);
    },
  );

  it.each([
    ["foo", "bar", false],
    ["foo", "foo", true],
  ])(
    "should be able to compare two strings against each other",
    (string1, string2, expectedResult) => {
      expect(equals(newStringValue(string1), newStringValue(string2))).toBe(
        expectedResult,
      );
    },
  );

  it.each([
    [newTimeValue(0, 0, 0), newTimeValue(1, 0, 0), false],
    [newTimeValue(0, 0, 0), newTimeValue(0, 1, 0), false],
    [newTimeValue(0, 0, 0), newTimeValue(0, 0, 1), false],
    [newTimeValue(0, 1, 0), newTimeValue(0, 1, 0), true],
  ])(
    "should be able to compare two times against each other",
    (time1, time2, expectedResult) => {
      expect(equals(time1, time2)).toBe(expectedResult);
    },
  );

  it.each([
    [[], [], true],
    [[newStringValue("foo")], [], false],
    [[newStringValue("foo")], [newStringValue("bar")], false],
    [[newStringValue("foo")], [newStringValue("foo")], true],
  ])(
    "should be able to compare two vectors against each other",
    (vector1, vector2, expectedResult) => {
      expect(equals(newVectorValue(vector1), newVectorValue(vector2))).toBe(
        expectedResult,
      );
    },
  );

  it.each([
    [Weekday.Monday, Weekday.Tuesday, false],
    [Weekday.Friday, Weekday.Friday, true],
  ])(
    "should be able to compare two weekdays against each other",
    (weekday1, weekday2, expectedResult) => {
      expect(equals(newWeekdayValue(weekday1), newWeekdayValue(weekday2))).toBe(
        expectedResult,
      );
    },
  );

  it("should return `false` for two non-matching values", () => {
    expect(equals(newStringValue("foo"), newBooleanValue(false))).toBe(false);
  });
});
