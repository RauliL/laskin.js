import { Context, PrintFunction } from "../context";
import { RangeError } from "../exception";
import { add, compare, divide } from "../operators";
import { BuiltinQuoteCallback } from "../quote";
import { Month, MonthValue, Value } from "../types";
import { valueToString } from "../to-string";
import {
  day as dayUnit,
  hour as hourUnit,
  minute as minuteUnit,
  second as secondUnit,
} from "../unit";
import { newNumberValue, valueAsNumber } from "../value";

const w_vector = (context: Context) => {
  let { value: count } = context.popNumber();
  const result: Value[] = [];

  while (count.comparedTo(0) > 0) {
    result.push(context.pop());
    count = count.sub(1);
  }
  context.pushVector(result);
};

const w_length = (context: Context) => {
  context.pushNumber(context.peekVector().length);
};

const w_max = (context: Context) => {
  const elements = context.popVector();

  if (elements.length > 0) {
    let largest = elements[0];

    for (let i = 1; i < elements.length; ++i) {
      if (compare(elements[i], largest) > 0) {
        largest = elements[i];
      }
    }
    context.push(largest);
    return;
  }

  throw new RangeError("Vector is empty.");
};

const w_min = (context: Context) => {
  const elements = context.popVector();

  if (elements.length > 0) {
    let smallest = elements[0];

    for (let i = 1; i < elements.length; ++i) {
      if (compare(elements[i], smallest) < 0) {
        smallest = elements[i];
      }
    }
    context.push(smallest);
    return;
  }

  throw new RangeError("Vector is empty.");
};

const w_mean = (context: Context) => {
  const vector = context.popVector();

  if (vector.length > 0) {
    let sum = vector[0];

    for (let i = 1; i < vector.length; ++i) {
      sum = add(sum, vector[i]);
    }
    context.push(divide(sum, newNumberValue(vector.length)));
    return;
  }

  throw new RangeError("Vector is empty.");
};

const w_sum = (context: Context) => {
  const elements = context.popVector();

  if (elements.length > 0) {
    let sum = elements[0];

    for (let i = 1; i < elements.length; ++i) {
      sum = add(sum, elements[i]);
    }
    context.push(sum);
    return;
  }

  throw new RangeError("Vector is empty.");
};

const w_forEach = (context: Context, print: PrintFunction) => {
  const vector = context.popVector();
  const quote = context.popQuote();

  for (const value of vector) {
    context.push(value);
    quote.call(context, print);
  }
};

const w_map = (context: Context, print: PrintFunction) => {
  const vector = context.popVector();
  const quote = context.popQuote();
  const result: Value[] = [];

  for (const value of vector) {
    context.push(value);
    quote.call(context, print);
    result.push(context.pop());
  }

  context.pushVector(result);
};

const w_filter = (context: Context, print: PrintFunction) => {
  const vector = context.popVector();
  const quote = context.popQuote();
  const result: Value[] = [];

  for (const value of vector) {
    context.push(value);
    quote.call(context, print);
    if (context.popBoolean()) {
      result.push(value);
    }
  }

  context.pushVector(result);
};

const w_reduce = (context: Context, print: PrintFunction) => {
  const vector = context.popVector();
  const quote = context.popQuote();
  let result: Value;

  if (vector.length === 0) {
    throw new RangeError("Cannot reduce empty vector.");
  }
  result = vector[0];
  for (let i = 1; i < vector.length; ++i) {
    context.push(result);
    context.push(vector[i]);
    quote.call(context, print);
    result = context.pop();
  }

  context.push(result);
};

const w_append = (context: Context) => {
  const vector = context.popVector();
  const value = context.pop();

  context.pushVector([...vector, value]);
};

const w_prepend = (context: Context) => {
  const vector = context.popVector();
  const value = context.pop();

  context.pushVector([value, ...vector]);
};

const popVectorIndex = (
  context: Context,
  vector: Readonly<Value[]>,
): number => {
  const index = context.popNumber();
  let result: number;

  if (index.unit != null) {
    throw new RangeError(`Cannot use ${valueToString(index)} as vector index.`);
  }
  result = index.value.round().toNumber();
  if (result < 0) {
    result += vector.length;
  }
  if (vector.length === 0 || result >= vector.length) {
    throw new RangeError("Vector index out of bounds.");
  }

  return result;
};

const w_insert = (context: Context) => {
  const vector = context.popVector();
  const value = context.pop();
  const index = popVectorIndex(context, vector);

  context.pushVector([
    ...vector.slice(0, index),
    value,
    ...vector.slice(index),
  ]);
};

const w_reverse = (context: Context) => {
  context.pushVector([...context.popVector()].reverse());
};

const w_extract = (context: Context) => {
  context.push(...context.popVector());
};

const w_sort = (context: Context) => {
  context.pushVector([...context.popVector()].sort(compare));
};

const w_at = (context: Context) => {
  const vector = context.popVector();
  const index = popVectorIndex(context, vector);

  context.push(vector[index]);
};

const w_set = (context: Context) => {
  const vector = [...context.popVector()];
  const index = popVectorIndex(context, vector);
  const value = context.pop();

  vector[index] = value;
  context.pushVector(vector);
};

const w_join = (context: Context) => {
  const vector = context.popVector();
  const separator = context.popString();

  context.pushString(vector.map(valueToString).join(separator));
};

const w_toDate = (context: Context) => {
  const vector = context.popVector();

  if (vector.length !== 3) {
    throw new RangeError("Date needs three values.");
  }

  const year = valueAsNumber(vector[0]).toNumber();

  let month: Month;
  if (vector[1].type === "Month") {
    month = (vector[1] as MonthValue).value;
  } else {
    const value = valueAsNumber(vector[1]);

    if (value.comparedTo(1) < 0 || value.comparedTo(12) > 0) {
      throw new RangeError("Given month is out of range.");
    }
    month = value.toNumber() - 1;
  }

  const day = valueAsNumber(vector[2], dayUnit).toNumber();

  context.pushDate(year, month, day);
};

const w_toTime = (context: Context) => {
  const vector = context.popVector();

  if (vector.length !== 3) {
    throw new RangeError("Time needs three values.");
  }

  const hour = valueAsNumber(vector[0], hourUnit).toNumber();
  const minute = valueAsNumber(vector[1], minuteUnit).toNumber();
  const second = valueAsNumber(vector[2], secondUnit).toNumber();

  context.pushTime(hour, minute, second);
};

export const vector: [string, BuiltinQuoteCallback][] = [
  // Constructor.
  ["vector", w_vector],

  ["vector:length", w_length],

  ["vector:max", w_max],
  ["vector:min", w_min],
  ["vector:mean", w_mean],
  ["vector:sum", w_sum],

  // Iteration.
  ["vector:for-each", w_forEach],
  ["vector:map", w_map],
  ["vector:filter", w_filter],
  ["vector:reduce", w_reduce],

  // Modification.
  ["vector:prepend", w_prepend],
  ["vector:append", w_append],
  ["vector:insert", w_insert],
  ["vector:reverse", w_reverse],
  ["vector:extract", w_extract],
  ["vector:sort", w_sort],

  // Element access.
  ["vector:@", w_at],
  ["vector:@=", w_set],

  // Conversions.
  ["vector:join", w_join],
  ["vector:>date", w_toDate],
  ["vector:>time", w_toTime],
];
