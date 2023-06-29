import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';

@Injectable( {
  providedIn: 'root'
} )
export class ValidatorService {

  constructor () { }

  checkboxRequired (): AsyncValidatorFn {
    return ( c: AbstractControl ): Observable<ValidationErrors | null> => {
      return of( c.value ? null : { 'required': true } );
    }
  }

  minIfFilled ( min: number ): ValidatorFn {
    return ( c: AbstractControl ): ValidationErrors | null => {
      return ( !c.value && c.value !== 0 )
        ? null
        : ( c && c.value < min )
          ? { min: 'Value must be greater than zero' }
          : null;
    }
  };
}
