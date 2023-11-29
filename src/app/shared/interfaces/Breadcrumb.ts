import { Route } from "@angular/router"

export interface Breadcrumb {
    displayName: string
    url: string
    route: Route | null
}