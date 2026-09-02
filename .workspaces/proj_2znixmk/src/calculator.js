// Pure arithmetic calculation module for Node.js & unit testing
export function add(a, b) { return a + b; }
export function subtract(a, b) { return a - b; }
export function multiply(a, b) { return a * b; }
export function divide(a, b) {
  if (b === 0) throw new Error("Division by zero");
  return a / b;
}
export function evaluateExpression(a, op, b) {
  if (op === '+') return add(a, b);
  if (op === '-') return subtract(a, b);
  if (op === '*' || op === '×') return multiply(a, b);
  if (op === '/') return divide(a, b);
  throw new Error("Unsupported operator");
}
