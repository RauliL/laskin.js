import { describe, expect, it } from "vitest";

import { modulo } from "./modulo";
import { UnitError } from "../exception";
import {
  newNumberValue,
  newVectorValue,
  NumberValue,
  VectorValue,
} from "../value";
import { units } from "../unit";

describe("modulo()", () => {
  it("should be able to do modulo on two numbers", () => {
    const result = modulo(newNumberValue(-10), newNumberValue(3));

    expect(result).toHaveProperty("type", "Number");
    expect((result as NumberValue).value.comparedTo(-1)).toBe(0);
    expect((result as NumberValue).unit).toBeUndefined();
  });

  it("should not allow modulo of two numbers with mismatching units", () => {
    expect(() =>
      modulo(newNumberValue(1, units.milligram), newNumberValue(2, units.hour)),
    ).toThrow(UnitError);
  });

  it("should be able to perform vector algebra", () => {
    const result = modulo(
      newVectorValue([newNumberValue(-10), newNumberValue(2)]),
      newVectorValue([newNumberValue(3), newNumberValue(0)]),
    );

    expect(result).toHaveProperty("type", "Vector");
    expect((result as VectorValue).elements).toHaveLength(2);
    expect(
      ((result as VectorValue).elements[0] as NumberValue).value.comparedTo(-1),
    ).toBe(0);
    expect(
      ((result as VectorValue).elements[1] as NumberValue).value.isNaN(),
    ).toBe(true);
  });

  it("should be able to perform vector algebra with numbers", () => {
    const result = modulo(
      newVectorValue([newNumberValue(-10), newNumberValue(50)]),
      newNumberValue(3),
    );

    expect(result).toHaveProperty("type", "Vector");
    expect((result as VectorValue).elements).toHaveLength(2);
    expect(
      ((result as VectorValue).elements[0] as NumberValue).value.comparedTo(-1),
    ).toBe(0);
    expect(
      ((result as VectorValue).elements[1] as NumberValue).value.comparedTo(2),
    ).toBe(0);
  });
});
