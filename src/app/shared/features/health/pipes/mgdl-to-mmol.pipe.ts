import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'mgdlToMmol', standalone: true, pure: true })
export class MgdlToMmolPipe implements PipeTransform {
  transform(mgdl: number, decimals = 1): number {
    return parseFloat((mgdl / 18.0182).toFixed(decimals));
  }
}
