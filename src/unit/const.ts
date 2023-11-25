import { secondsInDay, secondsInHour, secondsInMinute } from "date-fns";

import { Unit } from "./types";

// Supported length units.
export const millimeter: Readonly<Unit> = {
  type: "Length",
  symbol: "mm",
  multiplier: -1000,
};
export const centimeter: Readonly<Unit> = {
  type: "Length",
  symbol: "cm",
  multiplier: -100,
};
export const meter: Readonly<Unit> = {
  type: "Length",
  symbol: "m",
  multiplier: 1,
};
export const kilometer: Readonly<Unit> = {
  type: "Length",
  symbol: "km",
  multiplier: 1000,
};
export const allLengthUnits: Readonly<Readonly<Unit>[]> = [
  kilometer,
  meter,
  centimeter,
  millimeter,
];

// Supported mass units.
export const milligram: Readonly<Unit> = {
  type: "Mass",
  symbol: "mg",
  multiplier: -1000000,
};
export const gram: Readonly<Unit> = {
  type: "Mass",
  symbol: "g",
  multiplier: -1000,
};
export const kilogram: Readonly<Unit> = {
  type: "Mass",
  symbol: "kg",
  multiplier: 1,
};
export const allMassUnits: Readonly<Readonly<Unit>[]> = [
  kilogram,
  gram,
  milligram,
];

// Supported time units.
export const millisecond: Readonly<Unit> = {
  type: "Time",
  symbol: "ms",
  multiplier: -1000,
};
export const second: Readonly<Unit> = {
  type: "Time",
  symbol: "s",
  multiplier: 1,
};
export const minute: Readonly<Unit> = {
  type: "Time",
  symbol: "min",
  multiplier: secondsInMinute,
};
export const hour: Readonly<Unit> = {
  type: "Time",
  symbol: "h",
  multiplier: secondsInHour,
};
export const day: Readonly<Unit> = {
  type: "Time",
  symbol: "d",
  multiplier: secondsInDay,
};
export const allTimeUnits: Readonly<Readonly<Unit>[]> = [
  day,
  hour,
  minute,
  second,
  millisecond,
];
