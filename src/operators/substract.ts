import {
  differenceInDays,
  differenceInSeconds,
  minutesInHour,
  secondsInDay,
  secondsInHour,
  sub,
} from "date-fns";
import Decimal from "decimal.js";

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
  TimeValue,
  Value,
  VectorValue,
  Weekday,
  WeekdayValue,
} from "../types";
import { day, second } from "../unit";
import {
  numberValueBinaryOperator,
  vectorValueBinaryOperator,
  vectorValueNumberBinaryOperator,
} from "./utils";
import {
  newMonthValue,
  newNumberValue,
  newRecordValue,
  newWeekdayValue,
} from "../value";

const subDate = (a: DateValue, b: DateValue): NumberValue =>
  newNumberValue(differenceInDays(dateValueToDate(a), dateValueToDate(b)), day);

const subNumber = (a: NumberValue, b: NumberValue): NumberValue =>
  numberValueBinaryOperator(a, b, Decimal.prototype.sub);

const subRecord = (a: RecordValue, b: RecordValue): RecordValue => {
  const result = new Map<string, Value>(a.elements);

  for (const [key] of b.elements) {
    result.delete(key);
  }

  return newRecordValue(result);
};

const subTime = (a: TimeValue, b: TimeValue): NumberValue =>
  newNumberValue(
    differenceInSeconds(timeValueToDate(a), timeValueToDate(b)),
    second,
  );

const subVector = (a: VectorValue, b: VectorValue): VectorValue =>
  vectorValueBinaryOperator(a, b, substract);

const subNumberFromDate = (a: DateValue, b: NumberValue): DateValue => {
  if (b.unit != null && b.unit.symbol !== "d") {
    throw new TypeError("Cannot substract number from date.");
  }

  return dateToDateValue(sub(dateValueToDate(a), { days: b.value.toNumber() }));
};

const subNumberFromMonth = (a: MonthValue, b: NumberValue): MonthValue => {
  let current: Month;
  let delta: Decimal;

  if (b.unit != null) {
    throw new TypeError("Cannot substract number from month.");
  }
  current = a.value;
  delta = b.value;
  if (delta.comparedTo(0) < 0) {
    delta = delta.neg();
    while (delta.comparedTo(0) > 0) {
      if (current === Month.December) {
        current = Month.January;
      } else {
        ++current;
      }
      delta = delta.sub(1);
    }
  } else {
    while (delta.comparedTo(0) > 0) {
      if (current === Month.January) {
        current = Month.December;
      } else {
        --current;
      }
      delta = delta.sub(1);
    }
  }

  return newMonthValue(current);
};

const subNumberFromTime = (a: TimeValue, b: NumberValue): TimeValue => {
  let delta: number;

  if (b.unit != null) {
    switch (b.unit.symbol) {
      case "s":
        delta = b.value.toNumber();
        break;

      case "min":
        delta = b.value.mul(minutesInHour).toNumber();
        break;

      case "h":
        delta = b.value.mul(secondsInHour).toNumber();
        break;

      case "d":
        delta = b.value.mul(secondsInDay).toNumber();
        break;

      default:
        throw new TypeError("Cannot substract number from time.");
    }
  } else {
    delta = b.value.toNumber();
  }

  return dateToTimeValue(sub(timeValueToDate(a), { seconds: delta }));
};

const subNumberFromVector = (a: VectorValue, b: NumberValue): VectorValue =>
  vectorValueNumberBinaryOperator(a, b, substract);

const subNumberFromWeekday = (
  a: WeekdayValue,
  b: NumberValue,
): WeekdayValue => {
  let delta: Decimal;
  let current: Weekday;

  if (b.unit != null && b.unit.symbol !== "d") {
    throw new TypeError("Cannot substract number from weekday.");
  }
  delta = b.value;
  current = a.value;
  if (delta.comparedTo(0) < 0) {
    delta = delta.neg();
    while (delta.comparedTo(0) > 0) {
      if (current === Weekday.Saturday) {
        current = Weekday.Sunday;
      } else {
        ++current;
      }
      delta = delta.sub(1);
    }
  } else {
    while (delta.comparedTo(0) > 0) {
      if (current === Weekday.Sunday) {
        current = Weekday.Saturday;
      } else {
        --current;
      }
      delta = delta.sub(1);
    }
  }

  return newWeekdayValue(current);
};

export const substract = (a: Value, b: Value): Value => {
  if (a.type === b.type) {
    switch (a.type) {
      case "Date":
        return subDate(a as DateValue, b as DateValue);

      case "Number":
        return subNumber(a as NumberValue, b as NumberValue);

      case "Record":
        return subRecord(a as RecordValue, b as RecordValue);

      case "Time":
        return subTime(a as TimeValue, b as TimeValue);

      case "Vector":
        return subVector(a as VectorValue, b as VectorValue);
    }
  } else if (b.type === "Number") {
    switch (a.type) {
      case "Date":
        return subNumberFromDate(a as DateValue, b as NumberValue);

      case "Month":
        return subNumberFromMonth(a as MonthValue, b as NumberValue);

      case "Time":
        return subNumberFromTime(a as TimeValue, b as NumberValue);

      case "Vector":
        return subNumberFromVector(a as VectorValue, b as NumberValue);

      case "Weekday":
        return subNumberFromWeekday(a as WeekdayValue, b as NumberValue);
    }
  }

  throw new TypeError(
    `Cannot substract ${a.type.toLowerCase()} from ${b.type.toLowerCase()}.`,
  );
};
