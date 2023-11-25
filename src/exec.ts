import {
  matchesDatePattern,
  matchesTimePattern,
  parseDateValue,
  parseTimeValue,
} from "./chrono";
import { Context, PrintFunction } from "./context";
import { evalNode } from "./eval";
import { NameError } from "./exception";
import { isNumber, parseNumber } from "./number";
import { Node } from "./types";
import { QuoteValue, Value } from "./value";
import { NodeVisitor, visitNode } from "./visitor";

const visitor: NodeVisitor<undefined, [Context, PrintFunction]> = {
  visitDefinition(node, [context]) {
    context.define(node.id, context.pop());
  },

  visitLiteral(node, [context]) {
    context.push(node.value);
  },

  visitRecordLiteral(node, [context]) {
    context.push(evalNode(context, node));
  },

  visitSymbol(node, [context, print]) {
    let word: Value | undefined;

    if (context.length > 0) {
      const value = context.peek();
      const id = `${value.type.toLowerCase()}:${node.id}`;

      if ((word = context.lookup(id)) != null) {
        if (word.type === "Quote") {
          (word as QuoteValue).quote.call(context, print);
        } else {
          context.push(word);
        }
        return;
      }
    }

    if ((word = context.lookup(node.id)) != null) {
      if (word.type === "Quote") {
        (word as QuoteValue).quote.call(context, print);
      } else {
        context.push(word);
      }
      return;
    }

    if (isNumber(node.id)) {
      context.push(parseNumber(node.id));
      return;
    } else if (matchesDatePattern(node.id)) {
      context.push(parseDateValue(node.id));
      return;
    } else if (matchesTimePattern(node.id)) {
      context.push(parseTimeValue(node.id));
      return;
    }

    throw new NameError(`Unrecognized symbol: \`${node.id}'`, node.position);
  },

  visitVectorLiteral(node, [context]) {
    context.push(evalNode(context, node));
  },
};

export const execScript = (
  context: Context,
  print: PrintFunction,
  script: Node[],
) => {
  const arg: [Context, PrintFunction] = [context, print];

  for (const node of script) {
    visitNode(visitor, node, arg);
  }
};
