import { Match } from '@/types';

export function pad(n: number): string {
  return String(n).padStart(2, '0');
}

export function toYMD(d: Date): string {
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
}

export function toISO(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function fmtKick(unix: number | null | undefined): string {
  if (!unix) return '—:—';
  return new Date(unix * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function fmtDate(d: Date): string {
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function dateFromYMD(ymd: string): Date {
  const y = parseInt(ymd.slice(0, 4), 10);
  const m = parseInt(ymd.slice(4, 6), 10) - 1;
  const d = parseInt(ymd.slice(6, 8), 10);
  return new Date(y, m, d);
}

export function todayYMD(): string {
  return toYMD(new Date());
}

export function prevDay(ymd: string): string {
  const d = dateFromYMD(ymd);
  d.setDate(d.getDate() - 1);
  return toYMD(d);
}

export function nextDay(ymd: string): string {
  const d = dateFromYMD(ymd);
  d.setDate(d.getDate() + 1);
  return toYMD(d);
}

export function isoFromYMD(ymd: string): string {
  return `${ymd.slice(0, 4)}-${ymd.slice(4, 6)}-${ymd.slice(6, 8)}`;
}

const POPULAR_KEYS = [
  'ESPN', 'BBC', 'Sky Sports', 'beIN', 'TNT', 'DAZN', 'Paramount',
  'Fox Soccer', 'CBS Sports', 'Sport TV', 'Canal+', 'Eurosport', 'ITV',
  'BT Sport', 'Setanta', 'RMC Sport', 'TUDN', 'Univision', 'SuperSport', 'Arena Sport',
];

export function isPopular(ch: string): boolean {
  const lower = ch.toLowerCase();
  return POPULAR_KEYS.some(k => lower.includes(k.toLowerCase()));
}

export function buildChannelMap(matches: Match[]): Map<string, { matches: Match[]; countries: Set<string> }> {
  const map = new Map<string, { matches: Match[]; countries: Set<string> }>();
  matches.forEach(m => {
    (m.tv_channels ?? []).forEach(tv => {
      (tv.channels ?? []).forEach(ch => {
        if (!map.has(ch)) map.set(ch, { matches: [], countries: new Set() });
        const entry = map.get(ch)!;
        entry.matches.push(m);
        entry.countries.add(tv.country ?? '');
      });
    });
  });
  return map;
}

export function groupByLeague(matches: Match[]): Record<string, Match[]> {
  const byLeague: Record<string, Match[]> = {};
  matches.forEach(m => {
    const k = m.league || 'Other';
    if (!byLeague[k]) byLeague[k] = [];
    byLeague[k].push(m);
  });
  return Object.fromEntries(
    Object.entries(byLeague).sort(([a], [b]) =>
      a === 'Other' ? 1 : b === 'Other' ? -1 : a.localeCompare(b)
    )
  );
}

export function toSlug(name: string): string {
  return encodeURIComponent(name.replace(/\s+/g, '-'));
}

export function fromSlug(slug: string): string {
  return decodeURIComponent(slug).replace(/-/g, ' ');
}

export function filterMatches(matches: Match[], q: string, country: string): Match[] {
  if (!q && !country) return matches;
  return matches.filter(m => {
    if (q) {
      const chs = (m.tv_channels ?? []).flatMap(tv => tv.channels ?? []).join(' ');
      const txt = `${m.fixture ?? ''} ${m.league ?? ''} ${m.venue ?? ''} ${chs}`.toLowerCase();
      if (!txt.includes(q.toLowerCase().trim())) return false;
    }
    if (country) {
      if (!(m.tv_channels ?? []).some(tv => tv.country === country)) return false;
    }
    return true;
  });
}
