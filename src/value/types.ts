import { Decimal } from "decimal.js";

import { Month, Weekday } from "../chrono";
import { Quote } from "../quote";
import { Unit } from "../unit";

export type ValueType =
  | "Boolean"
  | "Date"
  | "Month"
  | "Number"
  | "Quote"
  | "Record"
  | "String"
  | "Time"
  | "Vector"
  | "Weekday";

export type Value = {
  type: ValueType;
};

export type BooleanValue = Value & {
  type: "Boolean";
  value: Readonly<boolean>;
};

export type DateValue = Value & {
  type: "Date";
  year: number;
  month: Month;
  day: number;
};

export type MonthValue = Value & {
  type: "Month";
  value: Month;
};

export type NumberValue = Value & {
  type: "Number";
  value: Decimal;
  unit?: Unit;
};

export type QuoteValue = Value & {
  type: "Quote";
  quote: Quote;
};

export type RecordValue = Value & {
  type: "Record";
  elements: Map<string, Value>;
};

export type StringValue = Value & {
  type: "String";
  value: string;
};

export type TimeValue = Value & {
  type: "Time";
  hour: number;
  minute: number;
  second: number;
};

export type VectorValue = Value & {
  type: "Vector";
  elements: Value[];
};

export type WeekdayValue = Value & {
  type: "Weekday";
  value: Weekday;
};
