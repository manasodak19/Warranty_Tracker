import assert from 'node:assert/strict';
import test from 'node:test';
import { addMonthsToDateOnly, getDaysRemaining, getWarrantyStatus } from './warranty.js';

const today = new Date(2026, 9, 29);

test('calculates month-end expiry dates without overflowing the month', () => {
  assert.equal(addMonthsToDateOnly('2024-01-31', 1), '2024-02-29');
  assert.equal(addMonthsToDateOnly('2023-01-31', 1), '2023-02-28');
  assert.equal(addMonthsToDateOnly('2026-10-29', 4), '2027-02-28');
});

test('treats the expiry date as the final valid day and applies status boundaries', () => {
  assert.equal(getDaysRemaining('2026-10-29', today), 0);
  assert.equal(getWarrantyStatus('2026-10-28', today), 'Expired');
  assert.equal(getWarrantyStatus('2026-10-29', today), 'Expiring Soon');
  assert.equal(getWarrantyStatus('2026-11-28', today), 'Expiring Soon');
  assert.equal(getWarrantyStatus('2026-11-29', today), 'Active');
});
