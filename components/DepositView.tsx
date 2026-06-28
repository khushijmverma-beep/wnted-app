'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, ChevronUp, Menu } from 'lucide-react';
import DepositCalendarStreak from '@/components/DepositCalendarStreak';
import DepositCelebration from '@/components/DepositCelebration';
import DepositPaymentScreen from '@/components/DepositPaymentScreen';
import XPPill from '@/components/XPPill';
import { getDepositXp } from '@/lib/depositXp';
import {
  depositCardStyle,
  depositInnerGlassStyle,
  depositPillStyle,
  DEPOSIT_INSET_BG,
  DEPOSIT_INSET_BORDER,
} from '@/lib/depositWidgetStyles';
import styles from '@/app/home/home.module.css';
import depositStyles from '@/app/deposit/deposit.module.css';

type DepositGoal = {
  id: number;
  name: string;
  funded: number;
  goal: number;
};

const quickAmounts = [15, 25, 50, 100];

const cardStyle = depositCardStyle;
const pillStyle = depositPillStyle;
const innerGlassStyle = depositInnerGlassStyle;

const ACCENT_BLUE = '#8FA8BC';
const ACCENT_BLUE_SOFT = 'rgba(143,168,188,0.12)';

const formatMoney = (amount: number) =>
  `$${amount.toLocaleString('en-US')}`;

type DepositViewProps = {
  goals: DepositGoal[];
  streak: number;
  totalSaved: number;
  xp: number;
  onDepositComplete: (payload: {
    goalId: number;
    amount: number;
    xpEarned: number;
  }) => void;
  onOpenMenu: () => void;
};

export default function DepositView({
  goals,
  streak,
  totalSaved,
  xp,
  onDepositComplete,
  onOpenMenu,
}: DepositViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const balanceRef = useRef<HTMLDivElement>(null);
  const xpPillRef = useRef<HTMLDivElement>(null);
  const goalDropdownRef = useRef<HTMLDivElement>(null);
  const depositGoals = useMemo(
    () => (goals.length > 0 ? goals : [{ id: 0, name: 'Wishlist', funded: 0, goal: 100 }]),
    [goals]
  );

  const [step, setStep] = useState<'setup' | 'payment'>('setup');
  const [selectedGoal, setSelectedGoal] = useState(depositGoals[0]);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(15);
  const [customAmount, setCustomAmount] = useState('15');
  const [isGoalDropdownOpen, setIsGoalDropdownOpen] = useState(false);
  const [celebrationActive, setCelebrationActive] = useState(false);

  useEffect(() => {
    setSelectedGoal(depositGoals[0]);
  }, [depositGoals]);

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

  const handleConfirmDeposit = useCallback(() => {
    const xpEarned = getDepositXp(amountValue);
    const deposit = {
      goalId: selectedGoal.id,
      amount: amountValue,
      xpEarned,
    };
    onDepositComplete(deposit);
    setCelebrationActive(true);
  }, [amountValue, onDepositComplete, selectedGoal.id]);

  const handleCelebrationComplete = useCallback(() => {
    setCelebrationActive(false);
    setStep('setup');
    setCustomAmount('15');
    setSelectedAmount(15);
  }, []);

  const header = (
    <div className="mb-3 flex items-center justify-between">
      <h1 className="text-[20px] font-normal text-white">Deposit</h1>
      <div className="flex items-center gap-2">
        <div
          ref={balanceRef}
          className="text-[11px] font-medium tracking-[0.5px] text-white"
          style={{
            ...pillStyle,
            transition: 'transform 0.25s ease, box-shadow 0.25s ease',
            transform: celebrationActive ? 'scale(1.06)' : 'scale(1)',
            boxShadow: celebrationActive
              ? '0 0 16px rgba(143,168,188,0.35)'
              : 'none',
          }}
        >
          {formatMoney(totalSaved)}
        </div>
        <div
          style={{
            transition: 'transform 0.25s ease, box-shadow 0.25s ease',
            transform: celebrationActive ? 'scale(1.06)' : 'scale(1)',
            boxShadow: celebrationActive
              ? '0 0 16px rgba(143,168,188,0.35)'
              : 'none',
            borderRadius: '999px',
          }}
        >
          <XPPill ref={xpPillRef} amount={xp} />
        </div>
        <button
          type="button"
          onClick={onOpenMenu}
          className="cursor-pointer border-none"
          style={{
            ...innerGlassStyle,
            borderRadius: '10px',
            padding: '8px',
          }}
          aria-label="Deposit menu"
        >
          <Menu size={20} className="text-white" style={{ opacity: 0.7 }} />
        </button>
      </div>
    </div>
  );

  if (step === 'payment' && hasAmount) {
    return (
      <div
        ref={containerRef}
        className={`relative flex min-h-0 flex-1 flex-col overflow-hidden font-clash text-white`}
      >
        <div
          className={`flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-[88px] pt-[52px] ${styles.homeScroll}`}
        >
          {header}
          <DepositPaymentScreen
            amount={amountValue}
            goalName={selectedGoal.name}
            onBack={() => !celebrationActive && setStep('setup')}
            onConfirm={handleConfirmDeposit}
            confirmDisabled={celebrationActive}
          />
        </div>

        <DepositCelebration
          active={celebrationActive}
          amount={amountValue}
          xpEarned={getDepositXp(amountValue)}
          balanceRef={balanceRef}
          xpPillRef={xpPillRef}
          containerRef={containerRef}
          onComplete={handleCelebrationComplete}
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative flex min-h-0 flex-1 flex-col overflow-hidden font-clash text-white`}
    >
      <div
        className={`flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-[88px] pt-[52px] ${styles.homeScroll}`}
      >
        {header}

        <div className="mb-3">
          <DepositCalendarStreak streak={streak} />
        </div>

        <div style={cardStyle} ref={goalDropdownRef}>
          <p
            className="mb-2 text-[10px] uppercase text-white"
            style={{ opacity: 0.4, letterSpacing: '1.5px' }}
          >
            Depositing toward
          </p>

          <button
            type="button"
            onClick={() => setIsGoalDropdownOpen((open) => !open)}
            className="flex w-full cursor-pointer items-center justify-between border-none"
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
              {depositGoals.map((goal, index) => {
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
                    className="flex w-full cursor-pointer items-center justify-between border-none px-3.5 py-[11px] text-left"
                    style={{
                      background: isActive ? ACCENT_BLUE_SOFT : 'transparent',
                      borderBottom:
                        index === depositGoals.length - 1
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
              <span className="text-[9px] text-white" style={{ opacity: 0.35 }}>
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

          <div
            className="my-4 h-px"
            style={{ background: 'rgba(250,247,239,0.1)' }}
            aria-hidden="true"
          />

          <p
            className="mb-3 text-[10px] uppercase text-white"
            style={{ opacity: 0.4, letterSpacing: '1.5px' }}
          >
            Amount
          </p>

          <div className={depositStyles.amountInputWrap}>
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
              className={`${depositStyles.amountInput} w-[120px] border-none bg-transparent text-center font-clash text-[48px] font-normal text-white outline-none placeholder:text-white/15`}
            />
            <div className={depositStyles.amountStepper}>
              <button
                type="button"
                onClick={() => adjustAmount(1)}
                className={depositStyles.amountStepBtn}
                aria-label="Increase amount"
              >
                <ChevronUp size={14} className="text-white" strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={() => adjustAmount(-1)}
                className={depositStyles.amountStepBtn}
                aria-label="Decrease amount"
              >
                <ChevronDown size={14} className="text-white" strokeWidth={2} />
              </button>
            </div>
          </div>

          <div className="mt-4 flex justify-center gap-2">
            {quickAmounts.map((amount) => {
              const isActive =
                selectedAmount === amount || customAmount === String(amount);

              return (
                <button
                  key={amount}
                  type="button"
                  onClick={() => handleQuickAmount(amount)}
                  className="cursor-pointer rounded-full border px-[18px] py-[7px] text-[12px] font-semibold transition-all duration-200"
                  style={{
                  background: isActive
                    ? 'rgba(143,168,188,0.18)'
                    : DEPOSIT_INSET_BG,
                  color: '#FAF7EF',
                  borderColor: isActive
                    ? 'rgba(143,168,188,0.35)'
                    : DEPOSIT_INSET_BORDER,
                  }}
                >
                  ${amount}
                </button>
              );
            })}
          </div>

          {hasAmount && (
            <p
              className="mt-3.5 text-center text-[12px] font-normal text-white"
              style={{ opacity: 0.45 }}
            >
              After this deposit you&apos;ll be{' '}
              <span style={{ color: ACCENT_BLUE }}>{afterPercent}%</span> funded
              <span className="mt-0.5 block text-[11px]" style={{ opacity: 0.7 }}>
                +{getDepositXp(amountValue)} XP
              </span>
            </p>
          )}

          <button
            type="button"
            disabled={!hasAmount}
            onClick={() => hasAmount && setStep('payment')}
            className="mt-4 w-full cursor-pointer rounded-[12px] border py-3.5 text-[15px] font-normal tracking-[0.5px] text-[#FAF7EF] transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              background: hasAmount
                ? 'rgba(143,168,188,0.22)'
                : DEPOSIT_INSET_BG,
              borderColor: hasAmount
                ? 'rgba(143,168,188,0.45)'
                : DEPOSIT_INSET_BORDER,
            }}
          >
            {hasAmount
              ? `Deposit $${amountValue.toLocaleString('en-US')}`
              : 'Enter an Amount'}
          </button>
        </div>

        <p
          className="mt-3 pb-2 text-center text-[10px] text-white"
          style={{ opacity: 0.3 }}
        >
          No fees. Funds applied instantly to your goal.
        </p>
      </div>
    </div>
  );
}
