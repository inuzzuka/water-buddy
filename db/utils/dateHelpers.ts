export function now(): string {
  return new Date().toISOString();
}

export function isoDate(d: Date = new Date()): string {
  return d.toISOString().split('T')[0];
}

export function yesterday(): string {
  return offsetDate(isoDate(), -1);
}

export function offsetDate(date: string, days: number): string {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return isoDate(d);
}
