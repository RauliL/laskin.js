import { valueToString } from "./to-string";
import { Node } from "./types";
import { Value, ValueVisitor, visitValue } from "./value";
import { NodeVisitor, visitNode } from "./visitor";

const valueVisitor: ValueVisitor<string> = {
  visitBoolean(value) {
    return valueToString(value);
  },

  visitDate(value) {
    return valueToString(value);
  },

  visitMonth(value) {
    return valueToString(value);
  },

  visitNumber(value) {
    return valueToString(value);
  },

  visitQuote(value) {
    return valueToString(value);
  },

  visitRecord(value) {
    let result = "{";
    let first = true;

    for (const [key, element] of value.elements) {
      if (first) {
        first = false;
      } else {
        result += ", ";
      }
      result += `${JSON.stringify(key)}: ${valueToSource(element)}`;
    }
    result += "}";

    return result;
  },

  visitString(value) {
    return JSON.stringify(value.value);
  },

  visitTime(value) {
    return valueToString(value);
  },

  visitVector(value) {
    return `[${value.elements.map(valueToSource).join(", ")}]`;
  },

  visitWeekday(value) {
    return valueToString(value);
  },
};

const nodeVisitor: NodeVisitor<string> = {
  visitDefinition(node) {
    return `-> ${node.id}`;
  },

  visitLiteral(node) {
    return valueToSource(node.value);
  },

  visitRecordLiteral(node) {
    let result = "{";
    let first = true;

    for (const [key, value] of node.elements) {
      if (first) {
        first = false;
      } else {
        result += ", ";
      }
      result += `${JSON.stringify(key)}: ${nodeToSource(value)}`;
    }
    result += "}";

    return result;
  },

  visitSymbol(node) {
    return node.id;
  },

  visitVectorLiteral(node) {
    return `[${node.elements
      .map((element) => nodeToSource(element))
      .join(", ")}]`;
  },
};

export const valueToSource = (value: Value): string =>
  visitValue(valueVisitor, value, undefined);

export const nodeToSource = (node: Node): string =>
  visitNode(nodeVisitor, node, undefined);
