import { RangeError, TypeError } from "../exception";
import {
  newBooleanValue,
  newNumberValue,
  newVectorValue,
  NumberValue,
  VectorValue,
} from "../value";
import { divide } from "./divide";

describe("divide()", () => {
  it.each([
    [6, 2, 3],
    [-6, 2, -3],
    [64, 8, 8],
  ])(
    "should be able to divide two numbers",
    (value1, value2, expectedResult) => {
      const result = divide(newNumberValue(value1), newNumberValue(value2));

      expect(result).toHaveProperty("type", "Number");
      expect((result as NumberValue).value.comparedTo(expectedResult)).toBe(0);
    },
  );

  it("should not allow division by zero", () => {
    expect(() => divide(newNumberValue(5), newNumberValue(0))).toThrow(
      RangeError,
    );
  });

  it("should be able to perform vector algebra", () => {
    const result = divide(
      newVectorValue([newNumberValue(6)]),
      newVectorValue([newNumberValue(2)]),
    );

    expect(result).toHaveProperty("type", "Vector");
    expect((result as VectorValue).elements).toHaveLength(1);
    expect(
      ((result as VectorValue).elements[0] as NumberValue).value.comparedTo(3),
    ).toBe(0);
  });

  it("should be able to perform vector algebra with numbers", () => {
    const result = divide(
      newVectorValue([newNumberValue(6)]),
      newNumberValue(2),
    );

    expect(result).toHaveProperty("type", "Vector");
    expect((result as VectorValue).elements).toHaveLength(1);
    expect(
      ((result as VectorValue).elements[0] as NumberValue).value.comparedTo(3),
    ).toBe(0);
  });

  it("should throw exception if trying to perform division with two non-matching values", () => {
    expect(() => divide(newNumberValue(5), newBooleanValue(false))).toThrow(
      TypeError,
    );
  });
});
