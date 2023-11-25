import {
  DefinitionNode,
  LiteralNode,
  RecordLiteralNode,
  SymbolNode,
  VectorLiteralNode,
} from "./ast";
import { Month, Weekday } from "./chrono";
import { ScriptedQuote } from "./quote";
import { nodeToSource, valueToSource } from "./to-source";
import { units } from "./unit";
import {
  newBooleanValue,
  newDateValue,
  newMonthValue,
  newNumberValue,
  newQuoteValue,
  newRecordValue,
  newStringValue,
  newTimeValue,
  newVectorValue,
  newWeekdayValue,
} from "./value";

describe("valueToSource()", () => {
  it("should convert boolean to source code", () =>
    expect(valueToSource(newBooleanValue(false))).toBe("false"));

  it("should convert date to source code", () =>
    expect(valueToSource(newDateValue(2023, Month.August, 1))).toBe(
      "2023-08-01",
    ));

  it("should convert month to source code", () =>
    expect(valueToSource(newMonthValue(Month.July))).toBe("july"));

  it.each([
    [5, units.kilogram, "5kg"],
    [-10, undefined, "-10"],
  ])("should convert number to source code", (value, unit, expectedResult) =>
    expect(valueToSource(newNumberValue(value, unit))).toBe(expectedResult),
  );

  it("should convert quote to source code", () =>
    expect(
      valueToSource(
        newQuoteValue(
          new ScriptedQuote([
            {
              type: "Symbol",
              position: { line: 1, column: 1 },
              id: "foo",
            } as SymbolNode,
          ]),
        ),
      ),
    ).toBe("(foo)"));

  it("should convert record to source code", () =>
    expect(
      valueToSource(
        newRecordValue([
          ["foo", newBooleanValue(true)],
          ["bar", newBooleanValue(false)],
        ]),
      ),
    ).toBe('{"foo": true, "bar": false}'));

  it("should convert string to source code", () =>
    expect(valueToSource(newStringValue("foo bar"))).toBe('"foo bar"'));

  it("should convert time to source code", () =>
    expect(valueToSource(newTimeValue(5, 30, 45))).toBe("05:30:45"));

  it("should convert vector to source code", () =>
    expect(
      valueToSource(
        newVectorValue([newBooleanValue(true), newBooleanValue(false)]),
      ),
    ).toBe("[true, false]"));

  it("should convert weekday to source code", () =>
    expect(valueToSource(newWeekdayValue(Weekday.Tuesday))).toBe("tuesday"));
});

describe("nodeToSource()", () => {
  it("should convert definition to source code", () =>
    expect(
      nodeToSource({
        type: "Definition",
        position: { line: 1, column: 1 },
        id: "foo",
      } as DefinitionNode),
    ).toBe("-> foo"));

  it("should convert literal to source code", () =>
    expect(
      nodeToSource({
        type: "Literal",
        position: { line: 1, column: 1 },
        value: newStringValue("foo bar"),
      } as LiteralNode),
    ).toBe('"foo bar"'));

  it("should convert record literal to source code", () =>
    expect(
      nodeToSource({
        type: "RecordLiteral",
        position: { line: 1, column: 1 },
        elements: new Map([
          [
            "foo",
            {
              type: "Literal",
              position: { line: 1, column: 1 },
              value: newStringValue("foo"),
            },
          ],
          [
            "bar",
            {
              type: "Literal",
              position: { line: 1, column: 1 },
              value: newStringValue("bar"),
            },
          ],
        ]),
      } as RecordLiteralNode),
    ).toBe('{"foo": "foo", "bar": "bar"}'));

  it("should convert symbol to source code", () =>
    expect(
      nodeToSource({
        type: "Symbol",
        position: { line: 1, column: 1 },
        id: "foo",
      } as SymbolNode),
    ).toEqual("foo"));

  it("should convert vector literal to source code", () =>
    expect(
      nodeToSource({
        type: "VectorLiteral",
        position: { line: 1, column: 1 },
        elements: [
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
        ],
      } as VectorLiteralNode),
    ).toBe("[foo, bar]"));
});
