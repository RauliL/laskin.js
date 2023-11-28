import { Node } from "./ast";
import { Context, PrintFunction } from "./context";
import { nodeToSource } from "./to-source";

export abstract class Quote {
  public abstract call(context: Context, print: PrintFunction): void;

  public abstract toSource(): string;
}

export type BuiltinQuoteCallback = (
  context: Context,
  print: PrintFunction,
) => void;

export class BuiltinQuote extends Quote {
  private readonly callback: BuiltinQuoteCallback;

  public constructor(callback: BuiltinQuoteCallback) {
    super();

    this.callback = callback;
  }

  public call(context: Context, print: PrintFunction): void {
    this.callback(context, print);
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

  public call(context: Context, print: PrintFunction): void {
    context.exec(this.nodes, print);
  }

  public toSource(): string {
    return `(${this.nodes.map((node) => nodeToSource(node)).join(" ")})`;
  }
}
