import {
  DefinitionNode,
  LiteralNode,
  Node,
  RecordLiteralNode,
  SymbolNode,
  VectorLiteralNode,
} from "./ast";
import { Month } from "./chrono";
import { Context } from "./context";
import { NameError } from "./exception";
import { execScript } from "./exec";
import { BuiltinQuote } from "./quote";
import { units } from "./unit";
import { newQuoteValue, newStringValue } from "./value";

describe("execScript()", () => {
  const context = new Context(false);

  beforeEach(() => {
    context.clear();
    Reflect.get(context, "dictionary").clear();
  });

  it("should be able to execute definition", () => {
    context.pushString("test");

    execScript(context, jest.fn(), [
      {
        type: "Definition",
        position: { line: 1, column: 1 },
        id: "test",
      } as DefinitionNode,
    ]);

    expect(context.lookup("test")).toEqual({
      type: "String",
      value: "test",
    });
  });

  it("should be able to execute literal", () => {
    execScript(context, jest.fn(), [
      {
        type: "Literal",
        position: { line: 1, column: 1 },
        value: newStringValue("test"),
      } as LiteralNode,
    ]);

    expect(context).toHaveLength(1);
    expect(context.popString()).toEqual("test");
  });

  it("should be able to execute record literal", () => {
    execScript(context, jest.fn(), [
      {
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
      } as RecordLiteralNode,
    ]);

    expect(context).toHaveLength(1);

    const record = context.popRecord();

    expect(record.has("foo"));
  });

  it("should be able to execute namespaced quotes", () => {
    const callback = jest.fn();

    context.define("string:foo", newQuoteValue(new BuiltinQuote(callback)));
    context.pushString("test");

    execScript(context, jest.fn(), [
      {
        type: "Symbol",
        position: { line: 1, column: 1 },
        id: "foo",
      } as SymbolNode,
    ]);

    expect(callback).toHaveBeenCalled();
  });

  it("should be able to pick up namespaced values from dictionary", () => {
    context.define("string:foo", newStringValue("foo"));
    context.pushString("test");

    execScript(context, jest.fn(), [
      {
        type: "Symbol",
        position: { line: 1, column: 1 },
        id: "foo",
      } as SymbolNode,
    ]);

    expect(context).toHaveLength(2);
    expect(context.popString()).toBe("foo");
  });

  it("should be able to execute non-namespaced quotes", () => {
    const callback = jest.fn();

    context.define("foo", newQuoteValue(new BuiltinQuote(callback)));

    execScript(context, jest.fn(), [
      {
        type: "Symbol",
        position: { line: 1, column: 1 },
        id: "foo",
      } as SymbolNode,
    ]);

    expect(callback).toHaveBeenCalled();
  });

  it("should be able to pick up non-namespaced values from dictionary", () => {
    context.define("foo", newStringValue("foo"));

    execScript(context, jest.fn(), [
      {
        type: "Symbol",
        position: { line: 1, column: 1 },
        id: "foo",
      } as SymbolNode,
    ]);

    expect(context).toHaveLength(1);
    expect(context.popString()).toBe("foo");
  });

  it("should be able to detect numbers", () => {
    execScript(context, jest.fn(), [
      {
        type: "Symbol",
        position: { line: 1, column: 1 },
        id: "500km",
      } as SymbolNode,
    ]);

    expect(context).toHaveLength(1);
    expect(context.pop()).toMatchObject({
      type: "Number",
      unit: units.kilometer,
    });
  });

  it("should be able to detect dates", () => {
    execScript(context, jest.fn(), [
      {
        type: "Symbol",
        position: { line: 1, column: 1 },
        id: "2023-11-05",
      } as SymbolNode,
    ]);

    expect(context).toHaveLength(1);
    expect(context.pop()).toEqual({
      type: "Date",
      year: 2023,
      month: Month.November,
      day: 5,
    });
  });

  it("should be able to detect times", () => {
    execScript(context, jest.fn(), [
      {
        type: "Symbol",
        position: { line: 1, column: 1 },
        id: "23:59:59",
      } as SymbolNode,
    ]);

    expect(context).toHaveLength(1);
    expect(context.pop()).toEqual({
      type: "Time",
      hour: 23,
      minute: 59,
      second: 59,
    });
  });

  it("should throw exception when unrecognized symbol is encountered", () => {
    expect(() =>
      execScript(context, jest.fn(), [
        {
          type: "Symbol",
          position: { line: 1, column: 1 },
          id: "unrecognized",
        } as SymbolNode,
      ]),
    ).toThrow(NameError);
  });

  it("should be able to execute vector literal", () => {
    execScript(context, jest.fn(), [
      {
        type: "VectorLiteral",
        position: { line: 1, column: 1 },
        elements: [
          {
            type: "Literal",
            position: { line: 1, column: 1 },
            value: newStringValue("foo"),
          } as LiteralNode,
        ],
      } as VectorLiteralNode,
    ]);

    expect(context.popVector()).toEqual([
      {
        type: "String",
        value: "foo",
      },
    ]);
  });
});
