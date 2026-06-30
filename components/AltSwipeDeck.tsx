'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, Heart, RotateCw, X } from 'lucide-react';
import styles from '@/components/altDesign.module.css';

export type AltSwipeItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  handle?: string;
  caption?: string;
  socialProof?: string;
};

type SwipeChoice = 'skip' | 'want';

type AltSwipeDeckProps = {
  items: AltSwipeItem[];
  onSkip?: (item: AltSwipeItem) => void;
  onWant: (
    item: AltSwipeItem,
    event?: { clientX: number; clientY: number }
  ) => void;
  onDeckEmpty?: () => void;
  compact?: boolean;
  showHeader?: boolean;
  title?: string;
  onBack?: () => void;
};

const SWIPE_THRESHOLD = 92;
const EXIT_MS = 300;

function money(n: number) {
  return `$${n.toLocaleString('en-US')}`;
}

export default function AltSwipeDeck({
  items,
  onSkip,
  onWant,
  onDeckEmpty,
  compact = false,
  showHeader = false,
  title = 'Discover',
  onBack,
}: AltSwipeDeckProps) {
  const deckRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const [deck, setDeck] = useState(() => items.map((item) => item.id));
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [exitChoice, setExitChoice] = useState<SwipeChoice | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const itemById = useMemo(
    () => new Map(items.map((item) => [item.id, item])),
    [items]
  );

  const currentItem = deck[0] ? itemById.get(deck[0]) : undefined;
  const nextItem = deck[1] ? itemById.get(deck[1]) : undefined;

  const resetDrag = useCallback(() => {
    dragStart.current = null;
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  const resolveChoice = useCallback(
    (choice: SwipeChoice, event?: { clientX: number; clientY: number }) => {
      if (!currentItem || isAnimating) return;

      setIsAnimating(true);
      setExitChoice(choice);

      if (choice === 'want') {
        onWant(currentItem, event);
      } else {
        onSkip?.(currentItem);
      }

      window.setTimeout(() => {
        setDeck((ids) => {
          const next = ids.slice(1);
          if (next.length === 0) onDeckEmpty?.();
          return next;
        });
        setExitChoice(null);
        setIsAnimating(false);
        resetDrag();
      }, EXIT_MS);
    },
    [currentItem, isAnimating, onDeckEmpty, onSkip, onWant, resetDrag]
  );

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (isAnimating || !currentItem) return;
    dragStart.current = { x: event.clientX, y: event.clientY };
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !dragStart.current || isAnimating) return;
    setDragOffset({
      x: event.clientX - dragStart.current.x,
      y: (event.clientY - dragStart.current.y) * 0.35,
    });
  };

  const finishDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    if (dragOffset.x > SWIPE_THRESHOLD) {
      resolveChoice('want', { clientX: event.clientX, clientY: event.clientY });
      return;
    }

    if (dragOffset.x < -SWIPE_THRESHOLD) {
      resolveChoice('skip');
      return;
    }

    resetDrag();
  };

  const cardTransform = useMemo(() => {
    if (exitChoice === 'want') return 'translateX(130%) rotate(14deg)';
    if (exitChoice === 'skip') return 'translateX(-130%) rotate(-14deg)';
    if (!isDragging && dragOffset.x === 0 && dragOffset.y === 0) {
      return 'translateX(0) rotate(0deg)';
    }
    const rotate = dragOffset.x * 0.05;
    return `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotate}deg)`;
  }, [dragOffset.x, dragOffset.y, exitChoice, isDragging]);

  const skipOpacity = Math.min(1, Math.max(0, -dragOffset.x / 80));
  const wantOpacity = Math.min(1, Math.max(0, dragOffset.x / 80));

  const restartDeck = () => {
    setDeck(items.map((item) => item.id));
    resetDrag();
    setExitChoice(null);
    setIsAnimating(false);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        (event.target instanceof HTMLElement && event.target.isContentEditable)
      ) {
        return;
      }

      event.preventDefault();
      if (event.key === 'ArrowLeft') resolveChoice('skip');
      else resolveChoice('want');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [resolveChoice]);

  return (
    <div
      ref={deckRef}
      className={`flex min-h-0 flex-1 flex-col ${compact ? 'px-2' : 'px-5'} ${compact ? 'pb-2' : 'pb-6'}`}
    >
      {showHeader && (
        <div className="mb-3 flex items-center gap-2">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-none bg-[var(--alt-surface)]"
            >
              <ChevronLeft size={22} />
            </button>
          )}
          <span className="text-[18px] font-semibold">{title}</span>
        </div>
      )}

      <div className={`relative min-h-0 flex-1 ${compact ? 'min-h-[300px]' : ''}`}>
        {nextItem && (
          <div
            className={`${styles.card} absolute inset-0 overflow-hidden`}
            style={{ transform: 'scale(0.96) translateY(8px)', opacity: 0.5 }}
            aria-hidden="true"
          >
            <div className="relative h-full w-full bg-[var(--alt-image-bg)] p-6">
              <Image src={nextItem.image} alt="" fill className="object-contain p-4" />
            </div>
          </div>
        )}

        {currentItem ? (
          <div
            className="absolute inset-0 touch-none select-none"
            style={{
              transform: cardTransform,
              transition: isDragging ? 'none' : `transform ${EXIT_MS}ms ease`,
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={finishDrag}
            onPointerCancel={resetDrag}
          >
            <div className={`${styles.card} relative flex h-full flex-col overflow-hidden`}>
              <div
                className="pointer-events-none absolute left-4 top-4 z-10 rounded-xl border-2 px-3 py-1 text-[12px] font-bold uppercase tracking-[0.08em]"
                style={{
                  color: '#ff4d67',
                  borderColor: '#ff4d67',
                  opacity: exitChoice === 'skip' ? 1 : skipOpacity,
                  transform: 'rotate(-12deg)',
                }}
              >
                Nah
              </div>

              <div
                className="pointer-events-none absolute right-4 top-4 z-10 rounded-xl border-2 px-3 py-1 text-[12px] font-bold uppercase tracking-[0.08em]"
                style={{
                  color: '#a5b4fc',
                  borderColor: '#a5b4fc',
                  opacity: exitChoice === 'want' ? 1 : wantOpacity,
                  transform: 'rotate(12deg)',
                }}
              >
                Into it
              </div>

              <div className="relative min-h-0 flex-1 bg-[var(--alt-image-bg)]">
                <Image
                  src={currentItem.image}
                  alt={currentItem.name}
                  fill
                  className="object-contain p-6"
                  sizes="340px"
                  draggable={false}
                />
              </div>

              <div className="shrink-0 p-4">
                <h2 className="text-[22px] font-semibold leading-tight">{currentItem.name}</h2>
                <p className="mt-1 text-[18px] font-semibold text-[#5c62a8]">
                  {money(currentItem.price)}
                </p>
                {currentItem.socialProof && (
                  <p className="mt-1 text-[13px] text-[#8b90a0]">{currentItem.socialProof}</p>
                )}
                {currentItem.handle && (
                  <p className="mt-2 text-[13px] font-semibold">{currentItem.handle}</p>
                )}
                {currentItem.caption && (
                  <p className="mt-1 text-[13px] leading-[1.45] text-[#8b90a0]">
                    {currentItem.caption}
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className={`${styles.card} flex h-full flex-col items-center justify-center p-8 text-center`}>
            <p className="text-[22px] font-semibold">You&apos;re caught up</p>
            <p className="mt-2 text-[13px] text-[#8b90a0]">
              Swipe through more items or restart the deck.
            </p>
            <button
              type="button"
              onClick={restartDeck}
              className="mt-5 flex cursor-pointer items-center gap-2 rounded-full border-none px-5 py-3 text-[14px] font-semibold text-[#5c62a8]"
              style={{ background: 'var(--alt-blue-soft)', color: 'var(--alt-blue-text)' }}
            >
              <RotateCw size={16} />
              Show again
            </button>
          </div>
        )}
      </div>

      {currentItem && (
        <>
          <div className={`mt-4 flex items-center justify-center ${compact ? 'gap-6' : 'gap-8'}`}>
            <button
              type="button"
              aria-label="Skip item"
              onClick={() => resolveChoice('skip')}
              disabled={isAnimating}
              className={`flex cursor-pointer items-center justify-center rounded-full border-none disabled:opacity-50 ${
                compact ? 'h-16 w-16 text-[24px]' : 'h-[62px] w-[62px]'
              }`}
              style={{ background: '#ffe8ea', color: '#ff4d67' }}
            >
              <X size={compact ? 26 : 28} strokeWidth={2.5} />
            </button>

            <button
              type="button"
              aria-label="Add to wishlist"
              onClick={(event) =>
                resolveChoice('want', {
                  clientX: event.clientX,
                  clientY: event.clientY,
                })
              }
              disabled={isAnimating}
              className={`flex cursor-pointer items-center justify-center rounded-full border-none disabled:opacity-50 ${
                compact ? 'h-16 w-16' : 'h-[72px] w-[72px]'
              }`}
              style={{ background: '#e8ecff', color: '#a5b4fc' }}
            >
              <Heart size={compact ? 26 : 30} fill="currentColor" strokeWidth={2} />
            </button>
          </div>

          <p className="mt-3 text-center text-[11px] font-medium uppercase tracking-[0.12em] text-[#8b90a0]">
            Swipe or tap · Nah vs Into it
          </p>
        </>
      )}
    </div>
  );
}
