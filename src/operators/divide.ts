import { RangeError, TypeError } from "../exception";
import { NumberValue, Value, VectorValue, newNumberValue } from "../value";
import {
  vectorValueBinaryOperator,
  vectorValueNumberBinaryOperator,
} from "./utils";

const divNumber = (a: NumberValue, b: NumberValue): NumberValue => {
  if (b.value.comparedTo(0) === 0) {
    throw new RangeError("Division by zero.");
  }

  return newNumberValue(a.value.div(b.value));
};

const divVector = (a: VectorValue, b: VectorValue): VectorValue =>
  vectorValueBinaryOperator(a, b, divide);

const divNumberFromVector = (a: VectorValue, b: NumberValue): VectorValue =>
  vectorValueNumberBinaryOperator(a, b, divide);

export const divide = (a: Value, b: Value): Value => {
  if (a.type === b.type) {
    switch (a.type) {
      case "Number":
        return divNumber(a as NumberValue, b as NumberValue);

      case "Vector":
        return divVector(a as VectorValue, b as VectorValue);
    }
  } else if (b.type === "Number") {
    if (a.type === "Vector") {
      return divNumberFromVector(a as VectorValue, b as NumberValue);
    }
  }

  throw new TypeError(
    `Cannot divide ${a.type.toLowerCase()} with ${b.type.toLowerCase()}.`,
  );
};
