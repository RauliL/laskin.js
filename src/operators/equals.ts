import { toBaseUnit } from "../number";
import {
  BooleanValue,
  DateValue,
  MonthValue,
  NumberValue,
  RecordValue,
  StringValue,
  TimeValue,
  Value,
  VectorValue,
  WeekdayValue,
} from "../value";

const eqBoolean = (a: BooleanValue, b: BooleanValue): boolean =>
  a.value === b.value;

const eqDate = (a: DateValue, b: DateValue): boolean =>
  a.year === b.year && a.month === b.month && a.day === b.day;

const eqMonth = (a: MonthValue, b: MonthValue): boolean => a.value === b.value;

const eqNumber = (a: NumberValue, b: NumberValue): boolean => {
  if (a.unit != null) {
    if (b.unit == null || a.unit.type !== b.unit.type) {
      return false;
    }
  } else if (b.unit != null) {
    return false;
  }

  return toBaseUnit(a).equals(toBaseUnit(b));
};

const eqRecord = (a: RecordValue, b: RecordValue): boolean => {
  if (a.elements.size !== b.elements.size) {
    return false;
  }

  for (const [key, value] of a.elements) {
    const otherValue = b.elements.get(key);

    if (otherValue == null || !equals(value, otherValue)) {
      return false;
    }
  }

  return true;
};

const eqString = (a: StringValue, b: StringValue): boolean =>
  a.value === b.value;

const eqTime = (a: TimeValue, b: TimeValue): boolean =>
  a.hour === b.hour && a.minute === b.minute && a.second === b.second;

const eqVector = (a: VectorValue, b: VectorValue): boolean => {
  if (a.elements.length !== b.elements.length) {
    return false;
  }

  for (let i = 0; i < a.elements.length; ++i) {
    if (!equals(a.elements[i], b.elements[i])) {
      return false;
    }
  }

  return true;
};

const eqWeekday = (a: WeekdayValue, b: WeekdayValue): boolean =>
  a.value === b.value;

export const equals = (a: Value, b: Value): boolean => {
  if (a.type === b.type) {
    switch (a.type) {
      case "Boolean":
        return eqBoolean(a as BooleanValue, b as BooleanValue);

      case "Date":
        return eqDate(a as DateValue, b as DateValue);

      case "Month":
        return eqMonth(a as MonthValue, b as MonthValue);

      case "Number":
        return eqNumber(a as NumberValue, b as NumberValue);

      // TODO: case "Quote":

      case "Record":
        return eqRecord(a as RecordValue, b as RecordValue);

      case "String":
        return eqString(a as StringValue, b as StringValue);

      case "Time":
        return eqTime(a as TimeValue, b as TimeValue);

      case "Vector":
        return eqVector(a as VectorValue, b as VectorValue);

      case "Weekday":
        return eqWeekday(a as WeekdayValue, b as WeekdayValue);
    }
  }

  return false;
};
