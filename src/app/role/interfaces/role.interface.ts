import { ApiV1Response } from "../../shared/interfaces/ApiV1Response.interface";

export interface Roles extends ApiV1Response<Role[]>{
}

export interface Role {
  id: number;
  name: string;
  valid_id: boolean;
  created_at: Date;
  updated_at: Date;
}
