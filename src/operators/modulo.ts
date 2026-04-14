import { Decimal } from "decimal.js";

import {
  numberValueBinaryOperator,
  vectorValueBinaryOperator,
  vectorValueNumberBinaryOperator,
} from "./utils";
import { NumberValue, Value, VectorValue } from "../value";

const modNumber = (a: NumberValue, b: NumberValue): NumberValue =>
  numberValueBinaryOperator(a, b, Decimal.prototype.mod);

const modVector = (a: VectorValue, b: VectorValue): VectorValue =>
  vectorValueBinaryOperator(a, b, modulo);

const modNumberFromVector = (a: VectorValue, b: NumberValue): VectorValue =>
  vectorValueNumberBinaryOperator(a, b, modulo);

export const modulo = (a: Value, b: Value): Value => {
  if (a.type === b.type) {
    switch (a.type) {
      case "Number":
        return modNumber(a as NumberValue, b as NumberValue);

      case "Vector":
        return modVector(a as VectorValue, b as VectorValue);
    }
  } else if (b.type === "Number") {
    switch (a.type) {
      case "Vector":
        return modNumberFromVector(a as VectorValue, b as NumberValue);
    }
  }

  throw new TypeError(
    `Cannot module ${a.type.toLowerCase()} with ${b.type.toLowerCase()}.`,
  );
};
