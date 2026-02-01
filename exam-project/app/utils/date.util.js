export function normalizeToDate(d) {
    if (d instanceof Date) return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
    const parsed = new Date(d);
    return Number.isNaN(parsed.getTime()) ? new Date(NaN) : parsed;
}

export function addDays(baseDate, days) {
    const r = new Date(baseDate.getTime());
    r.setUTCDate(r.getUTCDate() + days);
    return r;
}

export function toIsoDate(d) {
    return d.toISOString().slice(0, 10);
}