export function isValidDateOnly(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function addMonthsToDateOnly(value, months) {
  if (!isValidDateOnly(value) || !Number.isInteger(months) || months < 1) {
    throw new Error('A valid purchase date and positive whole number of months are required.');
  }

  const [year, month, day] = value.split('-').map(Number);
  const targetMonthIndex = month - 1 + months;
  const targetYear = year + Math.floor(targetMonthIndex / 12);
  const targetMonth = targetMonthIndex % 12;
  const lastDay = new Date(Date.UTC(targetYear, targetMonth + 1, 0)).getUTCDate();
  const expiry = new Date(Date.UTC(targetYear, targetMonth, Math.min(day, lastDay)));

  return expiry.toISOString().slice(0, 10);
}
