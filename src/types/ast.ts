import { Value } from "./value";

export type NodeType =
  | "Definition"
  | "Literal"
  | "RecordLiteral"
  | "Symbol"
  | "VectorLiteral";

export type Position = {
  line: number;
  column: number;
};

export type Node = {
  type: NodeType;
  position: Position;
};

export type DefinitionNode = Node & {
  type: "Definition";
  id: string;
};

export type LiteralNode = Node & {
  type: "Literal";
  value: Value;
};

export type RecordLiteralNode = Node & {
  type: "RecordLiteral";
  elements: Map<string, Node>;
};

export type SymbolNode = Node & {
  type: "Symbol";
  id: string;
};

export type VectorLiteralNode = Node & {
  type: "VectorLiteral";
  elements: Node[];
};
