'use client';

import { useEffect } from 'react';
import {
  ArrowDownLeft,
  Building2,
  ChevronRight,
  Clock,
  FileText,
  Gift,
  HelpCircle,
  LogOut,
  Settings,
  Shield,
  X,
} from 'lucide-react';
import WntedLogo from '@/components/WntedLogo';
import styles from '@/app/home/home.module.css';

const ACCENT_BLUE = '#8FA8BC';

const drawerItems = [
  {
    section: 'Account',
    items: [
      { label: 'Request Withdrawal', icon: ArrowDownLeft },
      { label: 'Savings History', icon: Clock },
      { label: 'Linked Bank Accounts', icon: Building2 },
      { label: 'Referral Program', icon: Gift, badge: 'Earn $10' },
    ],
  },
  {
    section: 'Support',
    items: [
      { label: 'Help Center', icon: HelpCircle },
      { label: 'Settings', icon: Settings },
    ],
  },
  {
    section: 'Legal',
    items: [
      { label: 'Terms of Service', icon: FileText },
      { label: 'Privacy Policy', icon: Shield },
    ],
  },
] as const;

const innerGlassStyle: React.CSSProperties = {
  background: 'rgba(250,247,239,0.08)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(250,247,239,0.12)',
};

type ProfileMenuDrawerProps = {
  open: boolean;
  onClose: () => void;
  onLogOut?: () => void;
};

export default function ProfileMenuDrawer({
  open,
  onClose,
  onLogOut,
}: ProfileMenuDrawerProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  return (
    <>
      {open && (
        <div
          className="absolute inset-0 z-[200]"
          style={{
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
          }}
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <div
        className={`absolute top-0 right-0 bottom-0 z-[210] flex w-[280px] flex-col overflow-y-auto ${styles.drawerPanel} ${open ? styles.drawerPanelOpen : ''} ${styles.homeScroll}`}
        style={{
          background: 'rgba(250,247,239,0.08)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderLeft: '1px solid rgba(250,247,239,0.12)',
          paddingTop: '52px',
          paddingBottom: '40px',
        }}
        aria-hidden={!open}
      >
        <div
          className="flex items-center justify-between border-b px-5 pb-5"
          style={{ borderColor: 'rgba(250,247,239,0.1)' }}
        >
          <div className="flex items-center gap-1.5">
            <WntedLogo size={16} />
            <span className="text-[12px] font-medium tracking-[3px] text-[#FAF7EF]">
              WNTED
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer border-none bg-transparent p-0"
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
              const Icon = item.icon;

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={onClose}
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
            onClick={() => {
              onClose();
              onLogOut?.();
            }}
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
    </>
  );
}
