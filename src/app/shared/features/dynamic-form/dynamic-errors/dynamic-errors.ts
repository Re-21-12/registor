import { Component, input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IonText } from '@ionic/angular/standalone';

@Component({
  selector: 'app-dynamic-errors',
  imports: [IonText],
  templateUrl: './dynamic-errors.html',
  styleUrl: './dynamic-errors.scss',
})
export class DynamicErrors {
  field = input<FormControl | null>(null);

  shouldShow(): boolean {
    const control = this.field();
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  getErrors(): Array<{ key: string; value: any; message: string }> {
    const control = this.field();
    if (!control?.errors) return [];
    return Object.entries(control.errors).map(([key, value]) => ({
      key,
      value,
      message: this.getErrorMessage(key, value),
    }));
  }

  getErrorMessage(errorKey: string, errorValue: any): string {
    const messages: Record<string, string> = {
      required: 'Este campo es obligatorio',
      email: 'Ingrese un email válido',
      minlength: `Debe tener al menos ${errorValue?.requiredLength} caracteres`,
      maxlength: `No debe superar ${errorValue?.requiredLength} caracteres`,
      min: `El valor mínimo es ${errorValue?.min}`,
      max: `El valor máximo es ${errorValue?.max}`,
      pattern: 'El formato no es válido',
      soloLetras: 'Solo se permiten letras',
      soloEnteros: 'Solo se permiten números enteros',
      soloDecimales: 'Solo se permiten números decimales',
      formatoMoneda: 'Formato de moneda inválido (ej: 1000.00)',
    };
    return messages[errorKey] ?? 'Error de validación';
  }
}
