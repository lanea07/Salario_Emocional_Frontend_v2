import { User } from "src/app/user/interfaces/user.interface";

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