import { User } from "src/app/user/interfaces/user.interface";

export interface AuthResponse {
  token: string;
  message: string;
  errors: Errors;
  can: Can;
  id: number;
  user: User;
}

export interface Errors {
  email: string[];
}

export interface ValidToken {
  valid: boolean;
  message: string;
}

interface Can {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
  pivot: Pivot;
}

interface Pivot {
  user_id: number;
  role_id: number;
  created_at: Date;
  updated_at: Date;
}
