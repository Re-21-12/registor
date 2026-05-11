// ==================== VALIDADORES SIMPLES ====================

export function validarEntero(valor: string): boolean {
  return /^\d+$/.test(valor);
}

export function validarDecimal(valor: string): boolean {
  return /^\d+(\.\d+)?$/.test(valor);
}

export function validarMoneda(valor: string): boolean {
  return /^\d+(\.\d{1,2})?$/.test(valor);
}

export function validarLetras(valor: string): boolean {
  return /^[A-Za-z\s]+$/.test(valor);
}

export function validarNumeroReal(valor: string): boolean {
  return /^-?\d+(\.\d+)?$/.test(valor);
}

export function validarEmail(valor: string): boolean {
  return /^[^@\s]+@[^@\s]+\.com$/.test(valor);
}

export function validarFecha(valor: string): boolean {
  return /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(\d{4})$/.test(valor);
}

// ==================== HELPERS ====================

function exceedsMaxLength(
  input: HTMLInputElement | HTMLTextAreaElement,
  nextChunk: string,
): boolean {
  const max = input.maxLength ?? -1;
  if (max <= 0) return false;
  const start = input.selectionStart ?? input.value.length;
  const end = input.selectionEnd ?? input.value.length;
  return input.value.length - (end - start) + nextChunk.length > max;
}

// ==================== HANDLERS KEYPRESS ====================

export function onKeypressEmail(event: KeyboardEvent): void {
  const input = event.target as HTMLInputElement;
  const key = event.key;
  if (!/^[A-Za-z0-9._\-@]$/.test(key)) { event.preventDefault(); return; }
  if (exceedsMaxLength(input, key)) { event.preventDefault(); return; }
  if (key === '@' && input.value.includes('@')) { event.preventDefault(); }
}

export function onKeypressEntero(event: KeyboardEvent): void {
  const input = event.target as HTMLInputElement;
  const key = event.key;
  if (!/^[0-9]$/.test(key)) { event.preventDefault(); return; }
  if (exceedsMaxLength(input, key)) event.preventDefault();
}

export function onKeypressDecimal(event: KeyboardEvent): void {
  const input = event.target as HTMLInputElement;
  const nuevoValor = input.value + event.key;
  if (!/^\d*\.?\d*$/.test(nuevoValor)) { event.preventDefault(); return; }
  if (exceedsMaxLength(input, event.key)) event.preventDefault();
}

export function onKeypressMoneda(event: KeyboardEvent): void {
  const input = event.target as HTMLInputElement;
  const key = event.key;
  const currentValue = input.value;
  if (!/^[0-9.]$/.test(key)) { event.preventDefault(); return; }
  if (key === '.' && currentValue.includes('.')) { event.preventDefault(); return; }
  if (currentValue.includes('.')) {
    const parts = currentValue.split('.');
    if (parts[1] && parts[1].length >= 2 && input.selectionStart! > currentValue.indexOf('.')) {
      event.preventDefault(); return;
    }
  }
  if (exceedsMaxLength(input, key)) event.preventDefault();
}

export function onKeypressLetras(event: KeyboardEvent): void {
  const input = event.target as HTMLInputElement;
  const nuevoValor = input.value + event.key;
  if (!/^[A-Za-z\s]*$/.test(nuevoValor)) { event.preventDefault(); return; }
  if (exceedsMaxLength(input, event.key)) event.preventDefault();
}
