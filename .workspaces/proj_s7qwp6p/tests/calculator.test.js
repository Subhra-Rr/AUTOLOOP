import { describe, it } from 'node:test';
import assert from 'node:assert';
import { add, subtract, multiply, divide, power, sqrt, PI, evaluateExpression } from '../src/calculator.js';

describe('Calculator Core & Scientific Operations', () => {
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

  it('should perform scientific exponentiation', () => {
    assert.strictEqual(power(2, 3), 8);
    assert.strictEqual(power(10, 2), 100);
  });

  it('should perform scientific square root and guard negative roots', () => {
    assert.strictEqual(sqrt(64), 8);
    assert.strictEqual(sqrt(0), 0);
    assert.throws(() => sqrt(-9), /Negative square root/);
  });

  it('should provide accurate Pi constant', () => {
    assert(Math.abs(PI - 3.1415926535) < 0.0001);
  });

  it('should evaluate full binary expression correctly including power', () => {
    assert.strictEqual(evaluateExpression(12, '*', 4), 48);
    assert.strictEqual(evaluateExpression(50, '/', 2), 25);
    assert.strictEqual(evaluateExpression(3, '^', 3), 27);
  });
});
