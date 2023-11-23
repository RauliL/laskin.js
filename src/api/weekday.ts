import { Context } from "../context";
import { BuiltinQuoteCallback, Weekday } from "../types";

const weekdayConstant = (weekday: Weekday) => (context: Context) => {
  context.pushWeekday(weekday);
};

const w_isWeekend = (context: Context) => {
  const weekday = context.popWeekday();

  context.pushBoolean(
    weekday === Weekday.Saturday || weekday === Weekday.Sunday,
  );
};

const w_toNumber = (context: Context) => {
  context.pushNumber(context.popWeekday() + 1);
};

export const weekday: [string, BuiltinQuoteCallback][] = [
  // Constants.
  ["sunday", weekdayConstant(Weekday.Sunday)],
  ["monday", weekdayConstant(Weekday.Monday)],
  ["tuesday", weekdayConstant(Weekday.Tuesday)],
  ["wednesday", weekdayConstant(Weekday.Wednesday)],
  ["thursday", weekdayConstant(Weekday.Thursday)],
  ["friday", weekdayConstant(Weekday.Friday)],
  ["saturday", weekdayConstant(Weekday.Saturday)],

  // Testing methods.
  ["weekday:weekend?", w_isWeekend],

  // Conversions.
  ["weekday:>number", w_toNumber],
];
