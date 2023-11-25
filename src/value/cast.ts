import { Decimal } from "decimal.js";

import { Month, Weekday } from "../chrono";
import { Quote } from "../quote";
import { Unit } from "../unit";
import {
  BooleanValue,
  DateValue,
  MonthValue,
  NumberValue,
  QuoteValue,
  RecordValue,
  StringValue,
  TimeValue,
  Value,
  ValueType,
  VectorValue,
  WeekdayValue,
} from "./types";

const valueAs = <T extends Value>(value: Value, type: ValueType): T => {
  if (value.type !== type) {
    throw new TypeError(
      `Unexpected ${value.type.toLowerCase()}; Was expecting ${type.toLowerCase()}.`,
    );
  }

  return value as T;
};

export const valueAsBoolean = (value: Value): boolean =>
  valueAs<BooleanValue>(value, "Boolean").value;

export const valueAsDate = (value: Value): DateValue =>
  valueAs<DateValue>(value, "Date");

export const valueAsMonth = (value: Value): Month =>
  valueAs<MonthValue>(value, "Month").value;

export const valueAsNumber = (
  value: Value,
  ...acceptedUnits: Unit[]
): Decimal => {
  const number = valueAs<NumberValue>(value, "Number");

  if (
    number.unit != null &&
    acceptedUnits.find((unit) => unit.symbol === number.unit?.symbol) == null
  ) {
    throw new TypeError(
      `Cannot use number of type ${number.unit.type.toLowerCase()} for this operation.`,
    );
  }

  return number.value;
};

export const valueAsQuote = (value: Value): Quote =>
  valueAs<QuoteValue>(value, "Quote").quote;

export const valueAsRecord = (value: Value): Map<string, Value> =>
  valueAs<RecordValue>(value, "Record").elements;

export const valueAsString = (value: Value): string =>
  valueAs<StringValue>(value, "String").value;

export const valueAsTime = (value: Value): TimeValue =>
  valueAs<TimeValue>(value, "Time");

export const valueAsVector = (value: Value): Value[] =>
  valueAs<VectorValue>(value, "Vector").elements;

export const valueAsWeekday = (value: Value): Weekday =>
  valueAs<WeekdayValue>(value, "Weekday").value;
