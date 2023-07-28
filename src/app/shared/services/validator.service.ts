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

  camposIguales ( campo1: string, campo2: string ) {
    return ( formGroup: AbstractControl ): ValidationErrors | null => {
      const pass1 = formGroup.get( campo1 )?.value;
      const pass2 = formGroup.get( campo2 )?.value;

      if ( pass1 !== pass2 ) {
        formGroup.get( campo2 )?.setErrors( { noIguales: true } );
        return { noIguales: true }
      }

      formGroup.get( campo2 )?.setErrors( null );
      return null;
    }
  }
}
