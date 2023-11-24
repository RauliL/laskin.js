import { LaskinError } from "../exception";
import {
  DefinitionNode,
  LiteralNode,
  Node,
  RecordLiteralNode,
  SymbolNode,
  VectorLiteralNode,
} from "../types";

export type NodeVisitor<R, A = undefined> = {
  visitDefinition: (node: DefinitionNode, arg: A) => R;
  visitLiteral: (node: LiteralNode, arg: A) => R;
  visitRecordLiteral: (node: RecordLiteralNode, arg: A) => R;
  visitSymbol: (node: SymbolNode, arg: A) => R;
  visitVectorLiteral: (node: VectorLiteralNode, arg: A) => R;
};

export const visitNode = <R, A = undefined>(
  visitor: NodeVisitor<R, A>,
  node: Node,
  arg: A,
): R => {
  switch (node.type) {
    case "Definition":
      return visitor.visitDefinition(node as DefinitionNode, arg);

    case "Literal":
      return visitor.visitLiteral(node as LiteralNode, arg);

    case "RecordLiteral":
      return visitor.visitRecordLiteral(node as RecordLiteralNode, arg);

    case "Symbol":
      return visitor.visitSymbol(node as SymbolNode, arg);

    case "VectorLiteral":
      return visitor.visitVectorLiteral(node as VectorLiteralNode, arg);
  }

  throw new LaskinError(`Unrecognized node type: ${node.type}`);
};
