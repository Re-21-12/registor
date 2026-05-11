import {
  validarEmail,
  validarDecimal,
  validarFecha,
  validarLetras,
  validarNumeroReal,
  validarEntero,
  validarMoneda,
} from './on-input-validator';

function exceedsMaxLengthOnPaste(
  input: HTMLInputElement | HTMLTextAreaElement,
  pasted: string,
): boolean {
  const max = input.maxLength ?? -1;
  if (max <= 0) return false;
  const start = input.selectionStart ?? input.value.length;
  const end = input.selectionEnd ?? input.value.length;
  return input.value.length - (end - start) + pasted.length > max;
}

export function validarEmailPaste(event: ClipboardEvent): void {
  const input = event.target as HTMLInputElement;
  const data = event.clipboardData?.getData('text') || '';
  if (exceedsMaxLengthOnPaste(input, data) || !validarEmail(data)) event.preventDefault();
}

export function validarDecimalPaste(event: ClipboardEvent): void {
  const input = event.target as HTMLInputElement;
  const data = event.clipboardData?.getData('text') || '';
  if (exceedsMaxLengthOnPaste(input, data) || !validarDecimal(data)) event.preventDefault();
}

export function validarFechaPaste(event: ClipboardEvent): void {
  const input = event.target as HTMLInputElement;
  const data = event.clipboardData?.getData('text') || '';
  if (exceedsMaxLengthOnPaste(input, data) || !validarFecha(data)) event.preventDefault();
}

export function validarLetrasPaste(event: ClipboardEvent): void {
  const input = event.target as HTMLInputElement;
  const data = event.clipboardData?.getData('text') || '';
  if (exceedsMaxLengthOnPaste(input, data) || !validarLetras(data)) event.preventDefault();
}

export function validarNumeroRealPaste(event: ClipboardEvent): void {
  const input = event.target as HTMLInputElement;
  const data = event.clipboardData?.getData('text') || '';
  if (exceedsMaxLengthOnPaste(input, data) || !validarNumeroReal(data)) event.preventDefault();
}

export function validarEnteroPaste(event: ClipboardEvent): void {
  const input = event.target as HTMLInputElement;
  const data = event.clipboardData?.getData('text') || '';
  if (exceedsMaxLengthOnPaste(input, data) || !validarEntero(data)) event.preventDefault();
}

export function validarMonedaPaste(event: ClipboardEvent): void {
  const input = event.target as HTMLInputElement;
  const data = event.clipboardData?.getData('text') || '';
  if (exceedsMaxLengthOnPaste(input, data) || !validarMoneda(data)) event.preventDefault();
}
