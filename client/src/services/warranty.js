export function addMonthsToDateOnly(value, months) {
  if (!value || !Number.isInteger(Number(months)) || Number(months) < 1) {
    return '';
  }
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) {
    return '';
  }

  const totalMonth = month - 1 + Number(months);
  const targetYear = year + Math.floor(totalMonth / 12);
  const targetMonth = totalMonth % 12;
  const lastDay = new Date(Date.UTC(targetYear, targetMonth + 1, 0)).getUTCDate();
  return new Date(Date.UTC(targetYear, targetMonth, Math.min(day, lastDay))).toISOString().slice(0, 10);
}

export function getDaysRemaining(expiryDate, today = new Date()) {
  const [year, month, day] = expiryDate.split('-').map(Number);
  const expiry = Date.UTC(year, month - 1, day);
  const current = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.floor((expiry - current) / 86400000);
}

export function getWarrantyStatus(expiryDate, today) {
  const daysRemaining = getDaysRemaining(expiryDate, today);
  if (daysRemaining < 0) {
    return 'Expired';
  }
  return daysRemaining <= 30 ? 'Expiring Soon' : 'Active';
}

export function formatDate(value) {
  if (!value) {
    return '—';
  }
  const [year, month, day] = value.split('-').map(Number);
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, day)));
}
