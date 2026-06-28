'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import WntedLogo from './WntedLogo';
import MarketingCarousel from './MarketingCarousel';

const TextType = dynamic(() => import('./TextType'), { ssr: false });

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
      <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}

export default function WelcomeScreen() {
  const router = useRouter();
  const [panelOpen, setPanelOpen] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartY = useRef(0);
  const panelRef = useRef<HTMLDivElement>(null);

  const openPanel = () => {
    setDragY(0);
    setPanelOpen(true);
  };

  const closePanel = () => {
    setPanelOpen(false);
    setDragY(0);
  };

  useEffect(() => {
    if (!isDragging) return;

    const onMove = (e: MouseEvent | TouchEvent) => {
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const delta = clientY - dragStartY.current;
      if (delta > 0) setDragY(delta);
    };

    const onEnd = () => {
      setDragY((current) => {
        if (current > 100) closePanel();
        return 0;
      });
      setIsDragging(false);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchmove', onMove);
    window.addEventListener('touchend', onEnd);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, [isDragging]);

  const handleDragStart = (clientY: number) => {
    setIsDragging(true);
    dragStartY.current = clientY;
  };

  const goHome = () => {
    router.push('/home');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black font-clash">
      <div
        className="relative overflow-hidden"
        style={{
          width: '390px',
          height: '844px',
          borderRadius: '40px',
          border: '1px solid rgba(250,247,239,0.08)',
          background: '#000000',
        }}
      >
        {/* Header */}
        <header className="relative z-10 flex items-center gap-3 px-6 pt-[52px]">
          <WntedLogo size={32} />
          <span className="text-[18px] font-medium tracking-[2px] text-[#FAF7EF]">
            Wnted
          </span>
        </header>

        {/* Hero */}
        <section className="relative z-10 px-6 pt-5">
          <h1 className="text-[22px] font-medium leading-[1.35] text-[#FAF7EF] max-w-[280px]">
            The things you want most. Made possible.
          </h1>

          <div className="mt-6 min-h-[22px]">
            <TextType
              text={['Track spending', 'Set goals', 'Save smarter', 'Price alerts']}
              typingSpeed={70}
              deletingSpeed={40}
              pauseDuration={1800}
              showCursor
              cursorCharacter="_"
              className="text-[16px] font-normal text-[#FAF7EF]"
            />
          </div>
        </section>

        <MarketingCarousel />

        {/* Bottom CTA */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-10">
          <button
            type="button"
            onClick={openPanel}
            className="w-full rounded-xl py-4 text-[15px] font-medium tracking-[0.3px] text-[#26303B] transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
            style={{ background: '#FAF7EF' }}
          >
            Get Started
          </button>
          <p className="mt-4 text-center text-[14px] font-normal text-[rgba(250,247,239,0.55)]">
            Already have an account?{' '}
            <button
              type="button"
              onClick={goHome}
              className="font-medium text-[#FAF7EF] hover:opacity-80 transition-opacity bg-transparent border-none cursor-pointer p-0"
            >
              Login
            </button>
          </p>
        </div>

        {/* Backdrop */}
        <div
          className="absolute inset-0 z-20 transition-opacity duration-300"
          style={{
            background: 'rgba(38,48,59,0.35)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            opacity: panelOpen ? 1 : 0,
            pointerEvents: panelOpen ? 'auto' : 'none',
          }}
          onClick={closePanel}
          aria-hidden={!panelOpen}
        />

        {/* Login drag-up panel */}
        <div
          ref={panelRef}
          className="absolute left-0 right-0 z-30 rounded-t-[28px]"
          style={{
            bottom: 0,
            background: 'rgba(38,48,59,0.18)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            borderTop: '1px solid rgba(250,247,239,0.14)',
            transform: panelOpen
              ? `translateY(${dragY}px)`
              : 'translateY(100%)',
            transition: isDragging ? 'none' : 'transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)',
          }}
        >
          {/* Drag handle */}
          <div
            className="flex justify-center pt-4 pb-2 cursor-grab active:cursor-grabbing"
            onMouseDown={(e) => handleDragStart(e.clientY)}
            onTouchStart={(e) => handleDragStart(e.touches[0].clientY)}
          >
            <div
              className="rounded-full"
              style={{
                width: '36px',
                height: '4px',
                background: 'rgba(250,247,239,0.25)',
              }}
            />
          </div>

          <div className="px-6 pb-10">
            <h2 className="text-[22px] font-medium text-[#FAF7EF]">
              Welcome to <span className="text-[rgba(250,247,239,0.65)]">Wnted</span>
            </h2>
            <p className="mt-1 text-[14px] font-normal text-[rgba(250,247,239,0.45)]">
              Your budgeting companion for everyday saving
            </p>

            <div className="mt-6 space-y-3">
              <div
                className="flex items-center gap-3 rounded-xl px-4 py-3.5"
                style={{
                  background: 'rgba(250,247,239,0.06)',
                  border: '1px solid rgba(250,247,239,0.12)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FAF7EF" strokeWidth="1.5" opacity="0.35">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <input
                  type="email"
                  placeholder="Email address"
                  autoComplete="email"
                  className="login-input flex-1 bg-transparent text-[14px] text-[#FAF7EF] placeholder:text-[rgba(250,247,239,0.35)] outline-none font-clash"
                />
              </div>
              <div
                className="flex items-center gap-3 rounded-xl px-4 py-3.5"
                style={{
                  background: 'rgba(250,247,239,0.06)',
                  border: '1px solid rgba(250,247,239,0.12)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FAF7EF" strokeWidth="1.5" opacity="0.35">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  type="password"
                  placeholder="Password"
                  autoComplete="current-password"
                  className="login-input flex-1 bg-transparent text-[14px] text-[#FAF7EF] placeholder:text-[rgba(250,247,239,0.35)] outline-none font-clash"
                />
              </div>
            </div>

            <button
              type="button"
              className="mt-5 w-full rounded-xl py-4 text-[15px] font-medium text-[#FAF7EF] transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
              style={{
                background: 'rgba(62,78,96,0.55)',
                border: '1px solid rgba(250,247,239,0.18)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
              }}
            >
              Sign in
            </button>

            <p className="mt-5 text-center text-[13px] text-[rgba(250,247,239,0.35)]">
              Or connect using
            </p>

            <div className="mt-3 flex gap-3">
              <button
                type="button"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-[13px] font-medium text-[rgba(250,247,239,0.75)] transition-colors hover:bg-[rgba(250,247,239,0.04)]"
                style={{
                  background: 'rgba(250,247,239,0.05)',
                  border: '1px solid rgba(250,247,239,0.12)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                }}
              >
                <span className="text-[14px] font-medium opacity-60">f</span>
                Facebook
              </button>
              <button
                type="button"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-[13px] font-medium text-[rgba(250,247,239,0.75)] transition-colors hover:bg-[rgba(250,247,239,0.04)]"
                style={{
                  background: 'rgba(250,247,239,0.05)',
                  border: '1px solid rgba(250,247,239,0.12)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                }}
              >
                <GoogleIcon />
                Google
              </button>
            </div>

            <p className="mt-6 text-center text-[13px] text-[rgba(250,247,239,0.4)]">
              Don&apos;t have an account?{' '}
              <button
                type="button"
                className="font-medium text-[rgba(250,247,239,0.75)] hover:text-[#FAF7EF] transition-colors bg-transparent border-none cursor-pointer p-0"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
