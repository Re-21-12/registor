import { Directive, ElementRef, Renderer2, effect, inject, input } from '@angular/core';
import { GlucoseStatus } from '../types';

@Directive({ selector: '[appGlucoseColor]', standalone: true })
export class GlucoseColorDirective {
  status = input.required<GlucoseStatus>({ alias: 'appGlucoseColor' });

  private el       = inject(ElementRef);
  private renderer = inject(Renderer2);

  private readonly classMap: Record<GlucoseStatus, string> = {
    'low':      'glucose-low',
    'in-range': 'glucose-in-range',
    'high':     'glucose-high',
  };

  constructor() {
    effect(() => {
      Object.values(this.classMap).forEach((cls) =>
        this.renderer.removeClass(this.el.nativeElement, cls),
      );
      this.renderer.addClass(this.el.nativeElement, this.classMap[this.status()]);
    });
  }
}
