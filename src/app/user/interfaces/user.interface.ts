import { Role } from "src/app/role/interfaces/role.interface";
import { Position } from '../../position/interfaces/position.interface';

export interface User {
  id?: number;
  name: string;
  email: string;
  email_verified_at: null;
  position_id: number;
  leader: User | null;
  created_at: Date;
  updated_at: Date;
  subordinates?: User[];
  positions?: Position;
  roles: Role[];
  requirePassChange: boolean;
  valid_id: Boolean;
  birthdate: Date;
}
