import assert from 'node:assert/strict';
import test from 'node:test';
import { addMonthsToDateOnly, isValidDateOnly } from '../utils/warranty.js';

test('adds calendar months while clamping dates at the end of the month', () => {
  assert.equal(addMonthsToDateOnly('2024-01-31', 1), '2024-02-29');
  assert.equal(addMonthsToDateOnly('2023-01-31', 1), '2023-02-28');
  assert.equal(addMonthsToDateOnly('2024-11-30', 3), '2025-02-28');
});

test('validates date-only values as real calendar dates', () => {
  assert.equal(isValidDateOnly('2024-02-29'), true);
  assert.equal(isValidDateOnly('2023-02-29'), false);
  assert.equal(isValidDateOnly('2024-13-01'), false);
  assert.equal(isValidDateOnly('2024-2-01'), false);
});
