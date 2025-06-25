import { Permission } from "../../permission/interfaces/permission.interface";
import { ApiV1Response } from "../../shared/interfaces/ApiV1Response.interface";

export interface Roles<T> extends ApiV1Response<T>{
}

export interface Role {
  id: number;
  name: string;
  valid_id: boolean;
  created_at: Date;
  updated_at: Date;
  permissions?: Permission[];
}
