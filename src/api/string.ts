import { Context } from "../context";
import { RangeError } from "../exception";
import { isNumber, parseNumber } from "../number";
import { BuiltinQuoteCallback, ScriptedQuote } from "../quote";
import { Parser } from "../parser";
import { newNumberValue, newStringValue } from "../value";

const w_length = (context: Context) => {
  context.pushNumber(context.peekString().length);
};

const w_chars = (context: Context) => {
  context.pushVector(context.popString().split("").map(newStringValue));
};

const w_runes = (context: Context) => {
  context.pushVector(
    context
      .popString()
      .split("")
      .map((c) => newNumberValue(c.charCodeAt(0))),
  );
};

const w_lines = (context: Context) => {
  context.pushVector(context.popString().split(/\r?\n/).map(newStringValue));
};

const w_words = (context: Context) => {
  context.pushVector(context.popString().split(/\s+/).map(newStringValue));
};

const w_startsWith = (context: Context) => {
  const string = context.popString();
  const subString = context.popString();

  context.pushBoolean(string.startsWith(subString));
};

const w_endsWith = (context: Context) => {
  const string = context.popString();
  const subString = context.popString();

  context.pushBoolean(string.endsWith(subString));
};

const w_includes = (context: Context) => {
  const string = context.popString();
  const subString = context.popString();

  context.pushBoolean(string.includes(subString));
};

const w_indexOf = (context: Context) => {
  const string = context.popString();
  const subString = context.popString();

  context.pushNumber(string.indexOf(subString));
};

const w_lastIndexOf = (context: Context) => {
  const string = context.popString();
  const subString = context.popString();

  context.pushNumber(string.lastIndexOf(subString));
};

const w_reverse = (context: Context) => {
  context.pushString(context.popString().split("").reverse().join(""));
};

const w_lowerCase = (context: Context) => {
  context.pushString(context.popString().toLowerCase());
};

const w_upperCase = (context: Context) => {
  context.pushString(context.popString().toUpperCase());
};

const w_swapCase = (context: Context) => {
  context.pushString(
    context
      .popString()
      .split("")
      .map((c) => {
        const upper = c.toUpperCase();

        return c === upper ? c.toLowerCase() : upper;
      })
      .join(""),
  );
};

const w_trim = (context: Context) => {
  context.pushString(context.popString().trim());
};

const w_trimStart = (context: Context) => {
  context.pushString(context.popString().trimStart());
};

const w_trimEnd = (context: Context) => {
  context.pushString(context.popString().trimEnd());
};

const popStringIndex = (context: Context, string: string): number => {
  let index = context.popNumber().value.toNumber();

  if (index < 0) {
    index += string.length;
  }
  if (index < 0 || index >= string.length) {
    throw new RangeError("String index out of bounds.");
  }

  return index;
};

const w_substring = (context: Context) => {
  const string = context.popString();
  const begin = popStringIndex(context, string);
  const end = popStringIndex(context, string);

  if (end < begin) {
    throw new RangeError("String index out of bounds.");
  }

  context.pushString(string.substring(begin, end));
};

const w_split = (context: Context) => {
  const string = context.popString();
  const pattern = context.popString();

  context.pushVector(string.split(pattern).map(newStringValue));
};

const w_repeat = (context: Context) => {
  const string = context.popString();
  let { value: count } = context.popNumber();
  let result = "";

  while (count.comparedTo(0) > 0) {
    result += string;
    count = count.sub(1);
  }
  context.pushString(result);
};

const w_replace = (context: Context) => {
  const string = context.popString();
  const replacement = context.popString();
  const needle = context.popString();

  context.pushString(string.replace(needle, replacement));
};

const w_padStart = (context: Context) => {
  const string = context.popString();
  const padString = context.popString();
  const { value: targetLength } = context.popNumber();

  context.pushString(string.padStart(targetLength.toNumber(), padString));
};

const w_padEnd = (context: Context) => {
  const string = context.popString();
  const padString = context.popString();
  const { value: targetLength } = context.popNumber();

  context.pushString(string.padEnd(targetLength.toNumber(), padString));
};

const w_at = (context: Context) => {
  const string = context.popString();
  const index = popStringIndex(context, string);

  context.pushString(string[index]);
};

const w_toQuote = (context: Context) => {
  const source = context.popString();
  const parser = new Parser(source, 1, 1);
  const script = parser.parseScript();

  context.pushQuote(new ScriptedQuote(script));
};

const w_toNumber = (context: Context) => {
  const string = context.popString();

  if (!isNumber(string)) {
    throw new RangeError("Cannot convert given string into number.");
  }

  context.push(parseNumber(string));
};

export const string: [string, BuiltinQuoteCallback][] = [
  ["string:length", w_length],
  ["string:chars", w_chars],
  ["string:runes", w_runes],
  ["string:lines", w_lines],
  ["string:words", w_words],

  // Comparison.
  ["string:starts-with?", w_startsWith],
  ["string:ends-with?", w_endsWith],
  ["string:includes?", w_includes],
  ["string:index-of", w_indexOf],
  ["string:last-index-of", w_lastIndexOf],

  // Modifications.
  ["string:reverse", w_reverse],
  ["string:lower-case", w_lowerCase],
  ["string:upper-case", w_upperCase],
  ["string:swap-case", w_swapCase],
  ["string:trim", w_trim],
  ["string:trim-start", w_trimStart],
  ["string:trim-end", w_trimEnd],
  ["string:substring", w_substring],
  ["string:split", w_split],
  ["string:repeat", w_repeat],
  ["string:replace", w_replace],
  ["string:pad-start", w_padStart],
  ["string:pad-end", w_padEnd],

  ["string:@", w_at],

  // Conversions.
  ["string:>quote", w_toQuote],
  ["string:>number", w_toNumber],
];
