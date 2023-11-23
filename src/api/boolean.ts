import { Context } from "../context";
import { BuiltinQuoteCallback } from "../types";

const w_not = (context: Context) => {
  context.pushBoolean(!context.popBoolean());
};

const w_and = (context: Context) => {
  const b = context.popBoolean();
  const a = context.popBoolean();

  context.pushBoolean(a && b);
};

const w_or = (context: Context) => {
  const b = context.popBoolean();
  const a = context.popBoolean();

  context.pushBoolean(a || b);
};

const w_xor = (context: Context) => {
  const b = context.popBoolean();
  const a = context.popBoolean();

  context.pushBoolean(a !== b && (a || b));
};

export const boolean: [string, BuiltinQuoteCallback][] = [
  ["boolean:not", w_not],
  ["boolean:and", w_and],
  ["boolean:or", w_or],
  ["boolean:xor", w_xor],
];
