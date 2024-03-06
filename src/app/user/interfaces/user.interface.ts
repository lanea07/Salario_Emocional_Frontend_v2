import { Dependency } from "../../dependency/interfaces/dependency.interface";
import { Position } from '../../position/interfaces/position.interface';
import { Role } from "../../role/interfaces/role.interface";

export interface User {
  id: number;
  name: string;
  email: string;
  requirePassChange: boolean;
  dependency_id: number;
  position_id: number;
  leader: number;
  valid_id: boolean;
  birthdate: null;
  email_verified_at: null;
  created_at: Date;
  updated_at: Date;
  depth: number;
  path: string;
  dependency: Dependency;
  parent: User;
  positions: Position;
  roles: Role[];
  children: User[];
  descendants: User[];
}
