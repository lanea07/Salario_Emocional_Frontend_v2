import { ApiV1Response } from "../../shared/interfaces/ApiV1Response.interface";

export interface Positions<T> extends ApiV1Response<T>{
}

export interface Position {
  id: number;
  name: string;
  valid_id: boolean;
  created_at: Date;
  updated_at: Date;
}
