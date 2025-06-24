import { ApiV1Response } from "./ApiV1Response.interface";

export interface DataTablesResponse<T> extends ApiV1Response<YajraDataTable<T>>{
}

export interface YajraDataTable<T> {
    headers:   Headers;
    original:  Original<T>;
    exception: null;
}

export interface Headers {
}

export interface Original<T> {
    draw:            number;
    recordsTotal:    number;
    recordsFiltered: number;
    data:            T;
    disableOrdering: boolean;
}

