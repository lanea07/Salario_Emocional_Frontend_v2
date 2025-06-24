import { ApiV1Response } from "./ApiV1Response.interface";

export interface DataTablesResponse<T> extends ApiV1Response<DataTable<T>>{
}

export interface DataTable<T> {
    draw:            number;
    recordsTotal:    number;
    recordsFiltered: number;
    data:            T;
    disableOrdering: boolean;
    queries:         Query[];
    input:           Input;
}

export interface Input {
    draw:    number;
    columns: Column[];
    order:   Order[];
    start:   number;
    length:  number;
    search:  Search;
    version: string;
    lang:    string;
}

export interface Column {
    data:       null | string;
    name:       null | string;
    searchable: boolean;
    orderable:  boolean;
    search:     Search;
}

export interface Search {
    value: null;
    regex: boolean;
    fixed: any[];
}

export interface Order {
    column: number;
    dir:    string;
    name:   null;
}

export interface Query {
    query:    string;
    bindings: Array<number | string>;
    time:     number;
}
