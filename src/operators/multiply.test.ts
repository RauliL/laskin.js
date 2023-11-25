import { TypeError } from "../exception";
import { units } from "../unit";
import {
  newNumberValue,
  newStringValue,
  newVectorValue,
  NumberValue,
  VectorValue,
} from "../value";
import { multiply } from "./multiply";

describe("multiply()", () => {
  it.each([
    [5, undefined, 2, undefined, 10, undefined],
    [5, units.meter, 2, units.kilometer, 10000, units.meter],
  ])(
    "should be able to multiply two numbers with each other",
    (value1, unit1, value2, unit2, expectedValue, expectedUnit) => {
      const result = multiply(
        newNumberValue(value1, unit1),
        newNumberValue(value2, unit2),
      );

      expect(result).toHaveProperty("type", "Number");
      expect(result).toHaveProperty("unit", expectedUnit);
      expect((result as NumberValue).value.comparedTo(expectedValue)).toBe(0);
    },
  );

  it("should be able to perform vector algebra", () => {
    const result = multiply(
      newVectorValue([newNumberValue(5)]),
      newVectorValue([newNumberValue(2)]),
    );

    expect(result).toHaveProperty("type", "Vector");
    expect((result as VectorValue).elements).toHaveLength(1);
    expect(
      ((result as VectorValue).elements[0] as NumberValue).value.comparedTo(10),
    ).toBe(0);
  });

  it("should be able to perform vector algebra with numbers", () => {
    const result = multiply(
      newVectorValue([newNumberValue(5)]),
      newNumberValue(2),
    );

    expect(result).toHaveProperty("type", "Vector");
    expect((result as VectorValue).elements).toHaveLength(1);
    expect(
      ((result as VectorValue).elements[0] as NumberValue).value.comparedTo(10),
    ).toBe(0);
  });

  it("should throw exception if trying to multiply two non-matching values together", () => {
    expect(() => multiply(newStringValue("foo"), newNumberValue(5))).toThrow(
      TypeError,
    );
  });
});
