import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function soloLetrasValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;
    if (!value) return null;
    return /^[A-Za-z\s]+$/.test(value) ? null : { soloLetras: true };
  };
}

export function soloEnterosValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;
    if (!value) return null;
    return /^\d+$/.test(value) ? null : { soloEnteros: true };
  };
}

export function soloDecimalesValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;
    if (!value) return null;
    return /^\d+(\.\d+)?$/.test(value) ? null : { soloDecimales: true };
  };
}

export function formatoMonedaValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;
    if (!value) return null;
    return /^\d+(\.\d{1,2})?$/.test(value) ? null : { formatoMoneda: true };
  };
}
