import { ApiV1Response } from "../../shared/interfaces/ApiV1Response.interface";

export interface Positions extends ApiV1Response<Position[]>{
}

export interface Position {
  id: number;
  name: string;
  valid_id: boolean;
  created_at: Date;
  updated_at: Date;
}
