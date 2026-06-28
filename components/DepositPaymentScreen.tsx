'use client';

import { useState } from 'react';
import {
  Building2,
  ChevronLeft,
  CreditCard,
  Smartphone,
  Wallet,
} from 'lucide-react';
import {
  depositCardStyle,
  depositInnerGlassStyle,
  DEPOSIT_INSET_BG,
  DEPOSIT_INSET_BORDER,
} from '@/lib/depositWidgetStyles';

const cardStyle = depositCardStyle;
const innerGlassStyle = depositInnerGlassStyle;

const ACCENT_BLUE = '#8FA8BC';
const ACCENT_BLUE_SOFT = 'rgba(143,168,188,0.12)';
const ACCENT_BLUE_BORDER = 'rgba(143,168,188,0.35)';

const paymentMethods = [
  {
    id: 'applepay',
    name: 'Apple Pay',
    sub: 'Fastest',
    badge: true,
    icon: Smartphone,
  },
  {
    id: 'bank',
    name: 'Frost Personal',
    sub: 'Acct ending in 1216',
    badge: false,
    icon: Building2,
  },
  {
    id: 'debit',
    name: 'Debit Card',
    sub: 'Visa or Mastercard',
    badge: false,
    icon: CreditCard,
  },
  {
    id: 'venmo',
    name: 'Venmo',
    sub: '@khushi',
    badge: false,
    icon: Wallet,
  },
] as const;

type DepositPaymentScreenProps = {
  amount: number;
  goalName: string;
  onBack: () => void;
  onConfirm: () => void;
  confirmDisabled?: boolean;
};

const inputStyle: React.CSSProperties = {
  ...innerGlassStyle,
  borderRadius: '10px',
  padding: '12px 14px',
  width: '100%',
  fontSize: '14px',
  color: '#FAF7EF',
  outline: 'none',
};

export default function DepositPaymentScreen({
  amount,
  goalName,
  onBack,
  onConfirm,
  confirmDisabled = false,
}: DepositPaymentScreenProps) {
  const [selectedMethod, setSelectedMethod] = useState('applepay');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');

  const showCardForm = selectedMethod === 'debit';
  const canConfirm =
    selectedMethod !== 'debit' ||
    (cardNumber.replace(/\s/g, '').length >= 15 &&
      expiry.length >= 4 &&
      cvc.length >= 3 &&
      nameOnCard.trim().length > 0);

  return (
    <>
      <div className="mb-4 flex items-center">
        <button
          type="button"
          onClick={onBack}
          className="mr-2 cursor-pointer border-none bg-transparent p-1"
          aria-label="Back to deposit"
        >
          <ChevronLeft size={22} className="text-white" strokeWidth={2} />
        </button>
        <h1 className="text-[20px] font-normal text-white">Payment</h1>
      </div>

      <div
        style={cardStyle}
        className="mb-3"
      >
        <p
          className="mb-1 text-[10px] uppercase text-white"
          style={{ opacity: 0.4, letterSpacing: '1.5px' }}
        >
          You&apos;re depositing
        </p>
        <p className="text-[32px] font-normal leading-none text-white">
          ${amount.toLocaleString('en-US')}
        </p>
        <p className="mt-1.5 text-[12px] font-normal text-white" style={{ opacity: 0.45 }}>
          toward <span className="font-normal text-[#FAF7EF]">{goalName}</span>
        </p>
      </div>

      <div style={cardStyle}>
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
            const Icon = method.icon;

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
                    style={{ background: DEPOSIT_INSET_BG }}
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

      {showCardForm && (
        <div
          style={{ ...cardStyle, marginTop: '12px' }}
        >
          <p
            className="mb-3 text-[10px] uppercase text-white"
            style={{ opacity: 0.4, letterSpacing: '1.5px' }}
          >
            Card details
          </p>

          <div className="flex flex-col gap-2.5">
            <input
              type="text"
              inputMode="numeric"
              placeholder="Card number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="border-none font-clash placeholder:text-white/25"
              style={inputStyle}
              autoComplete="cc-number"
            />
            <div className="grid grid-cols-2 gap-2.5">
              <input
                type="text"
                placeholder="MM / YY"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="border-none font-clash placeholder:text-white/25"
                style={inputStyle}
                autoComplete="cc-exp"
              />
              <input
                type="text"
                inputMode="numeric"
                placeholder="CVC"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                className="border-none font-clash placeholder:text-white/25"
                style={inputStyle}
                autoComplete="cc-csc"
              />
            </div>
            <input
              type="text"
              placeholder="Name on card"
              value={nameOnCard}
              onChange={(e) => setNameOnCard(e.target.value)}
              className="border-none font-clash placeholder:text-white/25"
              style={inputStyle}
              autoComplete="cc-name"
            />
          </div>
        </div>
      )}

      <button
        type="button"
        disabled={!canConfirm || confirmDisabled}
        onClick={onConfirm}
        className="mt-4 w-full cursor-pointer rounded-[12px] border py-3.5 text-[15px] font-normal tracking-[0.5px] text-[#FAF7EF] transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        style={{
          background: canConfirm && !confirmDisabled
            ? 'rgba(143,168,188,0.22)'
            : DEPOSIT_INSET_BG,
          borderColor: canConfirm && !confirmDisabled
            ? 'rgba(143,168,188,0.45)'
            : DEPOSIT_INSET_BORDER,
        }}
      >
        Confirm ${amount.toLocaleString('en-US')} deposit
      </button>

      <p
        className="mt-3 pb-2 text-center text-[10px] text-white"
        style={{ opacity: 0.3 }}
      >
        No fees. Funds applied instantly to your goal.
      </p>
    </>
  );
}
