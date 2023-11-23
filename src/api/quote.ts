import { Context } from "../context";
import { BuiltinQuote, BuiltinQuoteCallback, OutputFunction } from "../types";

const w_call = (context: Context, output: OutputFunction) => {
  context.popQuote().call(context, output);
};

const w_compose = (context: Context) => {
  const right = context.popQuote();
  const left = context.popQuote();

  context.pushQuote(
    new BuiltinQuote((context, output) => {
      left.call(context, output);
      right.call(context, output);
    }),
  );
};

const w_curry = (context: Context) => {
  const quote = context.popQuote();
  const arg = context.pop();

  context.pushQuote(
    new BuiltinQuote((context, output) => {
      context.push(arg);
      quote.call(context, output);
    }),
  );
};

const w_negate = (context: Context) => {
  const quote = context.popQuote();

  context.pushQuote(
    new BuiltinQuote((context, output) => {
      quote.call(context, output);
      context.pushBoolean(!context.popBoolean());
    }),
  );
};

const w_dip = (context: Context, output: OutputFunction) => {
  const quote = context.popQuote();
  const value = context.pop();

  quote.call(context, output);
  context.push(value);
};

export const quote: [string, BuiltinQuoteCallback][] = [
  ["quote:call", w_call],
  ["quote:compose", w_compose],
  ["quote:curry", w_curry],
  ["quote:negate", w_negate],
  ["quote:dip", w_dip],
];
