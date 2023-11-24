import { LaskinError, SyntaxError } from "./exception";
import { Month, Weekday } from "./types";
import { DateValue, TimeValue, newTimeValue } from "./value";

const DATE_PATTERN = /^(\d+)-(\d{2})-(\d{2})$/;
const TIME_PATTERN = /^(\d{2}):(\d{2}):(\d{2})$/;

export const isDate = (input: string): boolean => DATE_PATTERN.test(input);

export const isValidDate = (
  year: number,
  month: Month,
  day: number,
): boolean => {
  const date = new Date(year, month, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month &&
    date.getDate() === day
  );
};

export const parseDate = (input: string): DateValue => {
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

export const isTime = (input: string): boolean => TIME_PATTERN.test(input);

export const isValidTime = (
  hour: number,
  minute: number,
  second: number,
): boolean =>
  hour >= 0 &&
  hour < 24 &&
  minute >= 0 &&
  minute < 60 &&
  second >= 0 &&
  second < 60;

export const parseTime = (input: string): TimeValue => {
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

const MONTH_NAME_MAPPING = new Map<string, Month>([
  ["january", Month.January],
  ["february", Month.February],
  ["march", Month.March],
  ["april", Month.April],
  ["may", Month.May],
  ["june", Month.June],
  ["july", Month.July],
  ["august", Month.August],
  ["september", Month.September],
  ["october", Month.October],
  ["november", Month.November],
  ["december", Month.December],
]);

export const isMonth = (input: string): boolean =>
  MONTH_NAME_MAPPING.has(input);

export const parseMonth = (input: string): Month => {
  const value = MONTH_NAME_MAPPING.get(input);

  if (value == null) {
    throw new LaskinError(`Unrecognized month: ${input}`);
  }

  return value;
};

const WEEKDAY_NAME_MAPPING = new Map<string, Weekday>([
  ["sunday", Weekday.Sunday],
  ["monday", Weekday.Monday],
  ["tuesday", Weekday.Tuesday],
  ["wednesday", Weekday.Wednesday],
  ["thursday", Weekday.Thursday],
  ["friday", Weekday.Friday],
  ["saturday", Weekday.Saturday],
]);

export const isWeekday = (input: string): boolean =>
  WEEKDAY_NAME_MAPPING.has(input);

export const parseWeekday = (input: string): Weekday => {
  const value = WEEKDAY_NAME_MAPPING.get(input);

  if (value == null) {
    throw new LaskinError(`Unrecognized weekday: ${input}`);
  }

  return value;
};

export const dateValueToDate = (value: DateValue): Date =>
  new Date(value.year, value.month, value.day);

export const dateToDateValue = (date: Date): DateValue => ({
  type: "Date",
  year: date.getFullYear(),
  month: date.getMonth(),
  day: date.getDate(),
});

export const timeValueToDate = (value: TimeValue): Date =>
  new Date(0, 1, 1, value.hour, value.minute, value.second);

export const dateToTimeValue = (date: Date): TimeValue => ({
  type: "Time",
  hour: date.getHours(),
  minute: date.getMinutes(),
  second: date.getSeconds(),
});
