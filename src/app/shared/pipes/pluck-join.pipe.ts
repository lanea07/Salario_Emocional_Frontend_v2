import { Pipe, PipeTransform } from '@angular/core';

@Pipe( {
    name: 'pluckJoin',
    standalone: false
} )
export class PluckJoinPipe implements PipeTransform {
  transform ( input: any, key: string ): unknown {
    return input.map( ( value: any ) => value[ key ] ).join( ' - ' );
  }
}
