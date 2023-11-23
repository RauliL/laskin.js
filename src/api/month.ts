import { Context } from "../context";
import { BuiltinQuoteCallback, Month } from "../types";

const monthConstant = (month: Month) => (context: Context) => {
  context.pushMonth(month);
};

const w_toNumber = (context: Context) => {
  context.pushNumber(context.popMonth() + 1);
};

export const month: [string, BuiltinQuoteCallback][] = [
  // Constants.
  ["january", monthConstant(Month.January)],
  ["february", monthConstant(Month.February)],
  ["march", monthConstant(Month.March)],
  ["april", monthConstant(Month.April)],
  ["may", monthConstant(Month.May)],
  ["june", monthConstant(Month.June)],
  ["july", monthConstant(Month.July)],
  ["august", monthConstant(Month.August)],
  ["september", monthConstant(Month.September)],
  ["october", monthConstant(Month.October)],
  ["november", monthConstant(Month.November)],
  ["december", monthConstant(Month.December)],

  // Conversions.
  ["month:>number", w_toNumber],
];
