'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { Bell, ChevronLeft, ChevronRight } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import AppPageLayout from '@/components/AppPageLayout';
import WntedLogo from '@/components/WntedLogo';
import styles from './home.module.css';

const ACCENT_BLUE = '#8FA8BC';
const CALENDAR_DOT_NO_DEPOSIT = '#354552';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as const;
const CURRENT_WEEK_START = new Date(2026, 5, 16);
const TODAY = new Date(2026, 5, 20);

type WeekDay = {
  key: string;
  day: string;
  date: string;
  amount: string;
  deposited: boolean;
  isToday: boolean;
};

const CURRENT_WEEK_DEPOSITS = [
  { deposited: true, amount: 20 },
  { deposited: true, amount: 45 },
  { deposited: false, amount: 0 },
  { deposited: true, amount: 30 },
  { deposited: true, amount: 15 },
] as const;

const getWeekStart = (weekOffset: number) => {
  const start = new Date(CURRENT_WEEK_START);
  start.setDate(start.getDate() + weekOffset * 7);
  return start;
};

const formatWeekLabel = (weekStart: Date) =>
  `Week of ${weekStart.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })}`;

const getDepositForDay = (weekOffset: number, dayIndex: number) => {
  if (weekOffset === 0) {
    return CURRENT_WEEK_DEPOSITS[dayIndex];
  }

  if (weekOffset > 0) {
    return { deposited: false, amount: 0 };
  }

  const seed = Math.abs(weekOffset * 17 + dayIndex * 3);
  const deposited = seed % 4 !== 0;
  const amount = deposited ? [10, 15, 20, 25, 30, 45, 50][seed % 7] : 0;
  return { deposited, amount };
};

const buildWeekDays = (weekOffset: number): WeekDay[] => {
  const weekStart = getWeekStart(weekOffset);

  return DAY_LABELS.map((day, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    const { deposited, amount } = getDepositForDay(weekOffset, index);

    return {
      key: date.toISOString(),
      day,
      date: String(date.getDate()),
      amount: `$${amount}`,
      deposited,
      isToday: date.toDateString() === TODAY.toDateString(),
    };
  });
};

const userData = {
  name: 'Khushi',
  streak: 7,
  totalFunded: 2840,
  totalGoal: 8650,
  progressPercent: 32.8,
  wishlistItems: [
    {
      id: 1,
      name: 'Macbook Pro 14',
      category: 'Electronics',
      funded: 1374,
      goal: 2000,
      image: '/macBook.png',
    },
    {
      id: 2,
      name: 'Air Forces 1 Blue',
      category: 'Fashion',
      funded: 102,
      goal: 250,
      image: '/GreenSambas.png',
    },
    {
      id: 3,
      name: 'Bottega Veneta Bag',
      category: 'Fashion',
      funded: 720,
      goal: 5900,
      image: '/BotegaBag.png',
    },
    {
      id: 4,
      name: 'Dyson Airwrap',
      category: 'Beauty',
      funded: 480,
      goal: 500,
      image: '/dyson.png',
    },
  ],
};

const cardStyle: React.CSSProperties = {
  background: 'rgba(250,247,239,0.06)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(250,247,239,0.12)',
  borderRadius: '16px',
  padding: '14px',
};

const formatMoney = (amount: number) =>
  `$${amount.toLocaleString('en-US')}`;

const PROGRESS_RADIUS = 28;
const PROGRESS_CIRCUMFERENCE = 2 * Math.PI * PROGRESS_RADIUS;
const TARGET_PROGRESS_PERCENT = 33;
const PROGRESS_ANIMATION_MS = 1200;

export default function HomePage() {
  const router = useRouter();
  const pathname = usePathname();
  const [displayPercent, setDisplayPercent] = useState(0);
  const [weekOffset, setWeekOffset] = useState(0);
  const [weekDirection, setWeekDirection] = useState<'left' | 'right' | null>(
    null
  );
  const touchStartX = useRef<number | null>(null);

  const weekDays = useMemo(() => buildWeekDays(weekOffset), [weekOffset]);
  const weekLabel = useMemo(
    () => formatWeekLabel(getWeekStart(weekOffset)),
    [weekOffset]
  );

  const changeWeek = (delta: number) => {
    setWeekDirection(delta > 0 ? 'left' : 'right');
    setWeekOffset((current) => current + delta);
  };

  const handleCalendarTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleCalendarTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current === null) return;

    const delta = event.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      changeWeek(delta < 0 ? 1 : -1);
    }

    touchStartX.current = null;
  };

  useEffect(() => {
    setDisplayPercent(0);
    let start: number | null = null;
    let frameId = 0;

    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / PROGRESS_ANIMATION_MS, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayPercent(Math.round(eased * TARGET_PROGRESS_PERCENT));

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [pathname]);

  const progressFilled =
    PROGRESS_CIRCUMFERENCE * (displayPercent / 100);

  return (
    <AppPageLayout>
      <div
        className={`flex h-full flex-col gap-3 overflow-y-auto px-4 pt-[52px] pb-[90px] text-white font-clash ${styles.homeScroll}`}
      >
        <div className="mb-1 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center">
              <WntedLogo size={32} />
            </div>
            <h1 className="text-left text-[22px] font-normal leading-[1.3] tracking-[1.5px] text-[#FAF7EF]">
              Welcome Back,
              <br />
              {userData.name}
            </h1>
          </div>
          <button type="button" aria-label="Notifications" className="shrink-0 pr-1">
            <Bell size={22} className="text-white" strokeWidth={2} />
          </button>
        </div>

        {/* ROW 1 — Weekly Calendar + Streak */}
        <div className="flex items-stretch gap-3">
          {/* LEFT — Weekly Calendar */}
          <div
            style={{ ...cardStyle, width: '65%' }}
            className="flex min-h-0 flex-col"
            onTouchStart={handleCalendarTouchStart}
            onTouchEnd={handleCalendarTouchEnd}
          >
            <div className="mb-2 flex shrink-0 items-center justify-between gap-1">
              <button
                type="button"
                onClick={() => changeWeek(-1)}
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-opacity hover:opacity-80"
                style={{ background: 'rgba(250,247,239,0.08)' }}
                aria-label="Previous week"
              >
                <ChevronLeft size={12} className="text-white" strokeWidth={2} />
              </button>
              <p
                className="min-w-0 flex-1 truncate text-center text-[9px] text-white"
                style={{ opacity: 0.4 }}
              >
                {weekLabel}
              </p>
              <button
                type="button"
                onClick={() => changeWeek(1)}
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-opacity hover:opacity-80"
                style={{ background: 'rgba(250,247,239,0.08)' }}
                aria-label="Next week"
              >
                <ChevronRight size={12} className="text-white" strokeWidth={2} />
              </button>
            </div>
            <div
              key={weekOffset}
              className={`flex flex-1 justify-between gap-0.5 ${
                weekDirection === 'left'
                  ? styles.calendarWeekLeft
                  : weekDirection === 'right'
                    ? styles.calendarWeekRight
                    : ''
              }`}
            >
              {weekDays.map((item) => (
                <div
                  key={item.key}
                  className="flex min-w-0 flex-1 flex-col items-center justify-between py-1"
                >
                  <span
                    className="text-[9px] text-white"
                    style={{ opacity: 0.4 }}
                  >
                    {item.day}
                  </span>
                  <span
                    className="text-[11px] font-semibold leading-none text-white"
                    style={{ opacity: item.isToday ? 1 : 0.7 }}
                  >
                    {item.date}
                  </span>
                  <span
                    className="h-[10px] w-[10px] shrink-0 rounded-full"
                    style={{
                      background: item.deposited
                        ? ACCENT_BLUE
                        : CALENDAR_DOT_NO_DEPOSIT,
                    }}
                  />
                  <span
                    className="text-[9px] leading-none text-white"
                    style={{
                      opacity:
                        item.amount === '$0'
                          ? 0.35
                          : item.isToday
                            ? 1
                            : 0.55,
                    }}
                  >
                    {item.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Streak */}
          <div
            style={{ ...cardStyle, width: '33%' }}
            className={`flex flex-col items-center justify-center ${styles.streakGlow}`}
          >
            <span
              className="text-[10px] font-medium uppercase tracking-[1.5px] text-white"
              style={{ opacity: 0.55 }}
            >
              Streak
            </span>
            <span className="mt-1 text-[32px] font-bold leading-none text-white">
              {userData.streak}
            </span>
            <span
              className="mt-1 text-[9px] font-normal text-white"
              style={{ opacity: 0.35 }}
            >
              days
            </span>
            <div
              className="my-[10px] h-px w-full"
              style={{ background: 'rgba(250,247,239,0.1)' }}
            />
            <button
              type="button"
              onClick={() => router.push('/deposit')}
              className="w-full cursor-pointer rounded-[10px] border py-2 text-[11px] font-normal tracking-[0.5px] text-[#FAF7EF] transition-opacity hover:opacity-90"
              style={{
                background: 'rgba(250,247,239,0.08)',
                borderColor: 'rgba(250,247,239,0.18)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
              }}
            >
              Deposit
            </button>
          </div>
        </div>

        {/* ROW 2 — Total Funded */}
        <div
          style={{
            ...cardStyle,
            borderRadius: '20px',
            minHeight: '132px',
            padding: '18px 16px',
          }}
          className="flex items-start gap-4"
        >
          <div className="w-[56%] pt-0.5">
            <p
              className="mb-2 text-[10px] uppercase tracking-[1.5px] text-white"
              style={{ opacity: 0.4 }}
            >
              Total Funded
            </p>
            <p className="mb-3 text-[26px] font-normal leading-none text-white">
              {formatMoney(userData.totalFunded)}
            </p>
            <p
              className="max-w-[190px] text-[10px] leading-[1.65] text-white"
              style={{ opacity: 0.45 }}
            >
              You can add more money to your specific items to keep up the
              momentum!
            </p>
          </div>
          <div className="flex w-[44%] flex-col items-center justify-start pt-1">
            <div className="relative flex h-[68px] w-[68px] shrink-0 items-center justify-center overflow-visible">
              <div className={`${styles.fundedCircleCenter} z-0`} aria-hidden="true" />
              <svg
                width="68"
                height="68"
                viewBox="0 0 68 68"
                className="relative z-[1] overflow-visible"
              >
                <circle
                  cx="34"
                  cy="34"
                  r={PROGRESS_RADIUS}
                  stroke="rgba(250,247,239,0.12)"
                  strokeWidth="5"
                  fill="none"
                />
                <circle
                  cx="34"
                  cy="34"
                  r={PROGRESS_RADIUS}
                  stroke={ACCENT_BLUE}
                  strokeWidth="5"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${progressFilled} ${PROGRESS_CIRCUMFERENCE}`}
                  transform="rotate(-90 34 34)"
                />
              </svg>
              <div className="absolute z-[2] flex flex-col items-center pointer-events-none">
                <span className="text-[12px] font-medium text-white">
                  {displayPercent}%
                </span>
                <span
                  className="text-[7px] text-white"
                  style={{ opacity: 0.4 }}
                >
                  funded
                </span>
              </div>
            </div>
            <p
              className="mt-2.5 text-center text-[10px] leading-snug text-white"
              style={{ opacity: 0.35 }}
            >
              {formatMoney(userData.totalFunded)} of{' '}
              {formatMoney(userData.totalGoal)}
            </p>
          </div>
        </div>

        {/* ROW 3 — Wishlist Breakdown */}
        <div
          style={{ ...cardStyle, borderRadius: '12px' }}
          className={styles.wishlistGlow}
        >
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[13px] font-semibold text-white">My Wishlist</p>
            <button
              type="button"
              onClick={() => router.push('/discover')}
              className="cursor-pointer rounded-full border px-[14px] py-1 text-[10px] text-[#FAF7EF]"
              style={{
                background: 'rgba(250,247,239,0.05)',
                borderColor: 'rgba(250,247,239,0.18)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
              }}
            >
              + Add Item
            </button>
          </div>
          {userData.wishlistItems.map((item, index) => {
            const percent = Math.round((item.funded / item.goal) * 100);
            const isFullyFunded = item.funded >= item.goal;

            return (
              <div
                key={item.id}
                className="flex items-center justify-between py-2.5"
                style={{
                  borderBottom:
                    index === userData.wishlistItems.length - 1
                      ? 'none'
                      : '1px solid rgba(250,247,239,0.06)',
                }}
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <div
                    className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[8px]"
                    style={{
                      background: 'rgba(250,247,239,0.08)',
                      border: '1px solid rgba(250,247,239,0.1)',
                    }}
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] font-medium text-white">
                      {item.name}
                    </p>
                    <p
                      className="text-[10px] text-white"
                      style={{ opacity: 0.4 }}
                    >
                      {item.category}
                    </p>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p
                    className="text-[11px] font-medium"
                    style={{ color: ACCENT_BLUE }}
                  >
                    ({percent}%)
                  </p>
                  {isFullyFunded ? (
                    <span
                      className="mt-1 inline-block rounded-full px-2.5 py-[3px] text-[9px] font-medium"
                      style={{
                        background: 'rgba(143,168,188,0.15)',
                        color: ACCENT_BLUE,
                      }}
                    >
                      ✓ Fully Funded
                    </span>
                  ) : (
                    <>
                      <div
                        className="my-1 h-[3px] w-20 overflow-hidden rounded-sm"
                        style={{ background: 'rgba(250,247,239,0.1)' }}
                      >
                        <div
                          className="h-full rounded-sm"
                          style={{
                            width: `${percent}%`,
                            background: ACCENT_BLUE,
                          }}
                        />
                      </div>
                      <p
                        className="text-[9px] text-white"
                        style={{ opacity: 0.3 }}
                      >
                        {formatMoney(item.funded)} of {formatMoney(item.goal)}
                      </p>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppPageLayout>
  );
}
