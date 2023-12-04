import { RecordLiteralNode } from "./ast";
import { SyntaxError } from "./exception";
import { parse } from "./parser";

describe("parse()", () => {
  it("should be able to parse quote literals", () => {
    const result = parse("(1 2)");

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      type: "Literal",
      position: {
        line: 1,
        column: 1,
      },
      value: {
        type: "Quote",
      },
    });
  });

  it.each(["()", "( )"])("should allow empty quote literals", (input) => {
    const result = parse(input);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      type: "Literal",
      position: {
        line: 1,
        column: 1,
      },
      value: {
        type: "Quote",
      },
    });
  });

  it("should throw exception if quote literal is unterminated", () =>
    expect(() => parse("(1 2")).toThrow(SyntaxError));

  it("should be able to parse vector literals", () =>
    expect(parse("[1, 2]")).toEqual([
      {
        type: "VectorLiteral",
        position: {
          line: 1,
          column: 1,
        },
        elements: [
          {
            type: "Symbol",
            position: {
              line: 1,
              column: 2,
            },
            id: "1",
          },
          {
            type: "Symbol",
            position: {
              line: 1,
              column: 5,
            },
            id: "2",
          },
        ],
      },
    ]));

  it.each(["[]", "[ ]"])("should allow empty vector literals", (input) =>
    expect(parse(input)).toEqual([
      {
        type: "VectorLiteral",
        position: {
          line: 1,
          column: 1,
        },
        elements: [],
      },
    ]),
  );

  it("should allow dangling commas in vector literals", () =>
    expect(parse("[1,]")).toEqual([
      {
        type: "VectorLiteral",
        position: {
          line: 1,
          column: 1,
        },
        elements: [
          {
            type: "Symbol",
            position: {
              line: 1,
              column: 2,
            },
            id: "1",
          },
        ],
      },
    ]));

  it.each(["[1, 2", "["])(
    "should throw exception if vector literal is unterminated",
    (input) => expect(() => parse(input)).toThrow(SyntaxError),
  );

  it("should be able to parse record literals", () => {
    const result = parse("{'a': 1, 'b': 2}");

    expect(result).toHaveLength(1);
    expect(result).toHaveProperty([0, "type"], "RecordLiteral");
    expect((result[0] as RecordLiteralNode).elements.get("a")).toHaveProperty(
      "type",
      "Symbol",
    );
    expect((result[0] as RecordLiteralNode).elements.get("b")).toHaveProperty(
      "type",
      "Symbol",
    );
  });

  it.each(["{}", "{ }"])("should allow empty record literals", (input) => {
    const result = parse(input);

    expect(result).toHaveLength(1);
    expect(result).toHaveProperty([0, "type"], "RecordLiteral");
    expect((result[0] as RecordLiteralNode).elements.size).toBe(0);
  });

  it("should allow dangling commas in record literals", () => {
    const result = parse("{'a': 1,}");

    expect(result).toHaveLength(1);
    expect(result).toHaveProperty([0, "type"], "RecordLiteral");
    expect((result[0] as RecordLiteralNode).elements.size).toBe(1);
  });

  it.each(["{'a': 1", "{"])(
    "should throw exception if record literal is unterminated",
    (input) => expect(() => parse(input)).toThrow(SyntaxError),
  );

  it("should require `:' to be followed after key in record literal", () =>
    expect(() => parse("{'a' 5}")).toThrow(SyntaxError));

  it.each(['"', "'"])("should be able to parse string literals", (separator) =>
    expect(parse(`${separator}foo bar${separator}`)).toEqual([
      {
        type: "Literal",
        position: {
          line: 1,
          column: 1,
        },
        value: {
          type: "String",
          value: "foo bar",
        },
      },
    ]),
  );

  it.each([
    ["\\b", "\b"],
    ["\\t", "\t"],
    ["\\n", "\n"],
    ["\\f", "\f"],
    ["\\r", "\r"],
    ['\\"', '"'],
    ["\\'", "'"],
    ["\\\\", "\\"],
    ["\\/", "/"],
    ["\\u00e4", "\u00e4"],
    ["\\u00E4", "\u00e4"],
  ])("should be able to parse escape sequences", (input, expectedResult) =>
    expect(parse(`"${input}"`)).toEqual([
      {
        type: "Literal",
        position: {
          line: 1,
          column: 1,
        },
        value: {
          type: "String",
          value: expectedResult,
        },
      },
    ]),
  );

  it("should throw error if nothing follows after \\ in string literal", () =>
    expect(() => parse('"\\')).toThrow(SyntaxError));

  it("should throw error if escape sequence is unrecognized", () =>
    expect(() => parse('"\\q"')).toThrow(SyntaxError));

  it("should throw error if \\u escape sequence is unterminated", () =>
    expect(() => parse('"\\u')).toThrow(SyntaxError));

  it("should throw error if \\u escape sequence contains non-hexadecimal characters", () =>
    expect(() => parse('"\\u00fX"')).toThrow(SyntaxError));

  it.each(['"', "'"])(
    "should throw exception if string literal is unterminated",
    (separator) =>
      expect(() => parse(`${separator}foo bar`)).toThrow(SyntaxError),
  );

  it("should be able to parse symbols", () =>
    expect(parse("foo")).toEqual([
      {
        type: "Symbol",
        position: {
          line: 1,
          column: 1,
        },
        id: "foo",
      },
    ]));

  it("should throw exception if non-symbol character is encountered", () =>
    expect(() => parse(",")).toThrow(SyntaxError));

  it("should skip comments and extra whitespace", () =>
    expect(parse(" # should be ignored\n  \tfoo  \r\n")).toEqual([
      {
        type: "Symbol",
        position: {
          line: 2,
          column: 4,
        },
        id: "foo",
      },
    ]));

  it("should be able to parse definitions", () =>
    expect(parse("5 -> five")).toEqual([
      {
        type: "Symbol",
        position: {
          line: 1,
          column: 1,
        },
        id: "5",
      },
      {
        type: "Definition",
        position: {
          line: 1,
          column: 3,
        },
        id: "five",
      },
    ]));
});
