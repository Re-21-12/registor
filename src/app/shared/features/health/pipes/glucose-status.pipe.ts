import { Pipe, PipeTransform } from '@angular/core';
import { GlucoseStatus } from '../types';

@Pipe({ name: 'glucoseStatus', standalone: true, pure: true })
export class GlucoseStatusPipe implements PipeTransform {
  transform(
    value: number,
    min: number = 70,
    max: number = 140,
  ): GlucoseStatus {
    if (value < min) return 'low';
    if (value > max) return 'high';
    return 'in-range';
  }
}
