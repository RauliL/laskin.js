import {
  DateValue,
  TimeValue,
  newTimeValue,
  MonthValue,
  WeekdayValue,
} from "../value";
import { MONTH_NAME_MAPPING, WEEKDAY_NAME_MAPPING } from "./const";
import { isValidDate, isValidTime } from "./validator";

const DATE_PATTERN = /^(\d+)-(\d{2})-(\d{2})$/;
const TIME_PATTERN = /^(\d{2}):(\d{2}):(\d{2})$/;

export const matchesDatePattern = (input: string): boolean =>
  DATE_PATTERN.test(input);

export const matchesTimePattern = (input: string): boolean =>
  TIME_PATTERN.test(input);

export const parseDateValue = (input: string): DateValue => {
  const result = DATE_PATTERN.exec(input);

  if (result == null) {
    throw new SyntaxError("Given date literal does not contain valid date.");
  }

  const year = parseInt(result[1]);
  const month = parseInt(result[2]);
  const day = parseInt(result[3]);

  if (month < 1 || month > 12 || !isValidDate(year, month - 1, day)) {
    throw new SyntaxError("Given date literal does not contain valid date.");
  }

  return {
    type: "Date",
    year,
    month: month - 1,
    day,
  };
};

export const parseTimeValue = (input: string): TimeValue => {
  const result = TIME_PATTERN.exec(input);

  if (result == null) {
    throw new SyntaxError("Given time literal does not contain valid time.");
  }

  const hour = parseInt(result[1]);
  const minute = parseInt(result[2]);
  const second = parseInt(result[3]);

  if (!isValidTime(hour, minute, second)) {
    throw new SyntaxError("Given time literal does not contain valid time.");
  }

  return newTimeValue(hour, minute, second);
};

export const parseMonthValue = (input: string): MonthValue => {
  const value = MONTH_NAME_MAPPING.get(input);

  if (value == null) {
    throw new SyntaxError(`Unrecognized month: ${input}`);
  }

  return {
    type: "Month",
    value,
  };
};

export const parseWeekdayValue = (input: string): WeekdayValue => {
  const value = WEEKDAY_NAME_MAPPING.get(input);

  if (value == null) {
    throw new SyntaxError(`Unrecognized weekday: ${input}`);
  }

  return {
    type: "Weekday",
    value,
  };
};
