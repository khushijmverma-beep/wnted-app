'use client';

import styles from '@/app/home/home.module.css';

export type ProfileDetailTab = 'info' | 'posts';

type ProfileInfoPostsTabBarProps = {
  active: ProfileDetailTab;
  onChange: (tab: ProfileDetailTab) => void;
  className?: string;
  style?: React.CSSProperties;
  infoFirst?: boolean;
};

export default function ProfileInfoPostsTabBar({
  active,
  onChange,
  className = '',
  style,
  infoFirst = false,
}: ProfileInfoPostsTabBarProps) {
  const tabs: { id: ProfileDetailTab; label: string }[] = infoFirst
    ? [
        { id: 'info', label: 'Info' },
        { id: 'posts', label: 'Posts' },
      ]
    : [
        { id: 'posts', label: 'Posts' },
        { id: 'info', label: 'Info' },
      ];

  return (
    <div className={`flex w-full items-center justify-center gap-6 ${className}`} style={style}>
      {tabs.map((tab) => {
        const isActive = active === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`relative min-h-[32px] cursor-pointer border-none bg-transparent px-1 text-[13px] leading-none text-white transition-opacity duration-200 ${styles.tabUnderlineCenter} ${isActive ? styles.tabUnderlineCenterActive : ''}`}
            style={{
              opacity: isActive ? 1 : 0.45,
              fontWeight: isActive ? 600 : 400,
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
