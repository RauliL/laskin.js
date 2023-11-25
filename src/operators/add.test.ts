import { Month, Weekday } from "../chrono";
import { TypeError, UnitError } from "../exception";
import { units } from "../unit";
import {
  newDateValue,
  newMonthValue,
  newNumberValue,
  newRecordValue,
  newStringValue,
  newTimeValue,
  newVectorValue,
  newWeekdayValue,
  NumberValue,
  RecordValue,
  VectorValue,
} from "../value";
import { add } from "./add";

describe("add()", () => {
  it("should be able to add two numbers together", () => {
    const result = add(
      newNumberValue(15, units.meter),
      newNumberValue(25, units.meter),
    );

    expect(result).toHaveProperty("type", "Number");
    expect((result as NumberValue).value.comparedTo(40)).toBe(0);
    expect((result as NumberValue).unit).toBe(units.meter);
  });

  it("should not allow addition of two numbers with mismatching units", () => {
    expect(() =>
      add(newNumberValue(1, units.milligram), newNumberValue(2, units.hour)),
    ).toThrow(UnitError);
  });

  it("should be able to concatenate two records together", () => {
    const result = add(
      newRecordValue([["foo", newStringValue("foo")]]),
      newRecordValue([["bar", newStringValue("bar")]]),
    );

    expect(result).toHaveProperty("type", "Record");
    expect((result as RecordValue).elements.size).toBe(2);
    expect((result as RecordValue).elements.has("foo")).toBe(true);
    expect((result as RecordValue).elements.has("bar")).toBe(true);
  });

  it("should be able to concatenate two strings together", () => {
    expect(add(newStringValue("foo"), newStringValue("bar"))).toEqual({
      type: "String",
      value: "foobar",
    });
  });

  it("should be able to perform vector algebra", () => {
    expect(
      add(
        newVectorValue([newStringValue("foo")]),
        newVectorValue([newStringValue("bar")]),
      ),
    ).toEqual({
      type: "Vector",
      elements: [
        {
          type: "String",
          value: "foobar",
        },
      ],
    });
  });

  it("should be able to perform vector algebra with numbers", () => {
    const result = add(
      newVectorValue([newNumberValue(5), newNumberValue(2)]),
      newNumberValue(1),
    );

    expect(result).toHaveProperty("type", "Vector");
    expect((result as VectorValue).elements).toHaveLength(2);
    expect(
      ((result as VectorValue).elements[0] as NumberValue).value.comparedTo(6),
    ).toBe(0);
    expect(
      ((result as VectorValue).elements[1] as NumberValue).value.comparedTo(3),
    ).toBe(0);
  });

  it.each([units.day, undefined])(
    "should be able to add days into date",
    (unit) => {
      expect(
        add(newDateValue(2023, Month.January, 1), newNumberValue(5, unit)),
      ).toEqual({
        type: "Date",
        year: 2023,
        month: Month.January,
        day: 6,
      });
    },
  );

  it("should not allow adding non-day numbers to a date", () => {
    expect(() =>
      add(
        newDateValue(2023, Month.January, 1),
        newNumberValue(5, units.kilogram),
      ),
    ).toThrow(TypeError);
  });

  it("should allow iteration of months", () => {
    expect(add(newMonthValue(Month.January), newNumberValue(3))).toHaveProperty(
      "value",
      Month.April,
    );
  });

  it("should allow reverse iteration of months", () => {
    expect(
      add(newMonthValue(Month.January), newNumberValue(-1)),
    ).toHaveProperty("value", Month.December);
  });

  it("should not allow addition of numbers with units to a month", () => {
    expect(() =>
      add(newMonthValue(Month.December), newNumberValue(5, units.gram)),
    ).toThrow(TypeError);
  });

  it.each([units.second, undefined])(
    "should allow addition of seconds to a time",
    (unit) => {
      expect(add(newTimeValue(0, 0, 0), newNumberValue(30, unit))).toEqual({
        type: "Time",
        hour: 0,
        minute: 0,
        second: 30,
      });
    },
  );

  it("should allow addition of minutes to a time", () => {
    expect(add(newTimeValue(0, 0, 0), newNumberValue(5, units.minute))).toEqual(
      {
        type: "Time",
        hour: 0,
        minute: 5,
        second: 0,
      },
    );
  });

  it("should allow addition of hours to a time", () => {
    expect(add(newTimeValue(0, 0, 0), newNumberValue(2, units.hour))).toEqual({
      type: "Time",
      hour: 2,
      minute: 0,
      second: 0,
    });
  });

  it("should allow addition of days to a time", () => {
    expect(add(newTimeValue(3, 0, 0), newNumberValue(0.5, units.day))).toEqual({
      type: "Time",
      hour: 15,
      minute: 0,
      second: 0,
    });
  });

  it("should not allow addition of non-time numbers to a time", () => {
    expect(() =>
      add(newTimeValue(0, 0, 0), newNumberValue(15, units.centimeter)),
    ).toThrow(TypeError);
  });

  it("should allow iteration of weekdays", () => {
    expect(
      add(newWeekdayValue(Weekday.Monday), newNumberValue(3)),
    ).toHaveProperty("value", Weekday.Thursday);
  });

  it("should allow reverse iteration of weekdays", () => {
    expect(
      add(newWeekdayValue(Weekday.Sunday), newNumberValue(-1)),
    ).toHaveProperty("value", Weekday.Saturday);
  });

  it("should not allow addition of numbers with units to a weekday", () => {
    expect(() =>
      add(newWeekdayValue(Weekday.Monday), newNumberValue(5, units.gram)),
    ).toThrow(TypeError);
  });
});
