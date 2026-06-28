'use client';

import dynamic from 'next/dynamic';
import { getAvatarItemColor, type AvatarShopItem } from '@/lib/avatarItems';
import ItemPreviewBackdrop from '@/components/ItemPreviewBackdrop';

const AvatarItemPreview = dynamic(() => import('@/components/AvatarItemPreview'), {
  ssr: false,
  loading: () => (
    <div
      className="h-full w-full rounded-[6px]"
      style={{ background: 'rgba(250,247,239,0.04)' }}
    />
  ),
});

const TILE_STYLE: React.CSSProperties = {
  border: '1px solid rgba(250,247,239,0.12)',
  borderRadius: '10px',
};

type AvatarShopGridProps = {
  items: AvatarShopItem[];
  ownedAvatarItemIds: string[];
  itemColors?: Record<string, string>;
  previewBackgroundImage?: string | null;
  onSelectItem: (item: AvatarShopItem) => void;
  breadcrumb?: string;
  emptyMessage?: string;
};

export default function AvatarShopGrid({
  items,
  ownedAvatarItemIds,
  itemColors = {},
  previewBackgroundImage = null,
  onSelectItem,
  breadcrumb,
  emptyMessage = 'Nothing for sale here yet',
}: AvatarShopGridProps) {
  if (items.length === 0) {
    return (
      <p className="py-6 text-center text-[10px] text-white" style={{ opacity: 0.35 }}>
        {emptyMessage}
      </p>
    );
  }

  return (
    <div>
      {breadcrumb && (
        <p
          className="mb-2.5 text-[9px] font-medium text-white"
          style={{ opacity: 0.45 }}
        >
          {breadcrumb}
        </p>
      )}

      <div className="grid grid-cols-3 gap-2.5">
        {items.map((item) => {
          const isOwned = ownedAvatarItemIds.includes(item.id);
          const previewColor = item.customizableColor
            ? getAvatarItemColor(item.id, itemColors)
            : undefined;

          return (
            <div key={item.id} className="flex min-w-0 flex-col gap-1">
              <button
                type="button"
                onClick={() => onSelectItem(item)}
                className="relative aspect-square w-full cursor-pointer overflow-hidden border-none p-0 transition-opacity hover:opacity-90"
                style={TILE_STYLE}
                aria-label={`View ${item.name}`}
              >
                <ItemPreviewBackdrop image={previewBackgroundImage} sizes="120px" />
                <div className="absolute inset-1.5 z-[1]">
                  <AvatarItemPreview modelPath={item.modelPath} color={previewColor} />
                </div>

                <span
                  className="absolute bottom-1 left-1 z-[2] rounded-full px-1.5 py-0.5 text-[8px] font-semibold text-[#FAF7EF]"
                  style={{
                    background: isOwned
                      ? 'rgba(138,151,168,0.55)'
                      : 'rgba(0,0,0,0.45)',
                    border: '1px solid rgba(250,247,239,0.15)',
                  }}
                >
                  {isOwned
                    ? 'Owned'
                    : item.price === 0
                      ? 'Free'
                      : `✦ ${item.price.toLocaleString('en-US')}`}
                </span>
              </button>

              <p
                className="truncate px-0.5 text-center text-[9px] leading-tight text-white"
                style={{ opacity: 0.75 }}
                title={item.name}
              >
                {item.name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
