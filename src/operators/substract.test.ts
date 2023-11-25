import { TypeError } from "../exception";
import {
  NumberValue,
  newNumberValue,
  newDateValue,
  newRecordValue,
  newStringValue,
  RecordValue,
  newTimeValue,
  newVectorValue,
  VectorValue,
  newMonthValue,
  newWeekdayValue,
} from "../value";
import { units } from "../unit";
import { substract } from "./substract";
import { UnitError } from "../exception";
import { Month, Weekday } from "../chrono";

describe("substract()", () => {
  it("should be able to substract two numbers from each other", () => {
    const result = substract(
      newNumberValue(25, units.meter),
      newNumberValue(15, units.meter),
    );

    expect(result).toHaveProperty("type", "Number");
    expect((result as NumberValue).value.comparedTo(10)).toBe(0);
    expect((result as NumberValue).unit).toBe(units.meter);
  });

  it("should not allow substraction of two numbers with mismatching units", () =>
    expect(() =>
      substract(
        newNumberValue(5, units.kilogram),
        newNumberValue(5, units.hour),
      ),
    ).toThrow(UnitError));

  it("should be able to substract two dates from each other", () => {
    const result = substract(
      newDateValue(2023, Month.January, 25),
      newDateValue(2023, Month.January, 15),
    );

    expect(result).toHaveProperty("type", "Number");
    expect((result as NumberValue).value.comparedTo(10)).toBe(0);
    expect((result as NumberValue).unit).toBe(units.day);
  });

  it("should be able to substract two records from each other", () => {
    const result = substract(
      newRecordValue([["foo", newStringValue("bar")]]),
      newRecordValue([["foo", newStringValue("bar")]]),
    );

    expect(result).toHaveProperty("type", "Record");
    expect((result as RecordValue).elements.has("foo")).toBe(false);
  });

  it("should be able to substract two times from each other", () => {
    const result = substract(newTimeValue(15, 30, 0), newTimeValue(15, 0, 0));

    expect(result).toHaveProperty("type", "Number");
    expect((result as NumberValue).value.comparedTo(1800)).toBe(0);
    expect((result as NumberValue).unit).toBe(units.second);
  });

  it("should be able to perform vector algebra", () => {
    const result = substract(
      newVectorValue([newNumberValue(5), newNumberValue(2)]),
      newVectorValue([newNumberValue(5), newNumberValue(1)]),
    );

    expect(result).toHaveProperty("type", "Vector");
    expect((result as VectorValue).elements).toHaveLength(2);
    expect(
      ((result as VectorValue).elements[0] as NumberValue).value.comparedTo(0),
    ).toBe(0);
    expect(
      ((result as VectorValue).elements[1] as NumberValue).value.comparedTo(1),
    ).toBe(0);
  });

  it("should be able to perform vector algebra with numbers", () => {
    const result = substract(
      newVectorValue([newNumberValue(5), newNumberValue(2)]),
      newNumberValue(1),
    );

    expect(result).toHaveProperty("type", "Vector");
    expect((result as VectorValue).elements).toHaveLength(2);
    expect(
      ((result as VectorValue).elements[0] as NumberValue).value.comparedTo(4),
    ).toBe(0);
    expect(
      ((result as VectorValue).elements[1] as NumberValue).value.comparedTo(1),
    ).toBe(0);
  });

  it.each([undefined, units.day])(
    "should be able to substract numbers from date",
    (unit) =>
      expect(
        substract(
          newDateValue(2023, Month.January, 5),
          newNumberValue(4, unit),
        ),
      ).toEqual({
        type: "Date",
        year: 2023,
        month: Month.January,
        day: 1,
      }),
  );

  it("should not allow non-day numbers to be substracted from date", () =>
    expect(() =>
      substract(
        newDateValue(2023, Month.January, 5),
        newNumberValue(5, units.kilogram),
      ),
    ).toThrow(TypeError));

  it.each([
    [Month.April, 3, Month.January],
    [Month.January, 1, Month.December],
    [Month.December, -1, Month.January],
    [Month.August, -4, Month.December],
  ])("should allow iteration of months", (month, delta, expectedResult) => {
    expect(
      substract(newMonthValue(month), newNumberValue(delta)),
    ).toHaveProperty("value", expectedResult);
  });

  it("should not allow substraction of numbers with units to a month", () => {
    expect(() =>
      substract(newMonthValue(Month.December), newNumberValue(5, units.gram)),
    ).toThrow(TypeError);
  });

  it.each([units.second, undefined])(
    "should allow substraction of seconds to a time",
    (unit) => {
      expect(
        substract(newTimeValue(0, 0, 30), newNumberValue(30, unit)),
      ).toEqual({
        type: "Time",
        hour: 0,
        minute: 0,
        second: 0,
      });
    },
  );

  it("should allow substraction of minutes to a time", () => {
    expect(
      substract(newTimeValue(0, 5, 0), newNumberValue(5, units.minute)),
    ).toEqual({
      type: "Time",
      hour: 0,
      minute: 0,
      second: 0,
    });
  });

  it("should allow addition of hours to a time", () => {
    expect(
      substract(newTimeValue(5, 0, 0), newNumberValue(2, units.hour)),
    ).toEqual({
      type: "Time",
      hour: 3,
      minute: 0,
      second: 0,
    });
  });

  it("should allow substraction of days to a time", () => {
    expect(
      substract(newTimeValue(3, 0, 0), newNumberValue(0.5, units.day)),
    ).toEqual({
      type: "Time",
      hour: 15,
      minute: 0,
      second: 0,
    });
  });

  it("should not allow substraction of non-time numbers to a time", () => {
    expect(() =>
      substract(newTimeValue(0, 0, 0), newNumberValue(15, units.centimeter)),
    ).toThrow(TypeError);
  });

  it.each([
    [Weekday.Thursday, 3, Weekday.Monday],
    [Weekday.Monday, 3, Weekday.Friday],
    [Weekday.Saturday, -1, Weekday.Sunday],
    [Weekday.Thursday, -2, Weekday.Saturday],
  ])("should allow iteration of weekdays", (weekday, delta, expectedResult) => {
    expect(
      substract(newWeekdayValue(weekday), newNumberValue(delta)),
    ).toHaveProperty("value", expectedResult);
  });

  it("should not allow addition of numbers with units to a weekday", () => {
    expect(() =>
      substract(newWeekdayValue(Weekday.Monday), newNumberValue(5, units.gram)),
    ).toThrow(TypeError);
  });

  it("should not allow addition of non-matching values together", () => {
    expect(() =>
      substract(newStringValue("foo"), newWeekdayValue(Weekday.Monday)),
    ).toThrow(TypeError);
  });
});
