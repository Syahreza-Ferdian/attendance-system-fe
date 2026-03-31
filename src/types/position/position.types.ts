import type { Division } from "../division/division.types";

export interface Position {
  id: string;
  name: string;
  description: string;
  divisionId: string;
  division?: Division;
}

export interface ICreatePositionPayload {
  name: string;
  divisionId: string;
  description?: string;
}

export type IUpdatePositionPayload = Partial<ICreatePositionPayload>;
