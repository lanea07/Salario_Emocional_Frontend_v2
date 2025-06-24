import { User } from "src/app/user/interfaces/user.interface";
import { ApiV1Response } from "../../shared/interfaces/ApiV1Response.interface";

export interface AuthResponse extends ApiV1Response<AuthData>{
}

export interface AuthData {
  token: string;
  expires_in: number;
  actions: number[];
  user: User;
  simulated: boolean;
}