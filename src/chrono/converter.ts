import { DateValue, TimeValue } from "../value";

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
