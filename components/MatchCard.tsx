'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Match } from '@/types';
import { fmtKick, toSlug } from '@/lib/utils';

interface Props {
  match: Match;
  showLeague?: boolean;
}

export default function MatchCard({ match, showLeague }: Props) {
  const [open, setOpen] = useState(false);
  const tvChs = match.tv_channels ?? [];
  const totalCh = tvChs.reduce((a, tv) => a + (tv.channels ?? []).length, 0);
  const kickoffISO = match.kickoff ? new Date(match.kickoff * 1000).toISOString() : '';

  return (
    <article
      className="match-card"
      itemScope
      itemType="https://schema.org/SportsEvent"
    >
      <div className="match-card-top" onClick={() => setOpen(o => !o)} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && setOpen(o => !o)}>
        <div
          className="match-time-badge"
          itemProp="startDate"
          content={kickoffISO}
        >
          {fmtKick(match.kickoff)}
        </div>

        <div className="match-info">
          <div className="match-fixture-name" itemProp="name">
            {match.fixture || 'TBA'}
          </div>
          <div className="match-meta">
            {showLeague && match.league && (
              <Link
                href={`/league/${toSlug(match.league)}`}
                className="match-league-tag-inline"
                itemProp="superEvent"
                onClick={e => e.stopPropagation()}
              >
                {match.league}
              </Link>
            )}
            {match.venue && (
              <span className="match-venue-text" itemProp="location">
                📍 {match.venue}
              </span>
            )}
          </div>
        </div>

        <div className={`match-tv-pill ${totalCh > 0 ? 'has-tv' : 'no-tv'}`}>
          {totalCh > 0 ? `📺 ${totalCh} ch` : 'No TV'}
        </div>

        <div className={`expand-chevron${open ? ' open' : ''}`}>▾</div>
      </div>

      {open && (
        <div className="channels-panel">
          {!tvChs.length ? (
            <p className="no-tv-note">No broadcast information available for this match.</p>
          ) : (
            [...tvChs]
              .sort((a, b) => (a.country ?? '').localeCompare(b.country ?? ''))
              .map((tv, ti) => (
                <div key={ti} className="country-row">
                  <div className="country-label-text">{tv.country || 'International'}</div>
                  <div className="channel-tags-wrap">
                    {(tv.channels ?? []).map((ch, i) => (
                      <Link
                        key={i}
                        href={`/channel/${toSlug(ch)}`}
                        className={`ch-tag ${i % 2 === 0 ? 'blue' : 'purple'}`}
                        title={`View all matches on ${ch}`}
                        aria-label={`View ${ch} schedule`}
                        onClick={e => e.stopPropagation()}
                      >
                        {ch}
                      </Link>
                    ))}
                  </div>
                </div>
              ))
          )}
        </div>
      )}
    </article>
  );
}
