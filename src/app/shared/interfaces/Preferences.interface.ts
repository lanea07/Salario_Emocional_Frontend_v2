import { ApiV1Response } from "./ApiV1Response.interface";

export interface DefaultPreferences extends ApiV1Response<DefaultPreference[]>{
}

export interface DefaultPreference {
    [ key: string ]: any[];
}

export interface Preference {
    name?: string;
    title?: string;
    description?: string;
    values: [];
}