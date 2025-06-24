import { User } from "src/app/user/interfaces/user.interface";
import { ApiV1Response } from "../../shared/interfaces/ApiV1Response.interface";

export interface Dependencies extends ApiV1Response<Dependency[]>{
}

export interface Dependency {
    id: number;
    name: string;
    parent_id: number;
    valid_id: boolean;
    created_at: Date;
    updated_at: Date;
    depth: number;
    path: string;
    users: User[];
    children: Dependency[];
}