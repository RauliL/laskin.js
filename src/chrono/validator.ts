import { MONTH_NAME_MAPPING, WEEKDAY_NAME_MAPPING } from "./const";
import { Month } from "./types";

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

export const isValidMonth = (input: string): boolean =>
  MONTH_NAME_MAPPING.has(input);

export const isValidWeekday = (input: string): boolean =>
  WEEKDAY_NAME_MAPPING.has(input);
