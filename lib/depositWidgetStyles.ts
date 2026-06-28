import type { CSSProperties } from 'react';

/** Dark glass cards — lighter than leaderboard (0.52) for deposit screens. */
export const depositCardStyle: CSSProperties = {
  background: 'rgba(22, 26, 32, 0.38)',
  backdropFilter: 'blur(18px)',
  WebkitBackdropFilter: 'blur(18px)',
  border: '1px solid rgba(250,247,239,0.13)',
  borderRadius: '16px',
  padding: '14px',
};

export const depositInnerGlassStyle: CSSProperties = {
  background: 'rgba(12, 15, 20, 0.28)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(250,247,239,0.1)',
};

export const depositPillStyle: CSSProperties = {
  background: 'rgba(22, 26, 32, 0.42)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(250,247,239,0.12)',
  borderRadius: '999px',
  padding: '4px 14px',
};

export const depositInsetStyle: CSSProperties = {
  background: 'rgba(8, 10, 14, 0.32)',
  border: '1px solid rgba(250,247,239,0.08)',
};

export const DEPOSIT_INSET_BG = 'rgba(8, 10, 14, 0.32)';
export const DEPOSIT_INSET_BORDER = 'rgba(250,247,239,0.08)';
