'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowDownLeft,
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  ChevronRight,
  Clock,
  CreditCard,
  DollarSign,
  FileText,
  Gift,
  HelpCircle,
  LogOut,
  Menu,
  Settings,
  Shield,
  Smartphone,
  Wallet,
  X,
} from 'lucide-react';
import AppPageLayout from '@/components/AppPageLayout';
import styles from './deposit.module.css';

const goals = [
  { id: 1, name: 'Macbook Pro 14', funded: 1374, goal: 2000 },
  { id: 2, name: 'Air Forces 1 Blue', funded: 102, goal: 250 },
  { id: 3, name: 'Bottega Veneta Bag', funded: 720, goal: 5900 },
  { id: 4, name: 'Dyson Airwrap', funded: 480, goal: 500 },
];

const quickAmounts = [15, 25, 50, 100];

const paymentMethods = [
  {
    id: 'applepay',
    name: 'Apple Pay',
    sub: 'Fastest',
    badge: true,
    icon: 'apple',
  },
  {
    id: 'bank',
    name: 'Frost Personal',
    sub: 'Acct ending in 1216',
    badge: false,
    icon: 'bank',
  },
  {
    id: 'debit',
    name: 'Debit Card',
    sub: 'Visa or Mastercard',
    badge: false,
    icon: 'card',
  },
  {
    id: 'venmo',
    name: 'Venmo',
    sub: '@khushi',
    badge: false,
    icon: 'venmo',
  },
  {
    id: 'cashapp',
    name: 'Cash App',
    sub: '$khushiverma',
    badge: false,
    icon: 'cashapp',
  },
];

const drawerItems = [
  {
    section: 'Account',
    items: [
      { label: 'Request Withdrawal', icon: 'ArrowDownLeft' },
      { label: 'Savings History', icon: 'Clock' },
      { label: 'Linked Bank Accounts', icon: 'Building2' },
      { label: 'Referral Program', icon: 'Gift', badge: 'Earn $10' },
    ],
  },
  {
    section: 'Support',
    items: [
      { label: 'Help Center', icon: 'HelpCircle' },
      { label: 'Settings', icon: 'Settings' },
    ],
  },
  {
    section: 'Legal',
    items: [
      { label: 'Terms of Service', icon: 'FileText' },
      { label: 'Privacy Policy', icon: 'Shield' },
    ],
  },
];

const cardStyle: React.CSSProperties = {
  background: 'rgba(250,247,239,0.06)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(250,247,239,0.12)',
  borderRadius: '16px',
  padding: '14px',
};

const innerGlassStyle: React.CSSProperties = {
  background: 'rgba(250,247,239,0.08)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(250,247,239,0.12)',
};

const ACCENT_BLUE = '#8FA8BC';
const ACCENT_BLUE_SOFT = 'rgba(143,168,188,0.12)';
const ACCENT_BLUE_BORDER = 'rgba(143,168,188,0.35)';

const formatMoney = (amount: number) =>
  `$${amount.toLocaleString('en-US')}`;

const drawerIconMap = {
  ArrowDownLeft,
  Clock,
  Building2,
  Gift,
  HelpCircle,
  Settings,
  FileText,
  Shield,
} as const;

const paymentIconMap = {
  apple: Smartphone,
  bank: Building2,
  card: CreditCard,
  venmo: Wallet,
  cashapp: DollarSign,
} as const;

export default function DepositPage() {
  const router = useRouter();
  const goalDropdownRef = useRef<HTMLDivElement>(null);

  const [selectedGoal, setSelectedGoal] = useState(goals[0]);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(15);
  const [customAmount, setCustomAmount] = useState('15');
  const [selectedMethod, setSelectedMethod] = useState('applepay');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isGoalDropdownOpen, setIsGoalDropdownOpen] = useState(false);

  const amountValue = Number(customAmount) || 0;
  const hasAmount = amountValue > 0;
  const currentPercent = Math.round(
    (selectedGoal.funded / selectedGoal.goal) * 100
  );
  const afterPercent = hasAmount
    ? Math.round(((selectedGoal.funded + amountValue) / selectedGoal.goal) * 100)
    : currentPercent;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        goalDropdownRef.current &&
        !goalDropdownRef.current.contains(event.target as Node)
      ) {
        setIsGoalDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleQuickAmount = (amount: number) => {
    setCustomAmount(String(amount));
    setSelectedAmount(amount);
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    const parsed = Number(value);
    setSelectedAmount(parsed > 0 ? parsed : null);
  };

  const adjustAmount = (delta: number) => {
    const current = Number(customAmount) || 0;
    const next = Math.max(0, current + delta);
    handleCustomAmountChange(String(next));
  };

  return (
    <AppPageLayout>
      <div className="relative h-full overflow-hidden">
        <div
          className={`flex h-full flex-col gap-3 overflow-x-hidden overflow-y-auto px-4 pt-[52px] pb-[90px] font-clash text-white ${styles.depositScroll}`}
        >
          {/* HEADER ROW */}
          <div className="mb-1 flex items-center justify-between">
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => router.push('/home')}
                className="cursor-pointer"
                aria-label="Back to home"
              >
                <ChevronLeft
                  size={20}
                  className="text-white"
                  style={{ opacity: 0.7 }}
                  strokeWidth={2}
                />
              </button>
              <h1 className="ml-2 text-[20px] font-normal text-white">Deposit</h1>
            </div>
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="cursor-pointer"
              style={{
                ...innerGlassStyle,
                borderRadius: '10px',
                padding: '8px',
              }}
              aria-label="Open menu"
            >
              <Menu size={20} className="text-white" style={{ opacity: 0.7 }} />
            </button>
          </div>

          {/* SECTION 1 — SELECT GOAL */}
          <div style={cardStyle} className={styles.cardGlow} ref={goalDropdownRef}>
            <p
              className="mb-2 text-[10px] uppercase text-white"
              style={{ opacity: 0.4, letterSpacing: '1.5px' }}
            >
              Depositing toward
            </p>

            <button
              type="button"
              onClick={() => setIsGoalDropdownOpen((open) => !open)}
              className="flex w-full cursor-pointer items-center justify-between"
              style={{
                ...innerGlassStyle,
                borderRadius: '12px',
                padding: '12px 14px',
              }}
            >
              <div className="flex min-w-0 items-center">
                <span
                  className="mr-2.5 h-[7px] w-[7px] shrink-0 rounded-full"
                  style={{ background: ACCENT_BLUE }}
                />
                <span className="truncate text-[13px] font-semibold text-white">
                  {selectedGoal.name}
                </span>
                <span
                  className="ml-1.5 shrink-0 text-[10px] text-white"
                  style={{ opacity: 0.4 }}
                >
                  ({formatMoney(selectedGoal.funded)} of{' '}
                  {formatMoney(selectedGoal.goal)})
                </span>
              </div>
              <ChevronDown
                size={14}
                className="shrink-0 text-white"
                style={{
                  opacity: 0.5,
                  transform: isGoalDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                }}
              />
            </button>

            {isGoalDropdownOpen && (
              <div
                className="mt-1.5 overflow-hidden"
                style={{
                  ...innerGlassStyle,
                  background: 'rgba(250,247,239,0.1)',
                  borderRadius: '12px',
                }}
              >
                {goals.map((goal, index) => {
                  const percent = Math.round((goal.funded / goal.goal) * 100);
                  const isActive = selectedGoal.id === goal.id;

                  return (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => {
                        setSelectedGoal(goal);
                        setIsGoalDropdownOpen(false);
                      }}
                      className="flex w-full cursor-pointer items-center justify-between px-3.5 py-[11px] text-left"
                      style={{
                        background: isActive
                          ? ACCENT_BLUE_SOFT
                          : 'transparent',
                        borderBottom:
                          index === goals.length - 1
                            ? 'none'
                            : '1px solid rgba(250,247,239,0.08)',
                      }}
                    >
                      <span className="text-[12px] font-medium text-white">
                        {goal.name}
                      </span>
                      <span className="text-[10px]" style={{ color: ACCENT_BLUE }}>
                        {percent}%
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="mt-2.5">
              <div className="flex items-center justify-between">
                <span
                  className="text-[9px] text-white"
                  style={{ opacity: 0.35 }}
                >
                  Current progress
                </span>
                <span className="text-[9px] font-medium" style={{ color: ACCENT_BLUE }}>
                  {currentPercent}%
                </span>
              </div>
              <div
                className="mt-1 h-1 overflow-hidden rounded-sm"
                style={{ background: 'rgba(250,247,239,0.1)' }}
              >
                <div
                  className="h-full rounded-sm"
                  style={{
                    width: `${Math.min(currentPercent, 100)}%`,
                    background: ACCENT_BLUE,
                  }}
                />
              </div>
            </div>
          </div>

          {/* SECTION 2 — ENTER AMOUNT */}
          <div style={cardStyle} className={styles.cardGlow}>
            <p
              className="mb-3 text-[10px] uppercase text-white"
              style={{ opacity: 0.4, letterSpacing: '1.5px' }}
            >
              Amount
            </p>

            <div className={styles.amountInputWrap}>
              <span
                className="text-[28px] font-light text-white"
                style={{ opacity: 0.4 }}
              >
                $
              </span>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                placeholder="0"
                className={`${styles.amountInput} w-[120px] border-none bg-transparent text-center text-[48px] font-normal text-white outline-none placeholder:text-white/15 font-clash`}
              />
              <div className={styles.amountStepper}>
                <button
                  type="button"
                  onClick={() => adjustAmount(1)}
                  className={styles.amountStepBtn}
                  aria-label="Increase amount"
                >
                  <ChevronUp size={14} className="text-white" strokeWidth={2} />
                </button>
                <button
                  type="button"
                  onClick={() => adjustAmount(-1)}
                  className={styles.amountStepBtn}
                  aria-label="Decrease amount"
                >
                  <ChevronDown size={14} className="text-white" strokeWidth={2} />
                </button>
              </div>
            </div>

            <div className="mt-4 flex justify-center gap-2">
              {quickAmounts.map((amount) => {
                const isActive =
                  selectedAmount === amount ||
                  customAmount === String(amount);

                return (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => handleQuickAmount(amount)}
                    className="cursor-pointer rounded-full border px-[18px] py-[7px] text-[12px] font-semibold transition-all duration-200"
                    style={{
                      background: isActive
                        ? 'rgba(143,168,188,0.18)'
                        : 'rgba(250,247,239,0.06)',
                      color: isActive ? '#0D1117' : '#FAF7EF',
                      borderColor: isActive
                        ? 'rgba(250,247,239,0.24)'
                        : 'rgba(250,247,239,0.12)',
                    }}
                  >
                    ${amount}
                  </button>
                );
              })}
            </div>

            {hasAmount && (
              <div
                className="mt-3.5 rounded-[10px] border px-3.5 py-2.5 text-center text-[12px] text-white"
                style={{
                  background: ACCENT_BLUE_SOFT,
                  borderColor: 'rgba(143,168,188,0.2)',
                  opacity: 0.8,
                }}
              >
                After this deposit you&apos;ll be{' '}
                <span className="font-bold" style={{ color: ACCENT_BLUE }}>
                  {afterPercent}%
                </span>{' '}
                funded
              </div>
            )}
          </div>

          {/* SECTION 3 — PAYMENT METHOD */}
          <div style={cardStyle} className={styles.cardGlow}>
            <p
              className="mb-3 text-[10px] uppercase text-white"
              style={{ opacity: 0.4, letterSpacing: '1.5px' }}
            >
              Pay with
            </p>

            <p
              className="mb-2 text-[9px] uppercase text-white"
              style={{ opacity: 0.3, letterSpacing: '1px' }}
            >
              Saved methods
            </p>

            <div className="grid grid-cols-2 gap-2">
              {paymentMethods.map((method) => {
                const isActive = selectedMethod === method.id;
                const Icon =
                  paymentIconMap[method.icon as keyof typeof paymentIconMap];

                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelectedMethod(method.id)}
                    className="relative cursor-pointer rounded-xl border p-3.5 text-left transition-all duration-200"
                    style={{
                      ...(isActive
                        ? {
                            background: ACCENT_BLUE_SOFT,
                            borderColor: ACCENT_BLUE_BORDER,
                          }
                        : innerGlassStyle),
                      borderRadius: '12px',
                    }}
                  >
                    {method.badge && (
                      <span
                        className="absolute -top-2 left-3 rounded-full px-2 py-0.5 text-[8px] font-bold tracking-[0.5px] text-white"
                        style={{ background: ACCENT_BLUE }}
                      >
                        FASTEST
                      </span>
                    )}
                    <div className="flex flex-col items-center">
                      <div
                        className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg"
                        style={{ background: 'rgba(250,247,239,0.08)' }}
                      >
                        <Icon
                          size={20}
                          className="text-white"
                          style={{ opacity: 0.7 }}
                        />
                      </div>
                      <p className="text-center text-[11px] font-semibold text-white">
                        {method.name}
                      </p>
                      <p
                        className="mt-0.5 text-center text-[9px] text-white"
                        style={{ opacity: 0.35 }}
                      >
                        {method.sub}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 4 — CONFIRM BUTTON */}
          <button
            type="button"
            className={`w-full cursor-pointer rounded-[14px] border py-4 text-[15px] font-normal tracking-[0.5px] text-[#FAF7EF] transition-all duration-200 hover:opacity-90 active:scale-[0.98] ${styles.cardGlow}`}
            style={{
              ...cardStyle,
              borderRadius: '14px',
              padding: '16px 14px',
              opacity: hasAmount ? 1 : 0.5,
            }}
          >
            {hasAmount
              ? `Deposit $${amountValue.toLocaleString('en-US')}`
              : 'Enter an Amount'}
          </button>

          <p
            className="text-center text-[10px] text-white"
            style={{ opacity: 0.3 }}
          >
            No fees. Funds applied instantly to your goal.
          </p>
        </div>

        {/* HAMBURGER SIDE DRAWER */}
        {isDrawerOpen && (
          <div
            className="absolute inset-0 z-40"
            style={{
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
            }}
            onClick={() => setIsDrawerOpen(false)}
            aria-hidden="true"
          />
        )}

        <div
          className={`absolute top-0 right-0 bottom-0 z-50 flex w-[280px] flex-col overflow-y-auto ${styles.drawerPanel} ${isDrawerOpen ? styles.drawerPanelOpen : ''}`}
          style={{
            background: 'rgba(250,247,239,0.08)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderLeft: '1px solid rgba(250,247,239,0.12)',
            paddingTop: '52px',
            paddingBottom: '40px',
          }}
        >
          <div
            className="flex items-center justify-between border-b px-5 pb-5"
            style={{ borderColor: 'rgba(250,247,239,0.1)' }}
          >
            <div className="flex items-center">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: ACCENT_BLUE }}
              />
              <span
                className="ml-1.5 text-[12px] font-medium tracking-[3px] text-[#FAF7EF]"
              >
                WNTED
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              className="cursor-pointer"
              aria-label="Close menu"
            >
              <X size={18} className="text-white" style={{ opacity: 0.5 }} />
            </button>
          </div>

          {drawerItems.map((section) => (
            <div key={section.section} className="px-5 pt-4 pb-2">
              <p
                className="mb-1 text-[9px] uppercase text-white"
                style={{ opacity: 0.3, letterSpacing: '1.5px' }}
              >
                {section.section}
              </p>
              {section.items.map((item) => {
                const Icon =
                  drawerIconMap[item.icon as keyof typeof drawerIconMap];

                return (
                  <button
                    key={item.label}
                    type="button"
                    className="flex w-full cursor-pointer items-center justify-between border-b py-3 text-left transition-colors duration-150 hover:bg-[rgba(250,247,239,0.05)]"
                    style={{ borderColor: 'rgba(250,247,239,0.08)' }}
                  >
                    <div className="flex items-center">
                      <Icon
                        size={16}
                        className="mr-3 text-white"
                        style={{ opacity: 0.5 }}
                      />
                      <span className="text-[13px] font-medium text-white">
                        {item.label}
                      </span>
                    </div>
                    <div className="flex items-center">
                      {'badge' in item && item.badge && (
                        <span
                          className="mr-2 rounded-full px-2 py-0.5 text-[9px] font-bold"
                          style={{
                            background: 'rgba(143,168,188,0.15)',
                            color: ACCENT_BLUE,
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight
                        size={14}
                        className="text-white"
                        style={{ opacity: 0.3 }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          ))}

          <div
            className="mt-auto border-t px-5 pt-5"
            style={{ borderColor: 'rgba(250,247,239,0.1)' }}
          >
            <button
              type="button"
              onClick={() => router.push('/')}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border py-3 text-[13px] font-normal text-[#FAF7EF]"
              style={{
                ...innerGlassStyle,
                opacity: 0.85,
              }}
            >
              <LogOut size={16} className="text-[#FAF7EF]" style={{ opacity: 0.7 }} />
              Log Out
            </button>
            <p
              className="mt-4 text-center text-[11px] text-white"
              style={{ opacity: 0.2, letterSpacing: '3px' }}
            >
              WNTED
            </p>
          </div>
        </div>
      </div>
    </AppPageLayout>
  );
}
