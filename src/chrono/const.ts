import { Month, Weekday } from "./types";

export const MONTH_NAME_MAPPING = new Map<string, Month>([
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

export const WEEKDAY_NAME_MAPPING = new Map<string, Weekday>([
  ["sunday", Weekday.Sunday],
  ["monday", Weekday.Monday],
  ["tuesday", Weekday.Tuesday],
  ["wednesday", Weekday.Wednesday],
  ["thursday", Weekday.Thursday],
  ["friday", Weekday.Friday],
  ["saturday", Weekday.Saturday],
]);
