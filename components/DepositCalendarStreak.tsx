'use client';

import { useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { depositCardStyle, DEPOSIT_INSET_BG } from '@/lib/depositWidgetStyles';
import styles from '@/app/home/home.module.css';

const WNTS_CARD_STYLE = depositCardStyle;

const CALENDAR_DOT_NO_DEPOSIT = '#354552';
const CALENDAR_DOT_DEPOSIT = '#8FA8BC';
const DAY_HEADERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;
const BASE_MONTH = new Date(2026, 5, 1);
const TODAY = new Date(2026, 5, 20);

type MonthDay = {
  key: string;
  day: number;
  inMonth: boolean;
  deposited: boolean;
  isToday: boolean;
};

const CURRENT_MONTH_DEPOSITS: Record<number, number> = {
  2: 20,
  5: 45,
  8: 30,
  12: 15,
  15: 25,
  18: 50,
  20: 15,
};

const getMonthDate = (monthOffset: number) => {
  const date = new Date(BASE_MONTH);
  date.setMonth(date.getMonth() + monthOffset);
  return date;
};

const formatMonthLabel = (date: Date) =>
  date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

const getDepositForDay = (
  monthOffset: number,
  year: number,
  month: number,
  day: number
) => {
  if (monthOffset === 0) {
    const amount = CURRENT_MONTH_DEPOSITS[day];
    return amount ? { deposited: true, amount } : { deposited: false, amount: 0 };
  }

  if (monthOffset > 0) {
    return { deposited: false, amount: 0 };
  }

  const seed = Math.abs(monthOffset * 31 + day * 7 + month);
  const deposited = seed % 3 !== 0;
  const amount = deposited ? [10, 15, 20, 25, 30][seed % 5] : 0;
  return { deposited, amount };
};

const buildMonthDays = (monthOffset: number): MonthDay[] => {
  const monthDate = getMonthDate(monthOffset);
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startPadding = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalCells = Math.ceil((startPadding + daysInMonth) / 7) * 7;

  return Array.from({ length: totalCells }, (_, index) => {
    const dayNum = index - startPadding + 1;
    const inMonth = dayNum >= 1 && dayNum <= daysInMonth;

    if (!inMonth) {
      return {
        key: `${year}-${month}-pad-${index}`,
        day: dayNum,
        inMonth: false,
        deposited: false,
        isToday: false,
      };
    }

    const cellDate = new Date(year, month, dayNum);
    const { deposited } = getDepositForDay(monthOffset, year, month, dayNum);

    return {
      key: cellDate.toISOString(),
      day: dayNum,
      inMonth: true,
      deposited,
      isToday: cellDate.toDateString() === TODAY.toDateString(),
    };
  });
};

export default function DepositCalendarStreak({ streak }: { streak: number }) {
  const [monthOffset, setMonthOffset] = useState(0);
  const [monthDirection, setMonthDirection] = useState<'left' | 'right' | null>(
    null
  );
  const touchStartX = useRef<number | null>(null);

  const monthDays = useMemo(() => buildMonthDays(monthOffset), [monthOffset]);
  const monthLabel = useMemo(
    () => formatMonthLabel(getMonthDate(monthOffset)),
    [monthOffset]
  );

  const changeMonth = (delta: number) => {
    setMonthDirection(delta > 0 ? 'left' : 'right');
    setMonthOffset((current) => current + delta);
  };

  const handleCalendarTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleCalendarTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current === null) return;

    const delta = event.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      changeMonth(delta < 0 ? 1 : -1);
    }

    touchStartX.current = null;
  };

  return (
    <div
      style={WNTS_CARD_STYLE}
      className="flex min-h-[200px] flex-row items-stretch"
    >
      <div
        className="flex min-h-0 min-w-0 flex-1 flex-col"
        onTouchStart={handleCalendarTouchStart}
        onTouchEnd={handleCalendarTouchEnd}
      >
        <div className="mb-2 flex shrink-0 items-center justify-between gap-1">
          <button
            type="button"
            onClick={() => changeMonth(-1)}
            className="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full border-none transition-opacity hover:opacity-80"
            style={{ background: DEPOSIT_INSET_BG }}
            aria-label="Previous month"
          >
            <ChevronLeft size={14} className="text-white" strokeWidth={2} />
          </button>
          <p
            className="min-w-0 flex-1 truncate text-center text-[11px] font-medium text-white"
            style={{ opacity: 0.55 }}
          >
            {monthLabel}
          </p>
          <button
            type="button"
            onClick={() => changeMonth(1)}
            className="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full border-none transition-opacity hover:opacity-80"
            style={{ background: DEPOSIT_INSET_BG }}
            aria-label="Next month"
          >
            <ChevronRight size={14} className="text-white" strokeWidth={2} />
          </button>
        </div>

        <div className="mb-1 grid grid-cols-7 gap-0.5">
          {DAY_HEADERS.map((label, index) => (
            <span
              key={`${label}-${index}`}
              className="text-center text-[8px] font-medium text-white"
              style={{ opacity: 0.35 }}
            >
              {label}
            </span>
          ))}
        </div>

        <div
          key={monthOffset}
          className={`grid flex-1 grid-cols-7 gap-x-0.5 gap-y-1 ${
            monthDirection === 'left'
              ? styles.calendarWeekLeft
              : monthDirection === 'right'
                ? styles.calendarWeekRight
                : ''
          }`}
        >
          {monthDays.map((item) => (
            <div
              key={item.key}
              className="flex flex-col items-center justify-center py-0.5"
              style={{ opacity: item.inMonth ? 1 : 0 }}
            >
              <span
                className="flex h-[22px] w-[22px] items-center justify-center rounded-full text-[10px] font-semibold leading-none text-white"
                style={{
                  opacity: item.inMonth ? (item.isToday ? 1 : 0.75) : 0,
                  background: item.isToday
                    ? 'rgba(143,168,188,0.28)'
                    : 'transparent',
                }}
              >
                {item.inMonth ? item.day : ''}
              </span>
              {item.inMonth && (
                <span
                  className="mt-0.5 h-[5px] w-[5px] shrink-0 rounded-full"
                  style={{
                    background: item.deposited
                      ? CALENDAR_DOT_DEPOSIT
                      : CALENDAR_DOT_NO_DEPOSIT,
                    opacity: item.deposited ? 1 : 0.6,
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div
        className="mx-3 w-px shrink-0 self-stretch"
        style={{ background: 'rgba(250,247,239,0.08)' }}
        aria-hidden="true"
      />

      <div className="flex w-[96px] shrink-0 flex-col items-center justify-center self-stretch py-2">
        <span
          className="text-[10px] font-semibold uppercase tracking-[1.4px] text-white"
          style={{ opacity: 0.5 }}
        >
          Streak
        </span>
        <span className="mt-1 text-[44px] font-bold leading-none text-white">
          {streak}
        </span>
        <span
          className="mt-1 text-[10px] font-medium text-white"
          style={{ opacity: 0.4 }}
        >
          days
        </span>
      </div>
    </div>
  );
}
