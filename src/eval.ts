import { Node, NodeVisitor, visitNode } from "./ast";
import {
  isValidMonth,
  isValidWeekday,
  matchesDatePattern,
  matchesTimePattern,
  parseDateValue,
  parseMonthValue,
  parseTimeValue,
  parseWeekdayValue,
} from "./chrono";
import { Context } from "./context";
import { NameError, SyntaxError } from "./exception";
import { isValidNumber, parseNumberValue } from "./number";
import {
  Value,
  newBooleanValue,
  newRecordValue,
  newVectorValue,
} from "./value";

const visitor: NodeVisitor<Value, Context> = {
  visitDefinition(node) {
    throw new SyntaxError(
      `Unable to evaluate defition of \`${node.id}' as expression.`,
      node.position,
    );
  },

  visitLiteral(node) {
    return node.value;
  },

  visitRecordLiteral(node, context) {
    const elements = new Map<string, Value>();

    for (const [key, value] of node.elements) {
      elements.set(key, evalNode(context, value));
    }

    return newRecordValue(elements);
  },

  visitSymbol(node, context) {
    const { id } = node;

    if (id === "true") {
      return newBooleanValue(true);
    } else if (id === "false") {
      return newBooleanValue(false);
    } else if (id === "drop") {
      return context.pop();
    } else if (isValidNumber(id)) {
      return parseNumberValue(id);
    } else if (matchesDatePattern(id)) {
      return parseDateValue(id);
    } else if (matchesTimePattern(id)) {
      return parseTimeValue(id);
    } else if (isValidMonth(id)) {
      return parseMonthValue(id);
    } else if (isValidWeekday(id)) {
      return parseWeekdayValue(id);
    }

    throw new NameError(
      `Unable to evaluate \`${id}' as expression.`,
      node.position,
    );
  },

  visitVectorLiteral(node, context) {
    return newVectorValue(
      node.elements.map((element) => evalNode(context, element)),
    );
  },
};

export const evalNode = (context: Context, node: Node): Value =>
  visitNode(visitor, node, context);
