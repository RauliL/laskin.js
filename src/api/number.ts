import { Decimal } from "decimal.js";

import { Context, PrintFunction } from "../context";
import { RangeError, UnitError } from "../exception";
import { toBaseUnit, unitCheck, unitConversion } from "../number";
import { BuiltinQuoteCallback } from "../quote";
import { getBaseUnitOf } from "../unit";
import { Value, newNumberValue } from "../value";

const unaryMethod =
  (callback: (x: Decimal) => Decimal) => (context: Context) => {
    const { value, unit } = context.popNumber();

    context.pushNumber(callback.call(Decimal, value), unit);
  };

const binaryMethod =
  (callback: (x: Decimal, y: Decimal) => Decimal) => (context: Context) => {
    const b = context.popNumber();
    const a = context.popNumber();
    const base = getBaseUnitOf(a.unit?.type);

    unitCheck(a, b);

    context.push(
      unitConversion(
        callback.call(Decimal, toBaseUnit(a), toBaseUnit(b)),
        base,
      ),
    );
  };

const w_hasUnit = (context: Context) => {
  context.pushBoolean(context.peekNumber().unit != null);
};

const w_unit = (context: Context) => {
  const { unit } = context.peekNumber();

  if (unit == null) {
    throw new UnitError("Value has no measurement unit.");
  }
  context.pushString(unit.symbol);
};

const w_unitType = (context: Context) => {
  const { unit } = context.peekNumber();

  if (unit == null) {
    throw new UnitError("Value has no measurement unit.");
  }
  context.pushString(unit.type.toLowerCase());
};

const w_dropUnit = (context: Context) => {
  context.pushNumber(context.popNumber().value);
};

const w_range = (context: Context) => {
  const end = context.popNumber();
  const begin = context.popNumber();
  const result: Value[] = [];

  unitCheck(end, begin);

  const baseEnd = toBaseUnit(end);
  const baseUnit = getBaseUnitOf(end.unit?.type);
  let current = toBaseUnit(begin);

  while (current.comparedTo(baseEnd) < 0) {
    result.push(newNumberValue(current, baseUnit));
    current = current.add(1);
  }

  context.pushVector(result);
};

const w_clamp = (context: Context) => {
  const value = context.popNumber();
  const max = context.popNumber();
  const min = context.popNumber();

  unitCheck(value, max, min);

  context.push(
    unitConversion(
      toBaseUnit(value).clamp(toBaseUnit(min), toBaseUnit(max)),
      getBaseUnitOf(value.unit?.type),
    ),
  );
};

const w_times = (context: Context, print: PrintFunction) => {
  let { value } = context.popNumber();
  const quote = context.popQuote();

  while (value.comparedTo(0) > 0) {
    value = value.sub(1);
    quote.call(context, print);
  }
};

const w_deg = (context: Context) => {
  const { value, unit } = context.popNumber();

  context.pushNumber(value.mul(180).div(Math.PI), unit);
};

const w_rad = (context: Context) => {
  const { value, unit } = context.popNumber();

  context.pushNumber(value.mul(Math.PI).div(180), unit);
};

const w_toMonth = (context: Context) => {
  const { value } = context.popNumber();

  if (value.comparedTo(1) < 0 || value.comparedTo(12) > 0) {
    throw new RangeError("Month index out of range.");
  }
  context.pushMonth(value.toNumber() - 1);
};

const w_toWeekday = (context: Context) => {
  const { value } = context.popNumber();

  if (value.comparedTo(1) < 0 || value.comparedTo(7) > 0) {
    throw new RangeError("Weekday index out of range.");
  }
  context.pushWeekday(value.toNumber() - 1);
};

export const number: [string, BuiltinQuoteCallback][] = [
  ["number:has-unit?", w_hasUnit],
  ["number:unit", w_unit],
  ["number:unit-type", w_unitType],
  ["number:drop-unit", w_dropUnit],

  ["number:range", w_range],
  ["number:clamp", w_clamp],
  ["number:times", w_times],

  // Exponential functions.
  ["number:exp", unaryMethod(Decimal.exp)],
  // TODO: ["number:exp2", w_exp2],
  // TODO: ["number:expm1", w_expm1],
  ["number:log", unaryMethod(Decimal.log)],
  ["number:log10", unaryMethod(Decimal.log10)],
  ["number:log2", unaryMethod(Decimal.log2)],
  // TODO: ["number:log1p", w_log1p]

  // Power functions.
  ["number:pow", binaryMethod(Decimal.pow)],
  ["number:sqrt", unaryMethod(Decimal.sqrt)],
  ["number:cbrt", unaryMethod(Decimal.cbrt)],
  ["number:hypot", binaryMethod(Decimal.hypot)],

  // Trigonometric functions.
  ["number:acos", unaryMethod(Decimal.acos)],
  ["number:asin", unaryMethod(Decimal.asin)],
  ["number:atan", unaryMethod(Decimal.atan)],
  ["number:atan2", binaryMethod(Decimal.atan2)],
  ["number:cos", unaryMethod(Decimal.cos)],
  ["number:sin", unaryMethod(Decimal.sin)],
  ["number:tan", unaryMethod(Decimal.tan)],
  ["number:deg", w_deg],
  ["number:rad", w_rad],

  // Hyperbolic functions.
  ["number:sinh", unaryMethod(Decimal.sinh)],
  ["number:cosh", unaryMethod(Decimal.cosh)],
  ["number:tanh", unaryMethod(Decimal.tanh)],
  ["number:asinh", unaryMethod(Decimal.asinh)],
  ["number:acosh", unaryMethod(Decimal.acosh)],
  ["number:atanh", unaryMethod(Decimal.atanh)],

  // Conversions.
  ["number:>month", w_toMonth],
  ["number:>weekday", w_toWeekday],
];
