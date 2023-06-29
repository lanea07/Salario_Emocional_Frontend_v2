import { Component } from '@angular/core';
import { User } from '../../interfaces/user.interface';
import { UserService } from '../../services/user.service';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component( {
  selector: 'user-index',
  templateUrl: './index.component.html',
  styles: [
  ]
} )
export class IndexComponent {

  users: User[] = [];

  constructor (
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit (): void {
    // this.userService.index()
    //   .subscribe( users => {
    //     this.users = users
    //   } );
    this.userService.index()
      .subscribe(
        {
          next: ( users ) => this.users = users,
          error: ( error ) => {
            this.router.navigateByUrl( 'benefit-employee' );
            Swal.fire( {
              title: 'Error',
              icon: 'error',
              html: error.error.msg,
              timer: 3000,
              timerProgressBar: true,
              didOpen: ( toast ) => {
                toast.addEventListener( 'mouseenter', Swal.stopTimer )
                toast.addEventListener( 'mouseleave', Swal.resumeTimer )
              }
            } )
          }
        }
      )
  }

}
