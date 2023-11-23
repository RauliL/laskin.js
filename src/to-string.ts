import { format } from "date-fns";

import { Month, Value, Weekday } from "./types";
import { ValueVisitor, visitValue } from "./visitor";
import { dateValueToDate, timeValueToDate } from "./chrono";

const visitor: ValueVisitor<string> = {
  visitBoolean(value) {
    return value.value ? "true" : "false";
  },

  visitDate(value) {
    return format(dateValueToDate(value), "yyyy-MM-dd");
  },

  visitMonth(value) {
    return Month[value.value].toLowerCase();
  },

  visitNumber(value) {
    return `${value.value}${value.unit?.symbol ?? ""}`;
  },

  visitQuote(value) {
    return value.quote.toSource();
  },

  visitRecord(value) {
    let result = "";
    let first = true;

    for (const [key, element] of value.elements) {
      if (first) {
        first = false;
      } else {
        result += ", ";
      }
      result += `${key}=${valueToString(element)}`;
    }

    return result;
  },

  visitString(value) {
    return value.value;
  },

  visitTime(value) {
    return format(timeValueToDate(value), "HH:mm:ss");
  },

  visitVector(value) {
    return value.elements.map(valueToString).join(", ");
  },

  visitWeekday(value) {
    return Weekday[value.value].toLowerCase();
  },
};

export const valueToString = (value: Value): string =>
  visitValue(visitor, value, undefined);
