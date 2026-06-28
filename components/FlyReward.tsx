'use client';

import { useEffect, useState } from 'react';
import { DollarSign } from 'lucide-react';
import flyStyles from '@/components/FlyReward.module.css';

type FlyRewardProps = {
  active: boolean;
  amount: number;
  kind?: 'xp' | 'cash';
  targetRef: React.RefObject<HTMLDivElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  flyTarget?: 'pill' | 'topLeft' | 'element';
  showToast?: boolean;
  startDelayMs?: number;
  flyDurationMs?: number;
  toastDurationMs?: number;
  onComplete: () => void;
};

export default function FlyReward({
  active,
  amount,
  kind = 'xp',
  targetRef,
  containerRef,
  flyTarget = 'element',
  showToast = true,
  startDelayMs = 0,
  flyDurationMs = 700,
  toastDurationMs = 950,
  onComplete,
}: FlyRewardProps) {
  const [phase, setPhase] = useState<'toast' | 'fly' | 'idle'>('idle');
  const [flyStyle, setFlyStyle] = useState<React.CSSProperties>({
    opacity: 0,
  });
  const effectiveToastMs = showToast ? toastDurationMs : 0;

  useEffect(() => {
    if (!active) {
      setPhase('idle');
      return;
    }

    const timers: number[] = [];

    setPhase(showToast ? 'toast' : 'idle');
    setFlyStyle({ opacity: 0 });

    const beginFly = () => {
      const container = containerRef.current;

      if (!container) {
        onComplete();
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const startX = containerRect.width / 2;
      const startY = containerRect.height / 2;

      let endX: number;
      let endY: number;

      if (flyTarget === 'topLeft') {
        endX = -48;
        endY = -48;
      } else {
        const target = targetRef.current;

        if (!target) {
          onComplete();
          return;
        }

        const targetRect = target.getBoundingClientRect();
        endX = targetRect.left + targetRect.width / 2 - containerRect.left;
        endY = targetRect.top + targetRect.height / 2 - containerRect.top;
      }

      setFlyStyle({
        left: startX,
        top: startY,
        transform: 'translate(-50%, -50%) scale(1)',
        opacity: 1,
        transition: 'none',
      });
      setPhase('fly');

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setFlyStyle({
            left: endX,
            top: endY,
            transform: 'translate(-50%, -50%) scale(0.3)',
            opacity: 0.2,
            transition: `left ${flyDurationMs}ms ease-in-out, top ${flyDurationMs}ms ease-in-out, transform ${flyDurationMs}ms ease-in-out, opacity ${flyDurationMs}ms ease-in-out`,
          });
        });
      });

      timers.push(window.setTimeout(onComplete, flyDurationMs));
    };

    timers.push(
      window.setTimeout(() => {
        beginFly();
      }, startDelayMs + effectiveToastMs)
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [
    active,
    containerRef,
    effectiveToastMs,
    flyDurationMs,
    flyTarget,
    onComplete,
    showToast,
    startDelayMs,
    targetRef,
  ]);

  if (!active) return null;

  const flyIcon =
    kind === 'cash' ? (
      <DollarSign size={44} strokeWidth={2} />
    ) : (
      <span className="text-[52px] leading-none">✦</span>
    );

  return (
    <div className="pointer-events-none absolute inset-0 z-[120] overflow-hidden">
      {phase === 'toast' && showToast && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`${flyStyles.rewardToast} flex flex-col items-center gap-1`}>
            <span
              className="text-white"
              style={{
                textShadow: '0 0 24px rgba(250,247,239,0.45)',
              }}
            >
              {flyIcon}
            </span>
            <span className="text-[22px] font-semibold tracking-[0.5px] text-white">
              {kind === 'cash' ? `+$${amount}` : `+${amount} XP`}
            </span>
          </div>
        </div>
      )}

      {phase === 'fly' && (
        <span
          className="absolute flex items-center justify-center text-white"
          style={{
            ...flyStyle,
            textShadow: '0 0 24px rgba(250,247,239,0.45)',
          }}
        >
          {kind === 'cash' ? (
            <DollarSign size={44} strokeWidth={2} />
          ) : (
            <span className="text-[52px] leading-none">✦</span>
          )}
        </span>
      )}
    </div>
  );
}
