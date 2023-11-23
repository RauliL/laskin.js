import { Decimal } from "decimal.js";

import * as api from "./api";
import { execScript } from "./exec";
import { Parser } from "./parser";
import {
  BooleanValue,
  BuiltinQuote,
  BuiltinQuoteCallback,
  DateValue,
  Month,
  MonthValue,
  NumberValue,
  OutputFunction,
  Quote,
  QuoteValue,
  RangeError,
  RecordValue,
  StringValue,
  TimeValue,
  TypeError,
  Unit,
  Value,
  ValueType,
  VectorValue,
  Weekday,
  WeekdayValue,
} from "./types";
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

export class Context implements Iterable<Value> {
  private readonly data: Value[];
  private readonly dictionary: Map<string, Value>;

  public constructor(initializeDefaultRuntime: boolean = true) {
    this.data = [];
    this.dictionary = new Map<string, Value>();

    if (initializeDefaultRuntime) {
      this.install(api.boolean);
      this.install(api.date);
      this.install(api.month);
      this.install(api.number);
      this.install(api.quote);
      this.install(api.record);
      this.install(api.string);
      this.install(api.time);
      this.install(api.utils);
      this.install(api.vector);
      this.install(api.weekday);
    }
  }

  public get length(): number {
    return this.data.length;
  }

  public [Symbol.iterator](): Iterator<Value> {
    const data = this.data;
    let index = data.length;

    return {
      next(): IteratorResult<Value> {
        --index;

        return {
          done: index < 0,
          value: data[index],
        };
      },
    };
  }

  public clear(): void {
    this.data.length = 0;
  }

  public peek<T extends Value = Value>(type?: ValueType): Readonly<T> {
    if (!this.data.length) {
      throw new RangeError("Stack underflow.");
    }

    const value = this.data[this.data.length - 1];

    if (type && value.type !== type) {
      throw new TypeError(
        `Unexpected ${value.type.toLowerCase()}; Was expecting ${type.toLowerCase()}.`,
      );
    }

    return value as T;
  }

  public peekBoolean(): boolean {
    return this.peek<BooleanValue>("Boolean").value;
  }

  public peekDate(): Readonly<DateValue> {
    return this.peek<DateValue>("Date");
  }

  public peekMonth(): Month {
    return this.peek<MonthValue>("Month").value;
  }

  public peekNumber(): Readonly<NumberValue> {
    return this.peek<NumberValue>("Number");
  }

  public peekQuote(): Quote {
    return this.peek<QuoteValue>("Quote").quote;
  }

  public peekRecord(): Readonly<Map<string, Value>> {
    return this.peek<RecordValue>("Record").elements;
  }

  public peekString(): string {
    return this.peek<StringValue>("String").value;
  }

  public peekTime(): Readonly<TimeValue> {
    return this.peek<TimeValue>("Time");
  }

  public peekVector(): Readonly<Value[]> {
    return this.peek<VectorValue>("Vector").elements;
  }

  public peekWeekday(): Weekday {
    return this.peek<WeekdayValue>("Weekday").value;
  }

  public pop<T extends Value = Value>(type?: ValueType): Readonly<T> {
    if (!this.data.length) {
      throw new RangeError("Stack underflow.");
    }

    const value = this.data.pop() as Value;

    if (type && value.type !== type) {
      throw new TypeError(
        `Unexpected ${value.type.toLowerCase()}; Was expecting ${type.toLowerCase()}.`,
      );
    }

    return value as T;
  }

  public popBoolean(): boolean {
    return this.pop<BooleanValue>("Boolean").value;
  }

  public popDate(): Readonly<DateValue> {
    return this.pop<DateValue>("Date");
  }

  public popMonth(): Month {
    return this.pop<MonthValue>("Month").value;
  }

  public popNumber(): Readonly<NumberValue> {
    return this.pop<NumberValue>("Number");
  }

  public popQuote(): Quote {
    return this.pop<QuoteValue>("Quote").quote;
  }

  public popRecord(): Readonly<Map<string, Value>> {
    return this.pop<RecordValue>("Record").elements;
  }

  public popString(): string {
    return this.pop<StringValue>("String").value;
  }

  public popTime(): Readonly<TimeValue> {
    return this.pop<TimeValue>("Time");
  }

  public popVector(): Readonly<Value[]> {
    return this.pop<VectorValue>("Vector").elements;
  }

  public popWeekday(): Weekday {
    return this.pop<WeekdayValue>("Weekday").value;
  }

  public push(...values: Value[]): void {
    this.data.push(...values);
  }

  public pushBoolean(value: boolean = false): void {
    this.data.push(newBooleanValue(value));
  }

  public pushDate(
    year: number = 1970,
    month: Month = Month.January,
    day: number = 1,
  ): void {
    this.data.push(newDateValue(year, month, day));
  }

  public pushMonth(value: Month = Month.January) {
    this.data.push(newMonthValue(value));
  }

  public pushNumber(value: Decimal.Value = 0, unit?: Unit): void {
    this.data.push(newNumberValue(value, unit));
  }

  public pushQuote(quote: Quote): void {
    this.data.push(newQuoteValue(quote));
  }

  public pushRecord(elements: Iterable<[string, Value]> = []): void {
    this.data.push(newRecordValue(elements));
  }

  public pushString(value: string = ""): void {
    this.data.push(newStringValue(value));
  }

  public pushTime(
    hour: number = 0,
    minute: number = 0,
    second: number = 0,
  ): void {
    this.data.push(newTimeValue(hour, minute, second));
  }

  public pushVector(elements: Value[] = []): void {
    this.data.push(newVectorValue(elements));
  }

  public pushWeekday(value: Weekday = Weekday.Sunday): void {
    this.data.push(newWeekdayValue(value));
  }

  public exec(
    sourceCode: string,
    output: OutputFunction,
    line: number = 1,
    column: number = 1,
  ): void {
    const parser = new Parser(sourceCode, line, column);
    const script = parser.parseScript();

    execScript(this, output, script);
  }

  public get symbols(): Iterable<string> {
    return this.dictionary.keys();
  }

  public lookup(id: string): Readonly<Value> | undefined {
    return this.dictionary.get(id);
  }

  public define(id: string, value: Value): void {
    this.dictionary.set(id, value);
  }

  public delete(id: string): boolean {
    return this.dictionary.delete(id);
  }

  private install(mapping: [string, BuiltinQuoteCallback][]): void {
    for (const [name, callback] of mapping) {
      this.dictionary.set(name, newQuoteValue(new BuiltinQuote(callback)));
    }
  }
}
