import { describe, it } from 'node:test';
import assert from 'node:assert';
import { add, subtract, multiply, divide, evaluateExpression } from '../src/calculator.js';

describe('Calculator Core Operations', () => {
  it('should perform correct addition', () => {
    assert.strictEqual(add(15, 27), 42);
    assert.strictEqual(add(-5, 10), 5);
  });

  it('should perform correct subtraction', () => {
    assert.strictEqual(subtract(100, 37), 63);
  });

  it('should perform correct multiplication', () => {
    assert.strictEqual(multiply(7, 8), 56);
  });

  it('should perform correct division and guard zero division', () => {
    assert.strictEqual(divide(100, 4), 25);
    assert.throws(() => divide(10, 0), /Division by zero/);
  });

  it('should evaluate full binary expression correctly', () => {
    assert.strictEqual(evaluateExpression(12, '*', 4), 48);
    assert.strictEqual(evaluateExpression(50, '/', 2), 25);
  });
});
