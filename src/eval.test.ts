import {
  DefinitionNode,
  LiteralNode,
  Node,
  RecordLiteralNode,
  SymbolNode,
  VectorLiteralNode,
} from "./ast";
import { Month, Weekday } from "./chrono";
import { Context } from "./context";
import { evalNode } from "./eval";
import { NameError, SyntaxError } from "./exception";
import { units } from "./unit";
import { newStringValue, RecordValue } from "./value";

describe("evalNode()", () => {
  const context = new Context(false);

  beforeEach(() => {
    context.clear();
    Reflect.get(context, "dictionary").clear();
  });

  it("should throw exception when definition is evaluated", () => {
    expect(() =>
      evalNode(context, {
        type: "Definition",
        position: { line: 1, column: 1 },
        id: "foo",
      } as DefinitionNode),
    ).toThrow(SyntaxError);
  });

  it("should evaluate literal node", () => {
    const value = newStringValue("foo");

    expect(
      evalNode(context, {
        type: "Literal",
        position: { line: 1, column: 1 },
        value,
      } as LiteralNode),
    ).toBe(value);
  });

  it("should evaluate record literal node", () => {
    const result = evalNode(context, {
      type: "RecordLiteral",
      position: { line: 1, column: 1 },
      elements: new Map<string, Node>([
        [
          "foo",
          {
            type: "Literal",
            position: { line: 1, column: 1 },
            value: newStringValue("bar"),
          } as LiteralNode,
        ],
      ]),
    } as RecordLiteralNode);

    expect(result).toHaveProperty("type", "Record");
    expect((result as RecordValue).elements).toBeInstanceOf(Map);
    expect((result as RecordValue).elements.has("foo")).toBe(true);
  });

  it("should evaluate `true` literal", () => {
    expect(
      evalNode(context, {
        type: "Symbol",
        position: { line: 1, column: 1 },
        id: "true",
      } as SymbolNode),
    ).toEqual({
      type: "Boolean",
      value: true,
    });
  });

  it("should evaluate `false` literal", () => {
    expect(
      evalNode(context, {
        type: "Symbol",
        position: { line: 1, column: 1 },
        id: "false",
      } as SymbolNode),
    ).toEqual({
      type: "Boolean",
      value: false,
    });
  });

  it("should evaluate `drop` literal", () => {
    context.pushString("foo");

    expect(
      evalNode(context, {
        type: "Symbol",
        position: { line: 1, column: 1 },
        id: "drop",
      } as SymbolNode),
    ).toEqual({
      type: "String",
      value: "foo",
    });
  });

  it("should evaluate number literal", () => {
    expect(
      evalNode(context, {
        type: "Symbol",
        position: { line: 1, column: 1 },
        id: "15.5km",
      } as SymbolNode),
    ).toMatchObject({
      type: "Number",
      unit: units.kilometer,
    });
  });

  it("should evaluate date literal", () => {
    expect(
      evalNode(context, {
        type: "Symbol",
        position: { line: 1, column: 1 },
        id: "2023-05-01",
      } as SymbolNode),
    ).toEqual({
      type: "Date",
      year: 2023,
      month: Month.May,
      day: 1,
    });
  });

  it("should evaluate time literal", () => {
    expect(
      evalNode(context, {
        type: "Symbol",
        position: { line: 1, column: 1 },
        id: "05:45:59",
      } as SymbolNode),
    ).toEqual({
      type: "Time",
      hour: 5,
      minute: 45,
      second: 59,
    });
  });

  it("should evaluate month literal", () => {
    expect(
      evalNode(context, {
        type: "Symbol",
        position: { line: 1, column: 1 },
        id: "february",
      } as SymbolNode),
    ).toEqual({
      type: "Month",
      value: Month.February,
    });
  });

  it("should evaluate weekday literal", () => {
    expect(
      evalNode(context, {
        type: "Symbol",
        position: { line: 1, column: 1 },
        id: "wednesday",
      } as SymbolNode),
    ).toEqual({
      type: "Weekday",
      value: Weekday.Wednesday,
    });
  });

  it("should throw exception when unrecognized symbol is encountered", () => {
    expect(() =>
      evalNode(context, {
        type: "Symbol",
        position: { line: 1, column: 1 },
        id: "unrecognized",
      } as SymbolNode),
    ).toThrow(NameError);
  });

  it("should evaluate vector literal", () => {
    expect(
      evalNode(context, {
        type: "VectorLiteral",
        position: { line: 1, column: 1 },
        elements: [
          {
            type: "Literal",
            position: { line: 1, column: 1 },
            value: newStringValue("foo"),
          } as LiteralNode,
        ],
      } as VectorLiteralNode),
    ).toEqual({
      type: "Vector",
      elements: [
        {
          type: "String",
          value: "foo",
        },
      ],
    });
  });
});
