import { Permission } from "../../permission/interfaces/permission.interface";

export interface Role {
  id: number;
  name: string;
  valid_id: boolean;
  created_at: Date;
  updated_at: Date;
  permissions?: Permission[];
}
