// High-precision arithmetic calculation engine
export function add(a, b) { return Number(a) + Number(b); }
export function subtract(a, b) { return Number(a) - Number(b); }
export function multiply(a, b) { return Number(a) * Number(b); }
export function divide(a, b) {
  if (Number(b) === 0) throw new Error('Division by zero');
  return Number(a) / Number(b);
}
export function power(a, b) { return Math.pow(Number(a), Number(b)); }
export function factorial(n) {
  const num = Number(n);
  if (num < 0) return 0;
  if (num === 0 || num === 1) return 1;
  let res = 1;
  for (let i = 2; i <= num; i++) res *= i;
  return res;
}
export function calculate(expr) {
  const sanitized = String(expr).replace(/[^0-9+\-*\/().\s]/g, '');
  return Function('"use strict";return (' + sanitized + ')')();
}
