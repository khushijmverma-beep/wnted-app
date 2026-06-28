'use client';

import dynamic from 'next/dynamic';
import { Check } from 'lucide-react';
import ItemPreviewBackdrop from '@/components/ItemPreviewBackdrop';
import {
  getAvatarItemColor,
  type AvatarClothingSlot,
  type AvatarShopItem,
} from '@/lib/avatarItems';

const AvatarItemPreview = dynamic(() => import('@/components/AvatarItemPreview'), {
  ssr: false,
  loading: () => (
    <div
      className="h-full w-full rounded-[6px]"
      style={{ background: 'rgba(250,247,239,0.04)' }}
    />
  ),
});

const INVENTORY_TILE_STYLE: React.CSSProperties = {
  border: '1px solid rgba(250,247,239,0.12)',
  borderRadius: '10px',
};

type AvatarInventoryGridProps = {
  items: AvatarShopItem[];
  equippedSlots: Record<AvatarClothingSlot, string | null>;
  itemColors?: Record<string, string>;
  previewBackgroundImage?: string | null;
  onEquip: (item: AvatarShopItem) => void;
  breadcrumb?: string;
  columns?: 3 | 4;
  emptyMessage?: string;
};

export default function AvatarInventoryGrid({
  items,
  equippedSlots,
  itemColors = {},
  previewBackgroundImage = null,
  onEquip,
  breadcrumb,
  columns = 3,
  emptyMessage = 'No items in your inventory yet',
}: AvatarInventoryGridProps) {
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

      <div
        className={`grid gap-2.5 ${columns === 4 ? 'grid-cols-4' : 'grid-cols-3'}`}
      >
        {items.map((item) => {
          const isEquipped =
            item.slot != null && equippedSlots[item.slot] === item.id;
          const previewColor = item.customizableColor
            ? getAvatarItemColor(item.id, itemColors)
            : undefined;

          return (
            <div key={item.id} className="flex min-w-0 flex-col gap-1">
              <button
                type="button"
                onClick={() => onEquip(item)}
                className="relative aspect-square w-full cursor-pointer overflow-hidden border-none p-0 transition-opacity hover:opacity-90"
                style={{
                  ...INVENTORY_TILE_STYLE,
                  border: isEquipped
                    ? '1px solid rgba(138,151,168,0.45)'
                    : INVENTORY_TILE_STYLE.border,
                  background: 'transparent',
                }}
                aria-label={`${item.name}${isEquipped ? ', equipped' : ''}`}
                aria-pressed={isEquipped}
              >
                <ItemPreviewBackdrop image={previewBackgroundImage} sizes="120px" />
                <div className="absolute inset-1.5 z-[1]">
                  <AvatarItemPreview
                    modelPath={item.modelPath}
                    color={previewColor}
                  />
                </div>

                {isEquipped && (
                  <span
                    className="absolute right-1 top-1 z-[2] flex h-[15px] w-[15px] items-center justify-center rounded-[3px]"
                    style={{
                      background: '#FAF7EF',
                      border: '1px solid rgba(250,247,239,0.25)',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.18)',
                    }}
                    aria-hidden="true"
                  >
                    <Check size={9} className="text-[#354552]" strokeWidth={3} />
                  </span>
                )}
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
