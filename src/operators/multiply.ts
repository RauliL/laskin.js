import Decimal from "decimal.js";

import {
  numberValueBinaryOperator,
  vectorValueBinaryOperator,
  vectorValueNumberBinaryOperator,
} from "./utils";
import { NumberValue, Value, VectorValue } from "../value";

const mulNumber = (a: NumberValue, b: NumberValue): NumberValue =>
  numberValueBinaryOperator(a, b, Decimal.prototype.mul);

const mulVector = (a: VectorValue, b: VectorValue): VectorValue =>
  vectorValueBinaryOperator(a, b, multiply);

const mulVectorByNumber = (a: VectorValue, b: NumberValue): VectorValue =>
  vectorValueNumberBinaryOperator(a, b, multiply);

export const multiply = (a: Value, b: Value): Value => {
  if (a.type === b.type) {
    switch (a.type) {
      case "Number":
        return mulNumber(a as NumberValue, b as NumberValue);

      case "Vector":
        return mulVector(a as VectorValue, b as VectorValue);
    }
  } else if (b.type === "Number") {
    if (a.type === "Vector") {
      return mulVectorByNumber(a as VectorValue, b as NumberValue);
    }
  }

  throw new TypeError(
    `Cannot multiply ${a.type.toLowerCase()} with ${b.type.toLowerCase()}.`,
  );
};
