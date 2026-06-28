'use client';

import { useMemo } from 'react';
import { User } from 'lucide-react';
import XPPill from '@/components/XPPill';
import {
  MOST_SAVED_LEADERBOARD,
  MOST_XP_LEADERBOARD,
  withCurrentUser,
} from '@/lib/leaderboardData';
import { depositPillStyle } from '@/lib/depositWidgetStyles';
import { CURRENT_USER_HANDLE } from '@/lib/userProfiles';
import styles from '@/app/home/home.module.css';

type RankTab = 'mostXP' | 'mostSaved';

const formatMoney = (amount: number) =>
  `$${amount.toLocaleString('en-US')}`;

const leaderboardCardStyle: React.CSSProperties = {
  background: 'rgba(22, 26, 32, 0.52)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(250,247,239,0.14)',
  borderRadius: '16px',
};

const formatScore = (tab: RankTab, score: number) =>
  tab === 'mostXP'
    ? score.toLocaleString('en-US')
    : `$${score.toLocaleString('en-US')}`;

type LeaderboardViewProps = {
  activeTab: RankTab;
  onTabChange: (tab: RankTab) => void;
  xp: number;
  totalSaved: number;
};

export default function LeaderboardView({
  activeTab,
  onTabChange,
  xp,
  totalSaved,
}: LeaderboardViewProps) {
  const entries = useMemo(() => {
    const base =
      activeTab === 'mostXP' ? MOST_XP_LEADERBOARD : MOST_SAVED_LEADERBOARD;
    const score = activeTab === 'mostXP' ? xp : totalSaved;
    return withCurrentUser(base, CURRENT_USER_HANDLE, score);
  }, [activeTab, xp, totalSaved]);

  const currentUserEntry = entries.find((entry) => entry.isCurrentUser);

  return (
    <div className="flex min-h-0 flex-1 flex-col px-4 pb-2 pt-[52px] font-clash text-white">
      <div className="mb-3 flex shrink-0 items-center justify-between gap-3">
        <XPPill amount={xp} />
        <div
          className="text-[11px] font-medium tracking-[0.5px] text-white"
          style={depositPillStyle}
        >
          {formatMoney(totalSaved)}
        </div>
      </div>

      <div className="mb-3 flex w-full shrink-0 items-center justify-center gap-6">
        {(
          [
            { id: 'mostXP' as const, label: 'Most XP' },
            { id: 'mostSaved' as const, label: 'Most Saved' },
          ] as const
        ).map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`relative min-h-[32px] cursor-pointer border-none bg-transparent px-1 text-[13px] leading-none text-white transition-opacity duration-200 ${styles.tabUnderlineCenter} ${isActive ? styles.tabUnderlineCenterActive : ''}`}
              style={{
                opacity: isActive ? 1 : 0.45,
                fontWeight: isActive ? 600 : 400,
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        style={leaderboardCardStyle}
        className="flex min-h-0 flex-1 flex-col overflow-hidden"
      >
        {currentUserEntry && (
          <div
            className="shrink-0 border-b px-4 py-3 text-center"
            style={{ borderColor: 'rgba(250,247,239,0.1)' }}
          >
            <p
              className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#FAF7EF]"
              style={{ opacity: 0.45 }}
            >
              Your rank
            </p>
            <p className="mt-0.5 text-[32px] font-semibold leading-none tabular-nums text-[#FAF7EF]">
              #{currentUserEntry.rank}
            </p>
          </div>
        )}

        <div
          className={`min-h-0 flex-1 overflow-y-auto px-3 py-2 ${styles.homeScroll}`}
        >
          {entries.map((entry) => (
            <div
              key={`${activeTab}-${entry.rank}`}
              className="flex items-center gap-3 px-1 py-3"
              style={
                entry.isCurrentUser
                  ? {
                      margin: '0 -4px',
                      padding: '12px 8px',
                      borderRadius: '12px',
                      background: 'rgba(143,168,188,0.14)',
                      border: '1px solid rgba(143,168,188,0.32)',
                      boxShadow: '0 0 12px rgba(143,168,188,0.12)',
                    }
                  : undefined
              }
            >
              <span
                className="w-6 shrink-0 text-center text-[13px] tabular-nums text-[#FAF7EF]"
                style={{ opacity: entry.isCurrentUser ? 1 : 0.55 }}
              >
                {entry.rank}
              </span>

              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                style={{
                  background: entry.isCurrentUser
                    ? 'rgba(143,168,188,0.22)'
                    : 'rgba(250,247,239,0.1)',
                  border: entry.isCurrentUser
                    ? '1px solid rgba(143,168,188,0.4)'
                    : '1px solid rgba(250,247,239,0.14)',
                }}
              >
                <User
                  size={16}
                  className="text-[#FAF7EF]"
                  style={{ opacity: entry.isCurrentUser ? 0.9 : 0.65 }}
                  strokeWidth={1.75}
                />
              </div>

              <span
                className={`min-w-0 flex-1 truncate text-[13px] text-[#FAF7EF] ${
                  entry.isCurrentUser ? 'font-semibold' : ''
                }`}
                style={{ opacity: entry.isCurrentUser ? 1 : 0.72 }}
              >
                {entry.handle}
              </span>

              <span
                className={`shrink-0 text-[14px] tabular-nums text-[#FAF7EF] ${
                  entry.isCurrentUser ? 'font-bold' : 'font-semibold'
                }`}
              >
                {formatScore(activeTab, entry.score)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
