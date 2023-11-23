import { Context } from "../context";
import { execScript } from "../exec";
import { nodeToSource } from "../to-source";
import { Node } from "./ast";

export type OutputFunction = (text: string) => void;

export abstract class Quote {
  public abstract call(context: Context, output: OutputFunction): void;

  public abstract toSource(): string;
}

export type BuiltinQuoteCallback = (
  context: Context,
  output: OutputFunction,
) => void;

export class BuiltinQuote extends Quote {
  private readonly callback: BuiltinQuoteCallback;

  public constructor(callback: BuiltinQuoteCallback) {
    super();

    this.callback = callback;
  }

  public call(context: Context, output: OutputFunction): void {
    this.callback(context, output);
  }

  public toSource(): string {
    return '("native quote")';
  }
}

export class ScriptedQuote extends Quote {
  private readonly nodes: Node[];

  public constructor(nodes: Node[]) {
    super();

    this.nodes = nodes;
  }

  public call(context: Context, output: OutputFunction): void {
    execScript(context, output, this.nodes);
  }

  public toSource(): string {
    return `(${this.nodes.map((node) => nodeToSource(node)).join(" ")})`;
  }
}
