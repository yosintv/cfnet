'use client';

import Link from 'next/link';
import { Match } from '@/types';
import { groupByLeague, toSlug, todayYMD, toYMD, dateFromYMD, fmtDate } from '@/lib/utils';
import LeagueSection from './LeagueSection';

interface DayData {
  ymd: string;
  matches: Match[];
}

interface Props {
  channelName: string;
  upcomingDays: DayData[];
}

function dayLabel(ymd: string): string {
  const today = todayYMD();
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const tomorrow = toYMD(d);
  if (ymd === today) return 'Today';
  if (ymd === tomorrow) return 'Tomorrow';
  return fmtDate(dateFromYMD(ymd));
}

const CHANNEL_KEYWORDS = (ch: string) => [
  `${ch} Live Stream Free`,
  `${ch} Free Live Streaming`,
  `Watch ${ch} Live Online`,
  `${ch} Live TV Free`,
  `${ch} Football Live Stream`,
  `Watch Football on ${ch}`,
  `${ch} Soccer Live TV`,
  `${ch} Sports Channel Live`,
  `${ch} HD Live Stream`,
  `${ch} Live Match Today`,
  `${ch} Football Today`,
  `${ch} TV Guide Today`,
  `${ch} Live Football Schedule`,
  `${ch} Match Fixtures Today`,
  `${ch} Live Sports TV`,
  `${ch} UEFA Champions League Live`,
  `${ch} Premier League Live`,
  `${ch} La Liga Live Stream`,
  `${ch} Serie A Live`,
  `${ch} Bundesliga Live TV`,
  `${ch} FIFA Match Live`,
  `${ch} World Cup Live Stream`,
  `${ch} TV Listings`,
  `${ch} Football Coverage`,
  `${ch} Sports Schedule`,
  `${ch} Live Soccer Match`,
  `${ch} Football Streaming Channel`,
  `${ch} Watch Live Football Free`,
  `${ch} Match Broadcast Today`,
  `${ch} Live Football on TV`,
  `${ch} Today Football Match`,
  `${ch} Sports TV Guide`,
  `${ch} Streaming Now`,
  `${ch} Online TV Channel`,
  `${ch} Live Event Streaming`,
  `${ch} Matchday Live`,
  `${ch} Free Sports Streaming`,
  `${ch} Football Highlights Today`,
  `${ch} Live Sports Coverage`,
  `${ch} Football Fixtures & Results`,
  `${ch} Live Commentary`,
  `${ch} International Football Live`,
  `${ch} 24/7 Sports Channel`,
  `${ch} Mobile Live Stream`,
  `${ch} Live TV App`,
  `${ch} Streaming Football Worldwide`,
  `${ch} Multi-language Football Stream`,
  `${ch} Football Channel Online`,
  `${ch} Soccer TV Listings`,
  `${ch} Match Schedule Today`,
];

export default function ChannelPageClient({ channelName, upcomingDays }: Props) {
  const totalMatches = upcomingDays.reduce((s, d) => s + d.matches.length, 0);

  return (
    <>
      {/* Channel hero */}
      <header className="channel-hero">
        <div className="channel-hero-icon" aria-hidden="true">📺</div>
        <div className="channel-hero-info">
          <h1 className="channel-hero-name">{channelName}</h1>
          <p className="channel-hero-meta">
            {totalMatches} match{totalMatches !== 1 ? 'es' : ''} scheduled · Next 7 days
          </p>
        </div>
        <Link href="/" className="btn-back">← Back</Link>
      </header>

      {/* Upcoming matches grouped by day */}
      {upcomingDays.length === 0 ? (
        <div className="state-center">
          <div className="state-icon">📅</div>
          <div className="state-title">No upcoming matches on {channelName}</div>
          <div className="state-sub">Check back soon — schedules update daily.</div>
        </div>
      ) : (
        upcomingDays.map(({ ymd, matches }) => {
          const grouped = groupByLeague(matches);
          const label = dayLabel(ymd);
          return (
            <section key={ymd} aria-label={`${channelName} matches on ${label}`}>
              <h2 className="section-heading" style={{ marginTop: 24 }}>
                <div className="accent-bar" />
                📅 {label}
                <span className="count-badge" style={{ marginLeft: 8 }}>
                  {matches.length} match{matches.length !== 1 ? 'es' : ''}
                </span>
              </h2>
              {Object.entries(grouped).map(([league, lmatches]) => (
                <LeagueSection key={league} league={league} matches={lmatches} showLeague />
              ))}
            </section>
          );
        })
      )}

      {/* SEO section */}
      <section className="seo-section">
        <h2><span className="y-bar" />About {channelName} Football Coverage</h2>
        <p>
          <strong>{channelName}</strong> is one of the football broadcasting channels tracked by CricFoot.
          Find every upcoming match scheduled on {channelName} — including kick-off times, league competitions
          and fixture information. All times are shown in your local timezone.
        </p>
        <p>
          CricFoot provides football TV schedules and channel guidance only.{' '}
          <strong>We do not host, stream, or broadcast any live TV channels or content.</strong>{' '}
          For actual live streaming, please use your authorised TV service or broadcaster.
        </p>

        <h3>Find {channelName} Live Football</h3>
        <div className="tag-cloud">
          {CHANNEL_KEYWORDS(channelName).map(kw => (
            <span key={kw} className="tag-pill">{kw}</span>
          ))}
        </div>
      </section>
    </>
  );
}
