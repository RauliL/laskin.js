import { Context } from "../context";
import {
  BuiltinQuoteCallback,
  NameError,
  OutputFunction,
  Value,
  ValueType,
} from "../types";
import {
  add,
  compare,
  divide,
  equals,
  multiply,
  substract,
} from "../operators";
import { valueToString } from "../to-string";
import { valueToSource } from "../to-source";
import { newBooleanValue, newNumberValue, newStringValue } from "../value";

const typeTest = (type: ValueType) => (context: Context) => {
  context.pushBoolean(context.peek().type === type);
};

const constant = (callback: () => Value) => (context: Context) =>
  context.push(callback());

const operator =
  (callback: (a: Value, b: Value) => Value) => (context: Context) => {
    const b = context.pop();
    const a = context.pop();

    context.push(callback(a, b));
  };

const w_eq = (context: Context) => {
  const b = context.pop();
  const a = context.pop();

  context.pushBoolean(equals(a, b));
};

const w_ne = (context: Context) => {
  const b = context.pop();
  const a = context.pop();

  context.pushBoolean(!equals(a, b));
};

const w_gt = (context: Context) => {
  const b = context.pop();
  const a = context.pop();

  context.pushBoolean(compare(a, b) > 0);
};

const w_lt = (context: Context) => {
  const b = context.pop();
  const a = context.pop();

  context.pushBoolean(compare(a, b) < 0);
};

const w_gte = (context: Context) => {
  const b = context.pop();
  const a = context.pop();

  context.pushBoolean(compare(a, b) >= 0);
};

const w_lte = (context: Context) => {
  const b = context.pop();
  const a = context.pop();

  context.pushBoolean(compare(a, b) <= 0);
};

const w_clear = (context: Context) => {
  context.clear();
};

const w_depth = (context: Context) => {
  context.pushNumber(context.length);
};

const w_dup = (context: Context) => {
  context.push(context.peek());
};

const w_drop = (context: Context) => {
  context.pop();
};

const w_nip = (context: Context) => {
  const a = context.pop();

  context.pop();
  context.push(a);
};

const w_over = (context: Context) => {
  const a = context.pop();
  const b = context.pop();

  context.push(b, a, b);
};

const w_rot = (context: Context) => {
  const a = context.pop();
  const b = context.pop();
  const c = context.pop();

  context.push(b, a, c);
};

const w_swap = (context: Context) => {
  const a = context.pop();
  const b = context.pop();

  context.push(a, b);
};

const w_tuck = (context: Context) => {
  const a = context.pop();
  const b = context.pop();

  context.push(a, b, a);
};

const w_toString = (context: Context) => {
  context.pushString(valueToSource(context.pop()));
};

const w_toSource = (context: Context) => {
  context.pushString(valueToSource(context.pop()));
};

const w_print = (context: Context, output: OutputFunction) => {
  output(valueToString(context.pop()));
};

const w_stackPreview = (context: Context, output: OutputFunction) => {
  const { length } = context;
  let counter = 0;

  if (length === 0) {
    output("Stack is empty.\n");
    return;
  }

  for (const value of context) {
    if (++counter > 10) {
      break;
    }
    output(`${length - counter + 1}: ${valueToSource(value)}`);
  }
};

const w_if = (context: Context, output: OutputFunction) => {
  const quote = context.popQuote();
  const condition = context.popBoolean();

  if (condition) {
    quote.call(context, output);
  }
};

const w_ifElse = (context: Context, output: OutputFunction) => {
  const elseQuote = context.popQuote();
  const thenQuote = context.popQuote();
  const condition = context.popBoolean();

  (condition ? thenQuote : elseQuote).call(context, output);
};

const w_while = (context: Context, output: OutputFunction) => {
  const quote = context.popQuote();
  const condition = context.popQuote();

  for (;;) {
    condition.call(context, output);
    if (!context.popBoolean()) {
      return;
    }
    quote.call(context, output);
  }
};

const w_lookup = (context: Context) => {
  const id = context.popString();
  const word = context.lookup(id);

  if (word != null) {
    context.push(word);
    return;
  }

  throw new NameError(`Unrecognized symbol: \`${id}'`);
};

const w_define = (context: Context) => {
  const id = context.popString();
  const value = context.pop();

  context.define(id, value);
};

const w_delete = (context: Context) => {
  const id = context.popString();

  if (!context.delete(id)) {
    throw new NameError(`Unrecognized symbol: \`${id}'`);
  }
};

const w_symbols = (context: Context) => {
  const result: Value[] = [];

  for (const key of context.symbols) {
    result.push(newStringValue(key));
  }

  context.pushVector(result);
};

export const utils: [string, BuiltinQuoteCallback][] = [
  // Constants.
  ["true", constant(() => newBooleanValue(true))],
  ["false", constant(() => newBooleanValue(false))],
  ["pi", constant(() => newNumberValue(Math.PI))],
  ["e", constant(() => newNumberValue(Math.E))],

  // Common operators.
  ["=", w_eq],
  ["<>", w_ne],
  [">", w_gt],
  ["<", w_lt],
  [">=", w_gte],
  ["<=", w_lte],
  ["+", operator(add)],
  ["-", operator(substract)],
  ["*", operator(multiply)],
  ["/", operator(divide)],

  // Stack testing.
  ["boolean?", typeTest("Boolean")],
  ["date?", typeTest("Date")],
  ["month?", typeTest("Month")],
  ["number?", typeTest("Number")],
  ["quote?", typeTest("Quote")],
  ["record?", typeTest("Record")],
  ["string?", typeTest("String")],
  ["time?", typeTest("Time")],
  ["vector?", typeTest("Vector")],
  ["weekday?", typeTest("Weekday")],

  // Stack manipulation.
  ["clear", w_clear],
  ["depth", w_depth],
  ["dup", w_dup],
  ["drop", w_drop],
  ["nip", w_nip],
  ["over", w_over],
  ["rot", w_rot],
  ["swap", w_swap],
  ["tuck", w_tuck],

  // Conversions.
  [">string", w_toString],
  [">source", w_toSource],

  // I/O.
  [".", w_print],
  [".s", w_stackPreview],

  // Control flow.
  // TODO: quit
  ["if", w_if],
  ["if-else", w_ifElse],
  ["while", w_while],

  // Dictionary related.
  ["lookup", w_lookup],
  ["define", w_define],
  ["delete", w_delete],
  ["symbols", w_symbols],

  // TODO: include
];
