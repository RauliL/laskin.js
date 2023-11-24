import Decimal from "decimal.js";

import { isValidDate, isValidTime } from "./chrono";
import { TypeError } from "./exception";
import { Quote } from "./quote";
import {
  BooleanValue,
  DateValue,
  Month,
  MonthValue,
  NumberValue,
  QuoteValue,
  RecordValue,
  StringValue,
  TimeValue,
  Unit,
  Value,
  VectorValue,
  Weekday,
  WeekdayValue,
} from "./types";

export const newBooleanValue = (value: boolean = false): BooleanValue => ({
  type: "Boolean",
  value,
});

export const newDateValue = (
  year: number = 1970,
  month: Month = Month.January,
  day: number = 1,
): DateValue => {
  if (!isValidDate(year, month, day)) {
    throw new TypeError("Given date is not valid date.");
  }

  return {
    type: "Date",
    year,
    month,
    day,
  };
};

export const newMonthValue = (value: Month = Month.January): MonthValue => ({
  type: "Month",
  value,
});

export const newNumberValue = (
  value: Decimal.Value = 0,
  unit?: Unit,
): NumberValue => ({
  type: "Number",
  value: value instanceof Decimal ? value : new Decimal(value),
  unit,
});

export const newQuoteValue = (quote: Quote): QuoteValue => ({
  type: "Quote",
  quote,
});

export const newRecordValue = (
  elements: Iterable<[string, Value]>,
): RecordValue => ({
  type: "Record",
  elements: new Map<string, Value>(elements),
});

export const newStringValue = (value: string = ""): StringValue => ({
  type: "String",
  value,
});

export const newTimeValue = (
  hour: number = 0,
  minute: number = 0,
  second: number = 0,
): TimeValue => {
  if (!isValidTime(hour, minute, second)) {
    throw new TypeError("Given time is not valid time.");
  }

  return {
    type: "Time",
    hour,
    minute,
    second,
  };
};

export const newVectorValue = (elements: Value[] = []): VectorValue => ({
  type: "Vector",
  elements: [...elements],
});

export const newWeekdayValue = (
  value: Weekday = Weekday.Sunday,
): WeekdayValue => ({
  type: "Weekday",
  value,
});

export const valueAsNumber = (
  value: Value,
  ...acceptedUnits: Unit[]
): Decimal => {
  if (value.type === "Number") {
    const number = value as NumberValue;

    if (
      number.unit != null &&
      acceptedUnits.find((unit) => unit.symbol === number.unit?.symbol) == null
    ) {
      throw new TypeError(
        `Cannot use number of type ${number.unit.type.toLowerCase()} for this operation.`,
      );
    }

    return number.value;
  }

  throw new TypeError(
    `Unexpected ${value.type.toLowerCase()}; Was expecting number.`,
  );
};
