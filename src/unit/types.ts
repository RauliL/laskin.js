export type UnitType = "Length" | "Mass" | "Time";

export type Unit = {
  type: UnitType;
  symbol: string;
  multiplier: number;
};
