'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Match } from '@/types';
import { buildChannelMap, groupByLeague, filterMatches, isPopular, toSlug, todayYMD, toYMD, dateFromYMD, fmtDate } from '@/lib/utils';
import LeagueSection from './LeagueSection';

const POPULAR_LEAGUES = [
  'Premier League', 'UEFA Champions League', 'La Liga', 'Serie A', 'Bundesliga',
  'Ligue 1', 'UEFA Europa League', 'FA Cup', 'Copa del Rey', 'Eredivisie',
  'Portuguese Primeira Liga', 'Scottish Premiership', 'MLS', 'Liga MX',
  'Brazilian Série A', 'Argentine Primera División', 'Turkish Süper Lig',
];

interface DayData { ymd: string; matches: Match[] }
interface Props { allDayMatches: DayData[] }

function shortLabel(ymd: string): string {
  return dateFromYMD(ymd).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function fullLabel(ymd: string): { primary: string; secondary: string } {
  const today = todayYMD();
  const d = new Date(); d.setDate(d.getDate() + 1);
  const tomorrow = toYMD(d);
  const full = fmtDate(dateFromYMD(ymd));
  if (ymd === today) return { primary: 'Today', secondary: full };
  if (ymd === tomorrow) return { primary: 'Tomorrow', secondary: full };
  return { primary: full, secondary: '' };
}

export default function HomeClient({ allDayMatches }: Props) {
  const [q, setQ] = useState('');
  const [country, setCountry] = useState('');

  const countries = useMemo(() => {
    const set = new Set<string>();
    allDayMatches.forEach(({ matches }) =>
      matches.forEach(m => (m.tv_channels ?? []).forEach(tv => tv.country && set.add(tv.country)))
    );
    return [...set].sort();
  }, [allDayMatches]);

  const filteredDays = useMemo(() =>
    allDayMatches
      .map(({ ymd, matches }) => ({ ymd, matches: filterMatches(matches, q, country) }))
      .filter(d => d.matches.length > 0),
    [allDayMatches, q, country]
  );

  const allChannels = useMemo(() => {
    const chMap = buildChannelMap(allDayMatches.flatMap(d => d.matches));
    return [...chMap.entries()].sort((a, b) => b[1].matches.length - a[1].matches.length);
  }, [allDayMatches]);

  const totalMatches = allDayMatches.reduce((s, d) => s + d.matches.length, 0);
  const totalLeagues = new Set(allDayMatches.flatMap(d => d.matches.map(m => m.league).filter(Boolean))).size;
  const totalChannels = new Set(
    allDayMatches.flatMap(d => d.matches.flatMap(m => (m.tv_channels ?? []).flatMap(tv => tv.channels ?? [])))
  ).size;

  const isFiltering = !!(q || country);

  return (
    <>
      {/* Hero */}
      <section className="hero" aria-label="Football TV guide">
        <h1 className="hero-title">⚽ Football Live TV Schedule</h1>
        <p className="hero-sub">7-day football TV guide — every match, kick-off time and channel.</p>
        <div className="stats-row" style={{ marginTop: 18, marginBottom: 0 }}>
          <div className="stat-card">
            <div className="stat-val">{totalMatches}</div>
            <div className="stat-label">Matches</div>
          </div>
          <div className="stat-card">
            <div className="stat-val">{totalLeagues}</div>
            <div className="stat-label">Leagues</div>
          </div>
          <div className="stat-card">
            <div className="stat-val">{totalChannels}</div>
            <div className="stat-label">Channels</div>
          </div>
        </div>
      </section>

      {/* Search + filter */}
      <div className="toolbar">
        <input
          className="search-input"
          type="search"
          placeholder="Search teams, leagues or channels…"
          aria-label="Search matches"
          value={q}
          onChange={e => setQ(e.target.value)}
        />
        <select
          className="country-select"
          aria-label="Filter by country"
          value={country}
          onChange={e => setCountry(e.target.value)}
        >
          <option value="">All Countries</option>
          {countries.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Day navigation tabs */}
      <div className="day-tabs-wrap" aria-label="Jump to day">
        <div className="day-tabs" role="tablist">
          {allDayMatches.map(({ ymd }) => (
            <a key={ymd} href={`#day-${ymd}`} className="day-tab" role="tab">
              {shortLabel(ymd)}
            </a>
          ))}
        </div>
      </div>

      {/* Today's channels (only when not filtering) */}
      {!isFiltering && allChannels.length > 0 && (
        <section className="channels-section" aria-label="All broadcasting channels">
          <h2 className="section-heading">
            <div className="accent-bar" />
            📺 All Channels
            <span className="count-badge">{allChannels.length}</span>
          </h2>
          <div className="channel-grid">
            {allChannels.slice(0, 24).map(([ch, info]) => {
              const pop = isPopular(ch);
              return (
                <Link
                  key={ch}
                  href={`/channel/${toSlug(ch)}`}
                  className={`channel-card${pop ? ' popular' : ''}`}
                  aria-label={`${ch} – ${info.matches.length} matches today`}
                >
                  <div className={`channel-icon ${pop ? 'popular-icon' : 'normal'}`} aria-hidden="true">📺</div>
                  <div className="channel-card-name">{ch}</div>
                  <div className="channel-match-count">{info.matches.length} match{info.matches.length !== 1 ? 'es' : ''}</div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* 7-day match schedule */}
      {filteredDays.length === 0 ? (
        <div className="state-center">
          <div className="state-icon">📅</div>
          <div className="state-title">No matches found</div>
          <div className="state-sub">Try different search terms or clear your filters.</div>
        </div>
      ) : (
        filteredDays.map(({ ymd, matches }) => {
          const grouped = groupByLeague(matches);
          const { primary, secondary } = fullLabel(ymd);
          return (
            <section key={ymd} id={`day-${ymd}`} className="day-section" aria-label={`Matches on ${primary}`}>
              <div className="day-section-header">
                <div>
                  <div className="day-section-label">{primary}</div>
                  {secondary && <div className="day-section-date">{secondary}</div>}
                </div>
                <span className="day-section-count">{matches.length} match{matches.length !== 1 ? 'es' : ''}</span>
              </div>
              {Object.entries(grouped).map(([league, lmatches]) => (
                <LeagueSection key={league} league={league} matches={lmatches} />
              ))}
            </section>
          );
        })
      )}

      {/* SEO */}
      <section className="seo-section">
        <h2><span className="y-bar" />About CricFoot Football TV Guide</h2>
        <p>
          <strong>CricFoot</strong> is your free 7-day football TV guide. Find match fixtures, kick-off times
          and TV channel listings for the <strong>Premier League</strong>, <strong>UEFA Champions League</strong>,{' '}
          <strong>La Liga</strong>, <strong>Serie A</strong>, <strong>Bundesliga</strong>, <strong>Ligue 1</strong>
          and hundreds more competitions worldwide.
        </p>
        <p>
          Whether you watch on <strong>Sky Sports</strong>, <strong>ESPN</strong>, <strong>beIN Sports</strong>,{' '}
          <strong>DAZN</strong>, <strong>TNT Sports</strong> or any other broadcaster, CricFoot shows you exactly
          which channel to tune into — filtered by your country. All kick-off times in your local timezone.
        </p>
        <h3>Popular Football Leagues</h3>
        <div className="tag-cloud">
          {POPULAR_LEAGUES.map(l => (
            <Link key={l} href={`/league/${toSlug(l)}`} className="tag-pill">{l}</Link>
          ))}
        </div>
      </section>
    </>
  );
}
