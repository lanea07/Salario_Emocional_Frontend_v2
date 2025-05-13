import { Component } from '@angular/core';

@Component({
    selector: 'app-container',
    templateUrl: './container.component.html',
    styles: [
        `
      .sidebar {
        z-index: 1;
      }
    `
    ],
    standalone: false
})
export class ContainerComponent {

}
