import {
  addDays,
  getDayOfYear,
  getDaysInMonth,
  getDaysInYear,
  getUnixTime,
  isLeapYear,
  subDays,
} from "date-fns";
import strftime from "strftime";

import { dateToDateValue, dateValueToDate } from "../chrono";
import { Context } from "../context";
import { BuiltinQuoteCallback } from "../quote";
import { units } from "../unit";
import { newMonthValue, newNumberValue } from "../value";

const w_today = (context: Context) => {
  context.push(dateToDateValue(new Date()));
};

const w_tomorrow = (context: Context) => {
  const tomorrow = addDays(new Date(), 1);

  context.push(dateToDateValue(tomorrow));
};

const w_yesterday = (context: Context) => {
  const yesterday = subDays(new Date(), 1);

  context.push(dateToDateValue(yesterday));
};

const w_year = (context: Context) => {
  context.pushNumber(context.peekDate().year);
};

const w_month = (context: Context) => {
  context.pushMonth(context.peekDate().month);
};

const w_day = (context: Context) => {
  context.pushNumber(context.peekDate().day);
};

const w_weekday = (context: Context) => {
  const date = dateValueToDate(context.peekDate());

  context.pushWeekday(date.getDay());
};

const w_dayOfYear = (context: Context) => {
  const date = dateValueToDate(context.peekDate());

  context.pushNumber(getDayOfYear(date));
};

const w_daysInMonth = (context: Context) => {
  const date = dateValueToDate(context.peekDate());

  context.pushNumber(getDaysInMonth(date));
};

const w_daysInYear = (context: Context) => {
  const date = dateValueToDate(context.peekDate());

  context.pushNumber(getDaysInYear(date));
};

const w_isLeapYear = (context: Context) => {
  const date = dateValueToDate(context.peekDate());

  context.pushBoolean(isLeapYear(date));
};

const w_format = (context: Context) => {
  const value = context.popDate();
  const date = dateValueToDate(value);
  const formatString = context.popString();

  context.pushString(strftime(formatString, date));
};

const w_toNumber = (context: Context) => {
  const value = context.popDate();
  const date = dateValueToDate(value);

  context.pushNumber(getUnixTime(date), units.second);
};

const w_toVector = (context: Context) => {
  const value = context.popDate();

  context.pushVector([
    newNumberValue(value.year),
    newMonthValue(value.month),
    newNumberValue(value.day),
  ]);
};

export const date: [string, BuiltinQuoteCallback][] = [
  ["today", w_today],
  ["tomorrow", w_tomorrow],
  ["yesterday", w_yesterday],

  ["date:year", w_year],
  ["date:month", w_month],
  ["date:day", w_day],
  ["date:weekday", w_weekday],
  ["date:day-of-year", w_dayOfYear],
  ["date:days-in-month", w_daysInMonth],
  ["date:days-in-year", w_daysInYear],
  ["date:leap-year?", w_isLeapYear],

  ["date:format", w_format],

  ["date:>number", w_toNumber],
  ["date:>vector", w_toVector],
];
