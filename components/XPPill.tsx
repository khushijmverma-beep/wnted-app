'use client';

import { forwardRef } from 'react';

const XPPill = forwardRef<HTMLDivElement, { amount: number }>(function XPPill(
  { amount },
  ref
) {
  return (
    <div
      ref={ref}
      className="text-[11px] font-medium tracking-[0.5px] text-white"
      style={{
        background: 'rgba(250,247,239,0.08)',
        border: '1px solid rgba(250,247,239,0.12)',
        borderRadius: '999px',
        padding: '4px 14px',
      }}
    >
      ✦ {amount.toLocaleString('en-US')} XP
    </div>
  );
});

export default XPPill;
