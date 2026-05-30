import Link from 'next/link';
import { Match } from '@/types';
import { toSlug } from '@/lib/utils';
import MatchCard from './MatchCard';

interface Props {
  league: string;
  matches: Match[];
  showLeague?: boolean;
}

export default function LeagueSection({ league, matches, showLeague }: Props) {
  return (
    <section className="league-section" aria-label={`${league} matches`}>
      <div className="league-header-card">
        <div className="league-header-bar">
          <div className="league-header-left">
            <span style={{ fontSize: '1.1rem' }}>⚽</span>
            <span className="league-name-text">{league}</span>
            <span className="league-match-count-badge">
              {matches.length} match{matches.length !== 1 ? 'es' : ''}
            </span>
          </div>
          <Link
            href={`/league/${toSlug(league)}`}
            className="league-link-btn"
            aria-label={`View all ${league} matches`}
          >
            View all →
          </Link>
        </div>
        <div className="league-matches">
          {matches.map((m, i) => (
            <MatchCard key={i} match={m} showLeague={showLeague} />
          ))}
        </div>
      </div>
    </section>
  );
}
