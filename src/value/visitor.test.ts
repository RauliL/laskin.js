import { LaskinError } from "../exception";
import { ScriptedQuote } from "../quote";
import { Month, Weekday } from "../types";
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
} from "./constructor";
import { Value, ValueType } from "./types";
import { ValueVisitor, visitValue } from "./visitor";

describe("visitValue()", () => {
  const visitBoolean = jest.fn();
  const visitDate = jest.fn();
  const visitMonth = jest.fn();
  const visitNumber = jest.fn();
  const visitQuote = jest.fn();
  const visitRecord = jest.fn();
  const visitString = jest.fn();
  const visitTime = jest.fn();
  const visitVector = jest.fn();
  const visitWeekday = jest.fn();
  const visitor: ValueVisitor<undefined, undefined> = {
    visitBoolean,
    visitDate,
    visitMonth,
    visitNumber,
    visitQuote,
    visitRecord,
    visitString,
    visitTime,
    visitVector,
    visitWeekday,
  };

  beforeEach(() => {
    visitBoolean.mockReset();
    visitDate.mockReset();
    visitMonth.mockReset();
    visitNumber.mockReset();
    visitQuote.mockReset();
    visitRecord.mockReset();
    visitString.mockReset();
    visitTime.mockReset();
    visitVector.mockReset();
    visitWeekday.mockReset();
  });

  it("should visit boolean", () => {
    visitValue(visitor, newBooleanValue(true), undefined);

    expect(visitBoolean).toHaveBeenCalled();
  });

  it("should visit date", () => {
    visitValue(visitor, newDateValue(2023, Month.October, 24), undefined);

    expect(visitDate).toHaveBeenCalled();
  });

  it("should visit month", () => {
    visitValue(visitor, newMonthValue(Month.January), undefined);

    expect(visitMonth).toHaveBeenCalled();
  });

  it("should visit number", () => {
    visitValue(visitor, newNumberValue(0), undefined);

    expect(visitNumber).toHaveBeenCalled();
  });

  it("should visit quote", () => {
    visitValue(visitor, newQuoteValue(new ScriptedQuote([])), undefined);

    expect(visitQuote).toHaveBeenCalled();
  });

  it("should visit record", () => {
    visitValue(visitor, newRecordValue(new Map<string, Value>()), undefined);

    expect(visitRecord).toHaveBeenCalled();
  });

  it("should visit string", () => {
    visitValue(visitor, newStringValue(""), undefined);

    expect(visitString).toHaveBeenCalled();
  });

  it("should visit time", () => {
    visitValue(visitor, newTimeValue(0, 0, 0), undefined);

    expect(visitTime).toHaveBeenCalled();
  });

  it("should visit vector", () => {
    visitValue(visitor, newVectorValue([]), undefined);

    expect(visitVector).toHaveBeenCalled();
  });

  it("should visit weekday", () => {
    visitValue(visitor, newWeekdayValue(Weekday.Monday), undefined);

    expect(visitWeekday).toHaveBeenCalled();
  });

  it("should throw error if value type cannot be recognized", () => {
    expect(() =>
      visitValue(
        visitor,
        { type: "Unrecognized" as ValueType } as Value,
        undefined,
      ),
    ).toThrow(LaskinError);
  });
});
