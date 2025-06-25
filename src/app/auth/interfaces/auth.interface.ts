import { User } from "src/app/user/interfaces/user.interface";

export interface AuthData {
  token: string;
  expires_in: number;
  actions: number[];
  user: User;
  simulated: boolean;
}