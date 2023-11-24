import { TypeError } from "../exception";
import { toBaseUnit, unitCheck } from "../number";
import {
  DateValue,
  MonthValue,
  NumberValue,
  StringValue,
  TimeValue,
  Value,
  VectorValue,
  WeekdayValue,
} from "../types";

const compareDate = (a: DateValue, b: DateValue): number => {
  if (a.year > b.year) {
    return 1;
  } else if (a.year < b.year) {
    return -1;
  }

  if (a.month > b.month) {
    return 1;
  } else if (a.month < b.month) {
    return -1;
  }

  if (a.day > b.day) {
    return 1;
  } else if (a.day < b.day) {
    return -1;
  }

  return 0;
};

const compareMonth = (a: MonthValue, b: MonthValue): number =>
  a.value > b.value ? 1 : a.value < b.value ? -1 : 0;

const compareNumber = (a: NumberValue, b: NumberValue): number => {
  unitCheck(a, b);

  const baseValueA = toBaseUnit(a);
  const baseValueB = toBaseUnit(b);

  return baseValueA.comparedTo(baseValueB);
};

const compareString = (a: StringValue, b: StringValue): number =>
  a.value.localeCompare(b.value);

const compareTime = (a: TimeValue, b: TimeValue): number => {
  if (a.hour > b.hour) {
    return 1;
  } else if (a.hour < b.hour) {
    return -1;
  }

  if (a.minute > b.minute) {
    return 1;
  } else if (a.minute < b.minute) {
    return -1;
  }

  if (a.second > b.second) {
    return 1;
  } else if (a.second < b.second) {
    return -1;
  }

  return 0;
};

const compareVector = (a: VectorValue, b: VectorValue): number => {
  const minSize = Math.min(a.elements.length, b.elements.length);

  for (let i = 0; i < minSize; ++i) {
    const cmp = compare(a.elements[i], b.elements[i]);

    if (cmp !== 0) {
      return cmp;
    }
  }

  return a.elements.length > b.elements.length
    ? 1
    : a.elements.length < b.elements.length
      ? -1
      : 0;
};

const compareWeekday = (a: WeekdayValue, b: WeekdayValue): number =>
  a.value > b.value ? 1 : a.value < b.value ? -1 : 0;

export const compare = (a: Value, b: Value): number => {
  if (a.type === b.type) {
    switch (a.type) {
      case "Date":
        return compareDate(a as DateValue, b as DateValue);

      case "Month":
        return compareMonth(a as MonthValue, b as MonthValue);

      case "Number":
        return compareNumber(a as NumberValue, b as NumberValue);

      case "String":
        return compareString(a as StringValue, b as StringValue);

      case "Time":
        return compareTime(a as TimeValue, b as TimeValue);

      case "Vector":
        return compareVector(a as VectorValue, b as VectorValue);

      case "Weekday":
        return compareWeekday(a as WeekdayValue, b as WeekdayValue);
    }
  }

  throw new TypeError(
    `Cannot compare ${a.type.toLowerCase()} with ${b.type.toLowerCase()}.`,
  );
};
