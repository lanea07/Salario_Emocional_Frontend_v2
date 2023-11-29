import { Component } from '@angular/core'
import { Breadcrumb } from '../interfaces/Breadcrumb'
import { BreadcrumbService } from '../services/breadcrumb.service'

@Component( {
  selector: 'breadcrumbs',
  templateUrl: './breadcrumb.component.html',
} )
export class BreadcrumbComponent {
  breadcrumbs?: Breadcrumb[]
  constructor ( private breadcrumbService: BreadcrumbService ) {
    this.breadcrumbService.breadcrumbChanged.subscribe( ( crumbs: Breadcrumb[] ) => {
      this.onBreadcrumbChange( crumbs )
    } )
  }

  private onBreadcrumbChange ( crumbs: Breadcrumb[] ) {
    this.breadcrumbs = crumbs
  }
}