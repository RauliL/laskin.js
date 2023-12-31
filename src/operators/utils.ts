import Decimal from "decimal.js";

import { RangeError } from "../exception";
import { toBaseUnit, unitCheck, unitConversion } from "../number";
import { getBaseUnitOf } from "../unit";
import { NumberValue, Value, VectorValue, newVectorValue } from "../value";

export const numberValueBinaryOperator = (
  a: NumberValue,
  b: NumberValue,
  method: (that: Decimal) => Decimal,
): NumberValue => {
  unitCheck(a, b);

  return unitConversion(
    method.call(toBaseUnit(a), toBaseUnit(b)),
    getBaseUnitOf(a.unit?.type),
  );
};

export const vectorValueBinaryOperator = (
  a: VectorValue,
  b: VectorValue,
  callback: (a: Value, b: Value) => Value,
): VectorValue => {
  if (a.elements.length !== b.elements.length) {
    throw new RangeError("Vector length mismatch.");
  }

  return newVectorValue(
    a.elements.map((value, index) => callback(value, b.elements[index])),
  );
};

export const vectorValueNumberBinaryOperator = (
  a: VectorValue,
  b: NumberValue,
  callback: (a: Value, b: Value) => Value,
): VectorValue => newVectorValue(a.elements.map((value) => callback(value, b)));
