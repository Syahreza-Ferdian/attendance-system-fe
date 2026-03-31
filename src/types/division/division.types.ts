import type { Position } from "../position/position.types";

export interface Division {
  id: string;
  name: string;
  description: string | null;
  positions: Position[];
}

export interface ICreateDivisionPayload {
  name: string;
  description?: string;
}

export type IUpdateDivisionPayload = Partial<ICreateDivisionPayload>;
