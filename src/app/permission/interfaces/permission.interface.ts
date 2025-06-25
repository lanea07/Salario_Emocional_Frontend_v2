import { ApiV1Response } from "../../shared/interfaces/ApiV1Response.interface";

export interface Permissions<T> extends ApiV1Response<T>{
}

export interface Permission {
  id: number;
  name: string;
  guard_name: string;
  created_at: Date;
  updated_at: Date;
}
