// Pure arithmetic and scientific calculation module for Node.js & unit testing
export function add(a, b) { return Number(a) + Number(b); }
export function subtract(a, b) { return Number(a) - Number(b); }
export function multiply(a, b) { return Number(a) * Number(b); }
export function divide(a, b) {
  if (Number(b) === 0) throw new Error("Division by zero");
  return Number(a) / Number(b);
}
export function power(a, b) { return Math.pow(Number(a), Number(b)); }
export function sqrt(a) {
  const num = Number(a);
  if (num < 0) throw new Error("Negative square root");
  return Math.sqrt(num);
}
export const PI = Math.PI;

export function evaluateExpression(a, op, b) {
  if (op === '+') return add(a, b);
  if (op === '-') return subtract(a, b);
  if (op === '*' || op === '×') return multiply(a, b);
  if (op === '/') return divide(a, b);
  if (op === '^' || op === 'pow') return power(a, b);
  throw new Error("Unsupported operator");
}
