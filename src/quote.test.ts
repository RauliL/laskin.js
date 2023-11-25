import { LiteralNode, SymbolNode } from "./ast";
import { Context } from "./context";
import { BuiltinQuote, ScriptedQuote } from "./quote";
import { newStringValue } from "./value";

describe("class BuiltinQuote", () => {
  describe("call()", () => {
    it("should invoke the callback", () => {
      const callback = jest.fn();
      const quote = new BuiltinQuote(callback);

      quote.call(new Context(), jest.fn());

      expect(callback).toHaveBeenCalled();
    });
  });

  describe("toSource()", () => {
    it("should return static string", () => {
      const quote = new BuiltinQuote(jest.fn());

      expect(quote.toSource()).toBe('("native quote")');
    });
  });
});

describe("class ScriptedQuote", () => {
  describe("call()", () => {
    it("should execute the nodes as a script", () => {
      const quote = new ScriptedQuote([
        {
          type: "Literal",
          position: { line: 1, column: 1 },
          value: newStringValue("test"),
        } as LiteralNode,
      ]);
      const context = new Context();

      quote.call(context, jest.fn());

      expect(context.peekString()).toBe("test");
    });
  });

  describe("toSource()", () => {
    it("should return string representation of the nodes", () => {
      const quote = new ScriptedQuote([
        {
          type: "Symbol",
          position: { line: 1, column: 1 },
          id: "foo",
        } as SymbolNode,
        {
          type: "Symbol",
          position: { line: 1, column: 1 },
          id: "bar",
        } as SymbolNode,
      ]);

      expect(quote.toSource()).toBe("(foo bar)");
    });
  });
});
