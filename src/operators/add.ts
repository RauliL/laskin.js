import {
  addDays,
  addSeconds,
  secondsInDay,
  secondsInHour,
  secondsInMinute,
} from "date-fns";
import { Decimal } from "decimal.js";

import {
  dateToDateValue,
  dateToTimeValue,
  dateValueToDate,
  timeValueToDate,
} from "../chrono";
import { TypeError } from "../exception";
import {
  DateValue,
  Month,
  MonthValue,
  NumberValue,
  RecordValue,
  StringValue,
  TimeValue,
  Value,
  VectorValue,
  Weekday,
  WeekdayValue,
} from "../types";
import {
  numberValueBinaryOperator,
  vectorValueBinaryOperator,
  vectorValueNumberBinaryOperator,
} from "./utils";
import {
  newMonthValue,
  newRecordValue,
  newStringValue,
  newWeekdayValue,
} from "../value";

const addNumber = (a: NumberValue, b: NumberValue): NumberValue =>
  numberValueBinaryOperator(a, b, Decimal.prototype.add);

const addVector = (a: VectorValue, b: VectorValue): VectorValue =>
  vectorValueBinaryOperator(a, b, add);

const addRecord = (a: RecordValue, b: RecordValue): RecordValue => {
  const result = new Map<string, Value>(a.elements);

  for (const [key, value] of b.elements) {
    result.set(key, value);
  }

  return newRecordValue(result);
};

const addString = (a: StringValue, b: StringValue): StringValue =>
  newStringValue(a.value + b.value);

const addNumberToDate = (a: DateValue, b: NumberValue): DateValue => {
  const date = dateValueToDate(a);

  if (b.unit != null && b.unit.symbol !== "d") {
    throw new TypeError("Cannot add number to date.");
  }

  return dateToDateValue(addDays(date, b.value.toNumber()));
};

const addNumberToMonth = (a: MonthValue, b: NumberValue): MonthValue => {
  let current: Month;
  let delta: Decimal;

  if (b.unit != null) {
    throw new TypeError("Cannot add number to month.");
  }
  current = a.value;
  delta = b.value;
  if (delta.comparedTo(0) < 0) {
    delta = delta.neg();
    while (delta.comparedTo(0) > 0) {
      if (current === Month.January) {
        current = Month.December;
      } else {
        --current;
      }
      delta = delta.sub(1);
    }
  } else {
    while (delta.comparedTo(0) > 0) {
      if (current === Month.December) {
        current = Month.January;
      } else {
        ++current;
      }
      delta = delta.sub(1);
    }
  }

  return newMonthValue(current);
};

const addNumberToTime = (a: TimeValue, b: NumberValue): TimeValue => {
  const date = timeValueToDate(a);
  const { unit } = b;
  let delta: number;

  if (unit != null) {
    if (unit.symbol === "s") {
      delta = b.value.toNumber();
    } else if (unit.symbol === "min") {
      delta = b.value.toNumber() * secondsInMinute;
    } else if (unit.symbol === "h") {
      delta = b.value.toNumber() * secondsInHour;
    } else if (unit.symbol === "d") {
      delta = b.value.toNumber() * secondsInDay;
    } else {
      throw new TypeError("Cannot add number to time.");
    }
  } else {
    delta = b.value.toNumber();
  }

  return dateToTimeValue(addSeconds(date, delta));
};

const addNumberToVector = (a: VectorValue, b: NumberValue): VectorValue =>
  vectorValueNumberBinaryOperator(a, b, add);

const addNumberToWeekday = (a: WeekdayValue, b: NumberValue): WeekdayValue => {
  let delta: Decimal;
  let current: Weekday;

  if (b.unit != null && b.unit.symbol !== "d") {
    throw new TypeError("Cannot add number to weekday.");
  }
  delta = b.value;
  current = a.value;
  if (delta.comparedTo(0) < 0) {
    delta = delta.neg();
    while (delta.comparedTo(0) > 0) {
      if (current === Weekday.Monday) {
        current = Weekday.Sunday;
      } else {
        --current;
      }
      delta = delta.sub(1);
    }
  } else {
    while (delta.comparedTo(0) > 0) {
      if (current === Weekday.Sunday) {
        current = Weekday.Monday;
      } else {
        ++current;
      }
      delta = delta.sub(1);
    }
  }

  return newWeekdayValue(current);
};

export const add = (a: Value, b: Value): Value => {
  if (a.type === b.type) {
    switch (a.type) {
      case "Number":
        return addNumber(a as NumberValue, b as NumberValue);

      case "Vector":
        return addVector(a as VectorValue, b as VectorValue);

      case "Record":
        return addRecord(a as RecordValue, b as RecordValue);

      case "String":
        return addString(a as StringValue, b as StringValue);
    }
  } else if (b.type === "Number") {
    switch (a.type) {
      case "Date":
        return addNumberToDate(a as DateValue, b as NumberValue);

      case "Month":
        return addNumberToMonth(a as MonthValue, b as NumberValue);

      case "Time":
        return addNumberToTime(a as TimeValue, b as NumberValue);

      case "Vector":
        return addNumberToVector(a as VectorValue, b as NumberValue);

      case "Weekday":
        return addNumberToWeekday(a as WeekdayValue, b as NumberValue);
    }
  }

  throw new TypeError(
    `Cannot add ${a.type.toLowerCase()} to ${b.type.toLowerCase()}.`,
  );
};
