import { Context, PrintFunction } from "../context";
import { RangeError } from "../exception";
import { BuiltinQuoteCallback } from "../quote";
import { Value, newStringValue, newVectorValue } from "../value";

const w_size = (context: Context) => {
  context.pushNumber(context.peekRecord().size);
};

const w_keys = (context: Context) => {
  const result: Value[] = [];

  for (const key of context.popRecord().keys()) {
    result.push(newStringValue(key));
  }

  context.pushVector(result);
};

const w_values = (context: Context) => {
  context.pushVector(Array.from(context.popRecord().values()));
};

const w_forEach = (context: Context, print: PrintFunction) => {
  const elements = context.popRecord();
  const quote = context.popQuote();

  for (const [key, value] of elements) {
    context.pushString(key);
    context.push(value);
    quote.call(context, print);
  }
};

const w_map = (context: Context, print: PrintFunction) => {
  const elements = context.popRecord();
  const quote = context.popQuote();
  const result: [string, Value][] = [];

  for (const [key, value] of elements) {
    context.pushString(key);
    context.push(value);
    quote.call(context, print);

    const newValue = context.pop();
    const newKey = context.popString();

    result.push([newKey, newValue]);
  }

  context.pushRecord(result);
};

const w_filter = (context: Context, print: PrintFunction) => {
  const elements = context.popRecord();
  const quote = context.popQuote();
  const result: [string, Value][] = [];

  for (const [key, value] of elements) {
    context.pushString(key);
    context.push(value);
    quote.call(context, print);
    if (context.popBoolean()) {
      result.push([key, value]);
    }
  }

  context.pushRecord(result);
};

const w_at = (context: Context) => {
  const record = context.popRecord();
  const key = context.popString();
  const value = record.get(key);

  if (value == null) {
    throw new RangeError("Record index out of bounds.");
  }
  context.push(value);
};

const w_set = (context: Context) => {
  const record = new Map<string, Value>(context.popRecord());
  const key = context.popString();
  const value = context.pop();

  record.set(key, value);
  context.pushRecord(record);
};

const w_toVector = (context: Context) => {
  const record = context.popRecord();
  const result: Value[] = [];

  for (const [key, value] of record) {
    result.push(newVectorValue([newStringValue(key), value]));
  }

  context.pushVector(result);
};

export const record: [string, BuiltinQuoteCallback][] = [
  ["record:size", w_size],
  ["record:keys", w_keys],
  ["record:values", w_values],

  // Iteration.
  ["record:for-each", w_forEach],
  ["record:map", w_map],
  ["record:filter", w_filter],

  // Element access.
  ["record:@", w_at],
  ["record:@=", w_set],

  // Conversions.
  ["record:>vector", w_toVector],
];
