'use client';

import type { AvatarEditCategory } from '@/lib/avatarItems';
import { AVATAR_EDIT_SUBCATEGORIES, AVATAR_EDIT_TABS } from '@/lib/avatarItems';
import styles from '@/app/home/home.module.css';

const panelStyle = {
  background: 'rgba(250,247,239,0.06)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(250,247,239,0.12)',
  borderRadius: '16px',
  padding: '14px',
};

type AvatarCategoryPanelProps = {
  activeCategory: AvatarEditCategory;
  activeSubCategory: string;
  onCategoryChange: (category: AvatarEditCategory) => void;
  onSubCategoryChange: (subCategoryId: string) => void;
  excludedSubCategoryIds?: string[];
  children: React.ReactNode;
  className?: string;
};

export default function AvatarCategoryPanel({
  activeCategory,
  activeSubCategory,
  onCategoryChange,
  onSubCategoryChange,
  excludedSubCategoryIds = [],
  children,
  className = '',
}: AvatarCategoryPanelProps) {
  const subcategories = AVATAR_EDIT_SUBCATEGORIES[activeCategory].filter(
    (item) => !excludedSubCategoryIds.includes(item.id)
  );

  return (
    <div
      className={`flex h-full min-h-0 w-full flex-col ${className}`}
      style={{ ...panelStyle, borderRadius: '12px', padding: '10px' }}
    >
      <div className="mb-2.5 flex shrink-0 gap-1">
        {AVATAR_EDIT_TABS.map((tab) => {
          const isActive = activeCategory === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onCategoryChange(tab.id)}
              className="flex-1 cursor-pointer rounded-[8px] border-none py-1.5 text-center text-[9px] font-semibold text-white transition-opacity"
              style={{
                background: isActive
                  ? 'rgba(138,151,168,0.22)'
                  : 'rgba(250,247,239,0.06)',
                border: isActive
                  ? '1px solid rgba(138,151,168,0.45)'
                  : '1px solid rgba(250,247,239,0.08)',
                opacity: isActive ? 1 : 0.55,
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="flex min-h-0 flex-1 gap-2">
        <div
          className={`flex w-[72px] shrink-0 flex-col gap-1 overflow-y-auto ${styles.homeScroll}`}
          style={{
            borderRight: '1px solid rgba(250,247,239,0.1)',
            paddingRight: '8px',
          }}
        >
          {subcategories.map((item) => {
            const isActive = activeSubCategory === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSubCategoryChange(item.id)}
                className="cursor-pointer rounded-[8px] border-none px-1.5 py-1.5 text-left text-[9px] font-medium leading-tight text-white transition-opacity"
                style={{
                  background: isActive
                    ? 'rgba(138,151,168,0.18)'
                    : 'rgba(250,247,239,0.05)',
                  border: isActive
                    ? '1px solid rgba(138,151,168,0.35)'
                    : '1px solid rgba(250,247,239,0.08)',
                  opacity: isActive ? 1 : 0.7,
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className={`min-h-0 flex-1 overflow-y-auto ${styles.homeScroll}`}>
          {children}
        </div>
      </div>
    </div>
  );
}

export { panelStyle };
