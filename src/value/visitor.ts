import { LaskinError } from "../exception";
import {
  BooleanValue,
  DateValue,
  MonthValue,
  NumberValue,
  QuoteValue,
  RecordValue,
  StringValue,
  TimeValue,
  Value,
  VectorValue,
  WeekdayValue,
} from "./types";

export type ValueVisitor<R, A = undefined> = {
  visitBoolean: (value: BooleanValue, arg: A) => R;
  visitDate: (value: DateValue, arg: A) => R;
  visitMonth: (value: MonthValue, arg: A) => R;
  visitNumber: (value: NumberValue, arg: A) => R;
  visitQuote: (value: QuoteValue, arg: A) => R;
  visitRecord: (value: RecordValue, arg: A) => R;
  visitString: (value: StringValue, arg: A) => R;
  visitTime: (value: TimeValue, arg: A) => R;
  visitVector: (value: VectorValue, arg: A) => R;
  visitWeekday: (value: WeekdayValue, arg: A) => R;
};

export const visitValue = <R, A = undefined>(
  visitor: ValueVisitor<R, A>,
  value: Value,
  arg: A,
): R => {
  switch (value.type) {
    case "Boolean":
      return visitor.visitBoolean(value as BooleanValue, arg);

    case "Date":
      return visitor.visitDate(value as DateValue, arg);

    case "Month":
      return visitor.visitMonth(value as MonthValue, arg);

    case "Number":
      return visitor.visitNumber(value as NumberValue, arg);

    case "Quote":
      return visitor.visitQuote(value as QuoteValue, arg);

    case "Record":
      return visitor.visitRecord(value as RecordValue, arg);

    case "String":
      return visitor.visitString(value as StringValue, arg);

    case "Time":
      return visitor.visitTime(value as TimeValue, arg);

    case "Vector":
      return visitor.visitVector(value as VectorValue, arg);

    case "Weekday":
      return visitor.visitWeekday(value as WeekdayValue, arg);
  }

  throw new LaskinError(`Unrecognized value type: ${value.type}`);
};
