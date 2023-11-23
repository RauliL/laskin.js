import { Context } from "./context";
import {
  Month,
  RangeError,
  ScriptedQuote,
  SyntaxError,
  TypeError,
  Weekday,
} from "./types";
import {
  newBooleanValue,
  newDateValue,
  newNumberValue,
  newStringValue,
  newTimeValue,
} from "./value";

describe("class Context", () => {
  const context = new Context(false);

  beforeEach(() => {
    context.clear();
    Reflect.get(context, "dictionary").clear();
  });

  describe("get length()", () => {
    it("should return the number of items stored in the stack", () => {
      expect(context).toHaveLength(0);

      context.pushBoolean(false);

      expect(context).toHaveLength(1);
    });
  });

  describe("iterator", () => {
    it("should iterate data from stack in LIFO order", () => {
      context.pushString("foo");
      context.pushString("bar");
      context.pushString("baz");

      const result = Array.from(context);

      expect(result).toHaveLength(3);
      expect(result).toMatchObject({
        0: {
          value: "baz",
        },
        1: {
          value: "bar",
        },
        2: {
          value: "foo",
        },
      });
    });
  });

  describe("clear()", () => {
    it("should remove all data from the stack", () => {
      context.pushBoolean(false);
      context.pushBoolean(false);

      expect(context).toHaveLength(2);

      context.clear();

      expect(context).toHaveLength(0);
    });
  });

  describe("peek()", () => {
    it("should throw exception if stack is empty", () => {
      expect(() => context.peek()).toThrow(RangeError);
    });

    it("should throw exception if attempting to peek specific type of value and stack does not contain it", () => {
      context.pushBoolean(false);

      expect(() => context.peek("Date")).toThrow(TypeError);
    });

    it("should return the top-most value from the stack", () => {
      const value = newStringValue("test");

      context.push(value);

      expect(context.peek()).toBe(value);
    });
  });

  describe("peekBoolean()", () => {
    it("should return boolean value stored in stack", () => {
      context.pushBoolean(true);

      expect(context.peekBoolean()).toBe(true);
    });
  });

  describe("peekDate()", () => {
    it("should return date value stored in stack", () => {
      const value = newDateValue(2023, Month.November, 1);

      context.push(value);

      expect(context.peekDate()).toBe(value);
    });
  });

  describe("peekMonth()", () => {
    it("should return month value stored in stack", () => {
      context.pushMonth(Month.September);

      expect(context.peekMonth()).toBe(Month.September);
    });
  });

  describe("peekNumber()", () => {
    it("should return number value stored in stack", () => {
      const value = newNumberValue(5);

      context.push(value);

      expect(context.peekNumber()).toBe(value);
    });
  });

  describe("peekQuote()", () => {
    it("should return quote value stored in stack", () => {
      const quote = new ScriptedQuote([]);

      context.pushQuote(quote);

      expect(context.peekQuote()).toBe(quote);
    });
  });

  describe("peekRecord()", () => {
    it("should return record value stored in stack", () => {
      context.pushRecord([]);

      expect(context.peekRecord()).toBeInstanceOf(Map);
    });
  });

  describe("peekString()", () => {
    it("should return string value stored in stack", () => {
      context.pushString("test");

      expect(context.peekString()).toBe("test");
    });
  });

  describe("peekTime()", () => {
    it("should return time value stored in stack", () => {
      const value = newTimeValue();

      context.push(value);

      expect(context.peekTime()).toBe(value);
    });
  });

  describe("peekVector()", () => {
    it("should return vector value stored in stack", () => {
      context.pushVector([newTimeValue()]);

      expect(context.peekVector()).toHaveLength(1);
    });
  });

  describe("peekWeekday()", () => {
    it("should return weekday value stored in stack", () => {
      context.pushWeekday(Weekday.Wednesday);

      expect(context.peekWeekday()).toBe(Weekday.Wednesday);
    });
  });

  describe("pop()", () => {
    it("should throw exception if stack is empty", () => {
      expect(() => context.pop()).toThrow(RangeError);
    });

    it("should throw exception if attempting to peek specific type of value and stack does not contain it", () => {
      context.pushBoolean(false);

      expect(() => context.pop("Date")).toThrow(TypeError);
    });

    it("should return and remove the top-most value from the stack", () => {
      const value = newStringValue("test");

      context.push(value);

      expect(context.pop()).toBe(value);
      expect(context).toHaveLength(0);
    });
  });

  describe("popBoolean()", () => {
    it("should return and remove boolean value from the stack", () => {
      context.pushBoolean(true);

      expect(context.popBoolean()).toBe(true);
      expect(context).toHaveLength(0);
    });
  });

  describe("popDate()", () => {
    it("should return and remove date value from the stack", () => {
      const value = newDateValue();

      context.push(value);

      expect(context.popDate()).toBe(value);
      expect(context).toHaveLength(0);
    });
  });

  describe("popMonth()", () => {
    it("should return and remove month value from the stack", () => {
      context.pushMonth(Month.August);

      expect(context.popMonth()).toBe(Month.August);
      expect(context).toHaveLength(0);
    });
  });

  describe("popNumber()", () => {
    it("should return and remove number value from the stack", () => {
      const value = newNumberValue();

      context.push(value);

      expect(context.popNumber()).toBe(value);
      expect(context).toHaveLength(0);
    });
  });

  describe("popQuote()", () => {
    it("should return and remove quote value from the stack", () => {
      const quote = new ScriptedQuote([]);

      context.pushQuote(quote);

      expect(context.popQuote()).toBe(quote);
      expect(context).toHaveLength(0);
    });
  });

  describe("popRecord()", () => {
    it("should return and remove record value from the stack", () => {
      context.pushRecord();

      expect(context.popRecord()).toBeInstanceOf(Map);
      expect(context).toHaveLength(0);
    });
  });

  describe("popString()", () => {
    it("should return and remove string value from the stack", () => {
      context.pushString("test");

      expect(context.popString()).toBe("test");
      expect(context).toHaveLength(0);
    });
  });

  describe("popTime()", () => {
    it("should return and remove time value from the stack", () => {
      const value = newTimeValue();

      context.push(value);

      expect(context.popTime()).toBe(value);
      expect(context).toHaveLength(0);
    });
  });

  describe("popVector()", () => {
    it("should return and remove vector value from the stack", () => {
      context.pushVector([newBooleanValue(false)]);

      expect(context.popVector()).toHaveLength(1);
      expect(context).toHaveLength(0);
    });
  });

  describe("popWeekday()", () => {
    it("should return and remove weekday value from the stack", () => {
      context.pushWeekday(Weekday.Thursday);

      expect(context.popWeekday()).toBe(Weekday.Thursday);
      expect(context).toHaveLength(0);
    });
  });

  describe("push()", () => {
    it("should insert values into the stack", () => {
      context.push(newBooleanValue(false), newBooleanValue(true));

      expect(context).toHaveLength(2);
    });
  });

  describe("pushBoolean()", () => {
    it("should insert boolean value into the stack", () => {
      context.pushBoolean(true);

      expect(context.peek()).toHaveProperty("type", "Boolean");
      expect(context).toHaveLength(1);
    });
  });

  describe("pushDate()", () => {
    it("should insert date value into the stack", () => {
      context.pushDate();

      expect(context.peek()).toHaveProperty("type", "Date");
      expect(context).toHaveLength(1);
    });
  });

  describe("pushMonth()", () => {
    it("should insert month value into the stack", () => {
      context.pushMonth(Month.May);

      expect(context.peek()).toMatchObject({
        type: "Month",
        value: Month.May,
      });
      expect(context).toHaveLength(1);
    });
  });

  describe("pushNumber()", () => {
    it("should insert number value into the stack", () => {
      context.pushNumber();

      expect(context.peek()).toHaveProperty("type", "Number");
      expect(context).toHaveLength(1);
    });
  });

  describe("pushQuote()", () => {
    it("should insert quote value into the stack", () => {
      context.pushQuote(new ScriptedQuote([]));

      expect(context.peek()).toHaveProperty("type", "Quote");
      expect(context).toHaveLength(1);
    });
  });

  describe("pushRecord()", () => {
    it("should insert record value into the stack", () => {
      context.pushRecord();

      expect(context.peek()).toHaveProperty("type", "Record");
      expect(context).toHaveLength(1);
    });
  });

  describe("pushString()", () => {
    it("should insert string value into the stack", () => {
      context.pushString("test");

      expect(context.peek()).toMatchObject({
        type: "String",
        value: "test",
      });
      expect(context).toHaveLength(1);
    });
  });

  describe("pushTime()", () => {
    it("should insert time value into the stack", () => {
      context.pushTime();

      expect(context.peek()).toHaveProperty("type", "Time");
      expect(context).toHaveLength(1);
    });
  });

  describe("pushVector()", () => {
    it("should insert vector value into the stack", () => {
      context.pushVector();

      expect(context.peek()).toHaveProperty("type", "Vector");
      expect(context).toHaveLength(1);
    });
  });

  describe("pushWeekday()", () => {
    it("should insert weekday value into the stack", () => {
      context.pushWeekday(Weekday.Tuesday);

      expect(context.peek()).toMatchObject({
        type: "Weekday",
        value: Weekday.Tuesday,
      });
      expect(context).toHaveLength(1);
    });
  });

  describe("exec()", () => {
    it("should parse given string and execute it as a script", () => {
      context.exec('15 "test" 2023-11-01 15:30:00 [] {}', jest.fn());

      expect(context).toHaveLength(6);
      expect(context.pop()).toHaveProperty("type", "Record");
      expect(context.pop()).toHaveProperty("type", "Vector");
      expect(context.pop()).toHaveProperty("type", "Time");
      expect(context.pop()).toHaveProperty("type", "Date");
      expect(context.pop()).toHaveProperty("type", "String");
      expect(context.pop()).toHaveProperty("type", "Number");
    });

    it("should throw an exception if syntax error is encountered", () => {
      expect(() => context.exec("(", jest.fn())).toThrow(SyntaxError);
    });
  });

  describe("get symbols()", () => {
    it("should return all symbols stored in the dictionary", () => {
      context.define("foo", newStringValue("foo"));
      context.define("bar", newStringValue("bar"));

      const result = Array.from(context.symbols);

      expect(result).toHaveLength(2);
      expect(result).toContain("foo");
      expect(result).toContain("bar");
    });
  });

  describe("lookup()", () => {
    it("should return value associated with the symbol", () => {
      const value = newStringValue();

      context.define("foo", value);

      expect(context.lookup("foo")).toBe(value);
    });

    it("should return `undefined` if no value associated with the symbol exist", () => {
      expect(context.lookup("foo")).toBeUndefined();
    });
  });

  describe("define()", () => {
    it("should override existing entries in the dictionary with the same symbol", () => {
      const value = newStringValue("foo");

      context.define("foo", newStringValue("bar"));
      context.define("foo", value);

      expect(context.lookup("foo")).toBe(value);
    });
  });

  describe("delete()", () => {
    it("should return `true` if an entry was removed from the dictionary", () => {
      context.define("foo", newStringValue());

      expect(context.delete("foo")).toBe(true);
    });

    it("should return `false` if an entry does not exist in the dictionary", () => {
      expect(context.delete("foo")).toBe(false);
    });
  });
});
