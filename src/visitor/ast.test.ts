import {
  DefinitionNode,
  LaskinError,
  LiteralNode,
  Node,
  NodeType,
  RecordLiteralNode,
  SymbolNode,
  VectorLiteralNode,
} from "../types";
import { NodeVisitor, visitNode } from "./ast";

describe("visitNode()", () => {
  const visitDefinition = jest.fn();
  const visitLiteral = jest.fn();
  const visitRecordLiteral = jest.fn();
  const visitSymbol = jest.fn();
  const visitVectorLiteral = jest.fn();
  const visitor: NodeVisitor<undefined, undefined> = {
    visitDefinition,
    visitLiteral,
    visitRecordLiteral,
    visitSymbol,
    visitVectorLiteral,
  };

  beforeEach(() => {
    visitDefinition.mockReset();
    visitLiteral.mockReset();
    visitRecordLiteral.mockReset();
    visitSymbol.mockReset();
    visitVectorLiteral.mockReset();
  });

  it("should visit definition", () => {
    visitNode(
      visitor,
      {
        type: "Definition",
        position: { line: 1, column: 1 },
        id: "test",
      } as DefinitionNode,
      undefined,
    );

    expect(visitDefinition).toHaveBeenCalled();
  });

  it("should visit literal", () => {
    visitNode(
      visitor,
      {
        type: "Literal",
        position: { line: 1, column: 1 },
        value: {
          type: "String",
          value: "test",
        },
      } as LiteralNode,
      undefined,
    );

    expect(visitLiteral).toHaveBeenCalled();
  });

  it("should visit record literal", () => {
    visitNode(
      visitor,
      {
        type: "RecordLiteral",
        position: { line: 1, column: 1 },
        elements: new Map<string, Node>(),
      } as RecordLiteralNode,
      undefined,
    );

    expect(visitRecordLiteral).toHaveBeenCalled();
  });

  it("should visit symbol", () => {
    visitNode(
      visitor,
      {
        type: "Symbol",
        position: { line: 1, column: 1 },
        id: "test",
      } as SymbolNode,
      undefined,
    );

    expect(visitSymbol).toHaveBeenCalled();
  });

  it("should visit vector literal", () => {
    visitNode(
      visitor,
      {
        type: "VectorLiteral",
        position: { line: 1, column: 1 },
        elements: [],
      } as VectorLiteralNode,
      undefined,
    );

    expect(visitVectorLiteral).toHaveBeenCalled();
  });

  it("should throw error if node type cannot be recognized", () => {
    expect(() =>
      visitNode(
        visitor,
        {
          type: "Unrecognized" as NodeType,
          position: { line: 1, column: 1 },
        } as Node,
        undefined,
      ),
    ).toThrow(LaskinError);
  });
});
