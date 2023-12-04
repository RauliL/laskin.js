import {
  DefinitionNode,
  LiteralNode,
  Node,
  RecordLiteralNode,
  SymbolNode,
  VectorLiteralNode,
} from "./ast";
import { ScriptedQuote } from "./quote";
import { SyntaxError } from "./exception";
import { StringValue, newQuoteValue, newStringValue } from "./value";

const isSpace = /^\s$/;
const isSymbol = /^[^[\](){},\s]$/u;

class Parser {
  private readonly source: string;
  private offset: number;
  private line: number;
  private column: number;

  public constructor(source: string, line: number, column: number) {
    this.source = source;
    this.offset = 0;
    this.line = line;
    this.column = column;
  }

  public parseScript(): Node[] {
    const nodes: Node[] = [];

    for (;;) {
      this.skipWhitespace();
      if (this.eof()) {
        break;
      }
      nodes.push(this.parseStatement());
    }

    return nodes;
  }

  private parseStatement(): Node {
    this.skipWhitespace();

    switch (this.source[this.offset]) {
      case "(":
        return this.parseQuoteLiteral();

      case "[":
        return this.parseVectorLiteral();

      case "{":
        return this.parseRecordLiteral();

      case '"':
      case "'":
        return this.parseStringLiteral();

      default:
        return this.parseStatementSymbol();
    }
  }

  private parseExpression(): Node {
    this.skipWhitespace();

    if (this.eof()) {
      throw new SyntaxError("Unexpected end of input; Missing expression.", {
        line: this.line,
        column: this.column,
      });
    }

    switch (this.source[this.offset]) {
      case "(":
        return this.parseQuoteLiteral();

      case "[":
        return this.parseVectorLiteral();

      case "{":
        return this.parseRecordLiteral();

      case '"':
      case "'":
        return this.parseStringLiteral();

      default:
        return this.parseSymbol();
    }
  }

  private parseQuoteLiteral(): LiteralNode {
    const nodes: Node[] = [];

    this.skipWhitespace();

    const line = this.line;
    const column = this.column;

    // Skip "(" and excess whitespace.
    this.read();
    this.skipWhitespace();

    if (!this.peekRead(")")) {
      for (;;) {
        if (this.eof()) {
          throw new SyntaxError("Unterminated quote literal: Missing `)'.", {
            line,
            column,
          });
        } else if (this.peekRead(")")) {
          break;
        }
        nodes.push(this.parseStatement());
        this.skipWhitespace();
      }
    }

    return {
      type: "Literal",
      position: { line, column },
      value: newQuoteValue(new ScriptedQuote(nodes)),
    };
  }

  private parseVectorLiteral(): VectorLiteralNode {
    const elements: Node[] = [];

    this.skipWhitespace();

    const line = this.line;
    const column = this.column;

    // Skip "[" and excess whitespace.
    this.read();
    this.skipWhitespace();

    if (!this.peekRead("]")) {
      for (;;) {
        if (this.eof()) {
          throw new SyntaxError("Unterminated vector literal: Missing `]'.", {
            line,
            column,
          });
        } else if (this.peekRead("]")) {
          break;
        }
        elements.push(this.parseExpression());
        this.skipWhitespace();
        if (this.peekRead(",")) {
          continue;
        } else if (this.peekRead("]")) {
          break;
        }

        throw new SyntaxError("Unterminated vector literal: Missing `]'.", {
          line,
          column,
        });
      }
    }

    return {
      type: "VectorLiteral",
      position: { line, column },
      elements,
    };
  }

  private parseRecordLiteral(): RecordLiteralNode {
    const elements = new Map<string, Node>();

    this.skipWhitespace();

    const line = this.line;
    const column = this.column;

    // Skip "{" and excess whitespace.
    this.read();
    this.skipWhitespace();

    if (!this.peekRead("}")) {
      for (;;) {
        if (this.eof()) {
          throw new SyntaxError("Unterminated record literal; Missing `}`.", {
            line,
            column,
          });
        } else if (this.peekRead("}")) {
          break;
        } else {
          const key = (this.parseStringLiteral().value as StringValue).value;

          this.skipWhitespace();
          if (!this.peekRead(":")) {
            throw new SyntaxError("Missing `:' after key.", {
              line: this.line,
              column: this.column,
            });
          }
          this.skipWhitespace();

          const value = this.parseExpression();

          elements.set(key, value);
          this.skipWhitespace();
          if (this.peekRead(",")) {
            continue;
          } else if (this.peekRead("}")) {
            break;
          }

          throw new SyntaxError("Unterminated record literal; Missing `}'.", {
            line,
            column,
          });
        }
      }
    }

    return {
      type: "RecordLiteral",
      position: { line, column },
      elements,
    };
  }

  private parseEscapeSequence(): string {
    let c: string;

    if (this.eof()) {
      throw new SyntaxError("Unterminated escape sequence.", {
        line: this.line,
        column: this.column,
      });
    }
    switch ((c = this.read())) {
      case "b":
        return "\b";

      case "t":
        return "\t";

      case "n":
        return "\n";

      case "f":
        return "\f";

      case "r":
        return "\r";

      case '"':
      case "'":
      case "\\":
      case "/":
        return c;

      case "u": {
        let result = 0;

        for (let i = 0; i < 4; ++i) {
          if (this.eof()) {
            throw new SyntaxError("Unterminated escape sequence.", {
              line: this.line,
              column: this.column,
            });
          } else if (!this.peek(/[a-fA-F0-9]/)) {
            throw new SyntaxError("Illegal Unicode hex escape sequence.", {
              line: this.line,
              column: this.column,
            });
          }
          if (this.peek(/[A-F]/)) {
            result =
              result * 16 +
              ((this.read().codePointAt(0) ?? 0) -
                ("A".codePointAt(0) ?? 0) +
                10);
          } else if (this.peek(/[a-f]/)) {
            result =
              result * 16 +
              ((this.read().codePointAt(0) ?? 0) -
                ("a".codePointAt(0) ?? 0) +
                10);
          } else {
            result =
              result * 16 +
              ((this.read().codePointAt(0) ?? 0) - ("0".codePointAt(0) ?? 0));
          }
        }

        return String.fromCodePoint(result);
      }

      default:
        throw new SyntaxError("Unrecognized escape sequence.", {
          line: this.line,
          column: this.column,
        });
    }
  }

  private parseStringLiteral(): LiteralNode {
    let buffer = "";
    let separator: '"' | "'";

    this.skipWhitespace();

    const line = this.line;
    const column = this.column;

    if (this.peekRead('"')) {
      separator = '"';
    } else if (this.peekRead("'")) {
      separator = "'";
    } else {
      throw new SyntaxError(
        `Unexpected ${
          this.eof() ? "end of input" : "input"
        }; Missing string literal.`,
        { line, column },
      );
    }

    for (;;) {
      if (this.eof()) {
        throw new SyntaxError(
          `Unterminated string literal; Missing \`${separator}'.`,
          { line, column },
        );
      } else if (this.peekRead(separator)) {
        break;
      } else if (this.peekRead("\\")) {
        buffer += this.parseEscapeSequence();
      } else {
        buffer += this.read();
      }
    }

    return {
      type: "Literal",
      position: { line, column },
      value: newStringValue(buffer),
    };
  }

  private parseSymbol(): SymbolNode {
    let buffer = "";

    this.skipWhitespace();

    const line = this.line;
    const column = this.column;

    if (!this.peek(isSymbol)) {
      throw new SyntaxError(
        `Unexpected ${this.eof() ? "end of input" : "input"}; Missing symbol.`,
        { line, column },
      );
    }

    do {
      buffer += this.read();
    } while (this.peek(isSymbol));

    return {
      type: "Symbol",
      position: { line, column },
      id: buffer,
    };
  }

  private parseStatementSymbol(): DefinitionNode | SymbolNode {
    let buffer = "";

    this.skipWhitespace();

    const line = this.line;
    const column = this.column;

    if (!this.peek(isSymbol)) {
      throw new SyntaxError(
        `Unexpected ${
          this.eof() ? "end of input" : "input"
        }; Missing symbol or definition.`,
        { line, column },
      );
    }

    do {
      buffer += this.read();
    } while (this.peek(isSymbol));

    if (buffer === "->") {
      const symbol = this.parseSymbol();

      return {
        type: "Definition",
        position: { line, column },
        id: symbol.id,
      } as DefinitionNode;
    }

    return {
      type: "Symbol",
      position: { line, column },
      id: buffer,
    } as SymbolNode;
  }

  /**
   * Returns true if there are no more characters to be read from the source
   * code.
   */
  private eof(): boolean {
    return this.offset >= this.source.length;
  }

  /**
   * Advances to next character in the source code and returns the current one.
   */
  private read(): string {
    const result = this.source[this.offset++];

    if (result === "\n") {
      ++this.line;
      this.column = 1;
    } else {
      ++this.column;
    }

    return result;
  }

  /**
   * Returns true if next character from the source code matches with given
   * pattern.
   */
  private peek(pattern: RegExp): boolean {
    return pattern.test(this.source[this.offset]);
  }

  /**
   * Returns true and advances to next character in the source code if current
   * one equals with the one given as argument.
   */
  private peekRead(expected: string): boolean {
    if (this.source[this.offset] === expected) {
      this.read();

      return true;
    }

    return false;
  }

  /**
   * Skips whitespace and comments from the source code.
   */
  private skipWhitespace(): void {
    while (!this.eof()) {
      // Skip line comments.
      if (this.peekRead("#")) {
        while (!this.eof()) {
          if (this.peekRead("\n") || this.peekRead("\r")) {
            break;
          } else {
            this.read();
          }
        }
      } else if (!this.peek(isSpace)) {
        return;
      } else {
        this.read();
      }
    }
  }
}

export const parse = (
  sourceCode: string,
  line: number = 1,
  column: number = 1,
): Node[] => new Parser(sourceCode, line, column).parseScript();
