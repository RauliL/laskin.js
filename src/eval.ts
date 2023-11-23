import { Context } from "./context";
import { NameError, Node, SyntaxError, Value } from "./types";
import {
  isDate,
  isMonth,
  isTime,
  isWeekday,
  parseDate,
  parseMonth,
  parseTime,
  parseWeekday,
} from "./chrono";
import { isNumber, parseNumber } from "./number";
import { NodeVisitor, visitNode } from "./visitor";
import {
  newBooleanValue,
  newMonthValue,
  newRecordValue,
  newVectorValue,
  newWeekdayValue,
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
    } else if (isNumber(id)) {
      return parseNumber(id);
    } else if (isDate(id)) {
      return parseDate(id);
    } else if (isTime(id)) {
      return parseTime(id);
    } else if (isMonth(id)) {
      return newMonthValue(parseMonth(id));
    } else if (isWeekday(id)) {
      return newWeekdayValue(parseWeekday(id));
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
