import { secondsInHour, secondsInMinute } from "date-fns";
import strftime from "strftime";

import { dateToTimeValue, timeValueToDate } from "../chrono";
import { Context } from "../context";
import { BuiltinQuoteCallback } from "../quote";
import { units } from "../unit";
import { newNumberValue } from "../value";

const w_now = (context: Context) => {
  context.push(dateToTimeValue(new Date()));
};

const w_hour = (context: Context) => {
  context.pushNumber(context.peekTime().hour, units.hour);
};

const w_minute = (context: Context) => {
  context.pushNumber(context.peekTime().minute, units.minute);
};

const w_second = (context: Context) => {
  context.pushNumber(context.peekTime().second, units.second);
};

const w_format = (context: Context) => {
  const date = timeValueToDate(context.popTime());
  const formatString = context.popString();

  context.pushString(strftime(formatString, date));
};

const w_toNumber = (context: Context) => {
  const time = context.popTime();
  let result = 0;

  result += time.hour * secondsInHour;
  result += time.minute * secondsInMinute;
  result += time.second;

  context.pushNumber(result, units.second);
};

const w_toVector = (context: Context) => {
  const time = context.popTime();

  context.pushVector([
    newNumberValue(time.hour, units.hour),
    newNumberValue(time.minute, units.minute),
    newNumberValue(time.second, units.second),
  ]);
};

export const time: [string, BuiltinQuoteCallback][] = [
  ["now", w_now],

  ["time:hour", w_hour],
  ["time:minute", w_minute],
  ["time:second", w_second],

  ["time:format", w_format],

  ["time:>number", w_toNumber],
  ["time:>vector", w_toVector],
];
