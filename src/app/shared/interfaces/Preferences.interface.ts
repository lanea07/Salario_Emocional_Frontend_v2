export interface DefaultPreference {
    [ key: string ]: any[];
}

export interface Preference {
    name?: string;
    title?: string;
    description?: string;
    values: [];
}