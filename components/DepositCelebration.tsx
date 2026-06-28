'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { DollarSign } from 'lucide-react';
import FlyReward from '@/components/FlyReward';
import flyStyles from '@/components/FlyReward.module.css';
import { runWhiteConfetti } from '@/lib/runWhiteConfetti';

const DEPOSIT_TOAST_MS = 2800;
const DEPOSIT_FLY_MS = 1600;
const DEPOSIT_XP_STAGGER_MS = 500;

type DepositCelebrationProps = {
  active: boolean;
  amount: number;
  xpEarned: number;
  balanceRef: React.RefObject<HTMLDivElement | null>;
  xpPillRef: React.RefObject<HTMLDivElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onComplete: () => void;
};

export default function DepositCelebration({
  active,
  amount,
  xpEarned,
  balanceRef,
  xpPillRef,
  containerRef,
  onComplete,
}: DepositCelebrationProps) {
  const [showToast, setShowToast] = useState(false);
  const [flyActive, setFlyActive] = useState(false);
  const [cashDone, setCashDone] = useState(false);
  const [xpDone, setXpDone] = useState(false);
  const confettiFired = useRef(false);

  useEffect(() => {
    if (!active) {
      setShowToast(false);
      setFlyActive(false);
      setCashDone(false);
      setXpDone(false);
      confettiFired.current = false;
      return;
    }

    if (!confettiFired.current && containerRef.current) {
      runWhiteConfetti(containerRef.current);
      confettiFired.current = true;
    }

    setShowToast(true);
    const flyTimer = window.setTimeout(() => {
      setShowToast(false);
      setFlyActive(true);
    }, DEPOSIT_TOAST_MS);

    return () => window.clearTimeout(flyTimer);
  }, [active, containerRef]);

  useEffect(() => {
    if (flyActive && cashDone && xpDone) {
      onComplete();
    }
  }, [cashDone, flyActive, onComplete, xpDone]);

  const handleCashComplete = useCallback(() => setCashDone(true), []);
  const handleXpComplete = useCallback(() => setXpDone(true), []);

  if (!active) return null;

  return (
    <>
      {showToast && (
        <div className="pointer-events-none absolute inset-0 z-[120] flex items-center justify-center overflow-hidden">
          <div className={`${flyStyles.depositRewardToast} flex flex-col items-center gap-2`}>
            <div className="flex items-center gap-3">
              <span
                className="text-white"
                style={{ textShadow: '0 0 24px rgba(250,247,239,0.45)' }}
              >
                <DollarSign size={44} strokeWidth={2} />
              </span>
              <span
                className="text-white"
                style={{ textShadow: '0 0 24px rgba(250,247,239,0.45)' }}
              >
                <span className="text-[52px] leading-none">✦</span>
              </span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[22px] font-semibold tracking-[0.5px] text-white">
                +${amount.toLocaleString('en-US')}
              </span>
              <span className="text-[16px] font-semibold tracking-[0.5px] text-white/80">
                +{xpEarned} XP
              </span>
            </div>
          </div>
        </div>
      )}

      <FlyReward
        active={flyActive}
        kind="cash"
        amount={amount}
        targetRef={balanceRef}
        containerRef={containerRef}
        flyTarget="element"
        showToast={false}
        flyDurationMs={DEPOSIT_FLY_MS}
        onComplete={handleCashComplete}
      />
      <FlyReward
        active={flyActive}
        kind="xp"
        amount={xpEarned}
        targetRef={xpPillRef}
        containerRef={containerRef}
        flyTarget="element"
        showToast={false}
        flyDurationMs={DEPOSIT_FLY_MS}
        startDelayMs={DEPOSIT_XP_STAGGER_MS}
        onComplete={handleXpComplete}
      />
    </>
  );
}
