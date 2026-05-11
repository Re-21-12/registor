import { Component, input, computed } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IonNote } from '@ionic/angular/standalone';

@Component({
  selector: 'app-dynamic-hint',
  imports: [IonNote],
  templateUrl: './dynamic-hint.html',
  styleUrl: './dynamic-hint.scss',
})
export class DynamicHint {
  hint = input<string | null>(null);
  currentLength = input<number | null>(null);
  maxLength = input<number | null>(null);
  field = input<FormControl | null>(null);

  hasErrors = computed(() => {
    const control = this.field();
    return !!control && control.invalid && (control.dirty || control.touched);
  });
}
