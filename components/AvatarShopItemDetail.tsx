'use client';

import dynamic from 'next/dynamic';
import { ChevronLeft } from 'lucide-react';
import ItemPreviewBackdrop from '@/components/ItemPreviewBackdrop';
import { getAvatarItemColor, type AvatarShopItem } from '@/lib/avatarItems';

const AvatarClothingPreviewViewer = dynamic(
  () => import('@/components/AvatarClothingPreviewViewer'),
  {
    ssr: false,
    loading: () => (
      <div
        className="h-full w-full rounded-[12px]"
        style={{ background: 'rgba(250,247,239,0.04)' }}
      />
    ),
  }
);

const panelStyle: React.CSSProperties = {
  background: 'rgba(250,247,239,0.06)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(250,247,239,0.12)',
  borderRadius: '16px',
};

type AvatarShopItemDetailProps = {
  item: AvatarShopItem;
  isOwned: boolean;
  isEquipped: boolean;
  canAfford: boolean;
  isSignedIn: boolean;
  backgroundImage?: string | null;
  itemColors?: Record<string, string>;
  onClose: () => void;
  onRequireSignIn: () => void;
  onPurchase: () => void;
  onEquip: () => void;
};

function ItemDetailBackground({ image }: { image: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <ItemPreviewBackdrop image={image} sizes="390px" />
    </div>
  );
}

export default function AvatarShopItemDetail({
  item,
  isOwned,
  isEquipped,
  canAfford,
  isSignedIn,
  backgroundImage = null,
  itemColors = {},
  onClose,
  onRequireSignIn,
  onPurchase,
  onEquip,
}: AvatarShopItemDetailProps) {
  const previewColor = item.customizableColor
    ? getAvatarItemColor(item.id, itemColors)
    : undefined;

  return (
    <div
      className="absolute inset-0 z-[200] flex flex-col px-4 pb-[88px] pt-10 font-clash text-white"
      style={{ background: backgroundImage ? 'transparent' : '#000' }}
    >
      {backgroundImage && <ItemDetailBackground image={backgroundImage} />}

      <div className="relative z-10 flex flex-col">
      <div className="mb-3 flex items-center gap-2">
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-none"
          style={{
            background: 'rgba(250,247,239,0.08)',
            border: '1px solid rgba(250,247,239,0.12)',
          }}
          aria-label="Back to shop"
        >
          <ChevronLeft size={16} className="text-white" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-medium text-[#FAF7EF]">{item.name}</p>
          <p className="text-[10px] text-white" style={{ opacity: 0.45 }}>
            Drag to rotate · pinch to zoom
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div
          className="relative overflow-hidden rounded-[16px] border"
          style={{
            height: 320,
            borderColor: 'rgba(250,247,239,0.12)',
            background: 'transparent',
          }}
        >
          <ItemPreviewBackdrop image={backgroundImage} sizes="360px" />
          <div className="relative z-[1] h-full w-full">
            <AvatarClothingPreviewViewer
              modelPath={item.modelPath}
              color={previewColor}
              height={320}
            />
          </div>
        </div>

        <div className="shrink-0 rounded-[14px] px-3 py-3" style={panelStyle}>
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-[12px] font-medium text-white">{item.name}</p>
              <p className="text-[10px] text-white" style={{ opacity: 0.45 }}>
                {item.price === 0 ? 'Free' : `${item.price.toLocaleString('en-US')} XP`}
              </p>
            </div>
            {isEquipped && (
              <span
                className="rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.5px] text-white"
                style={{
                  background: 'rgba(138,151,168,0.28)',
                  border: '1px solid rgba(138,151,168,0.45)',
                }}
              >
                Equipped
              </span>
            )}
          </div>

          {isOwned ? (
            <button
              type="button"
              onClick={onEquip}
              className="w-full cursor-pointer rounded-[10px] border-none py-3 text-[13px] font-semibold text-[#FAF7EF]"
              style={{
                background: isEquipped
                  ? 'rgba(138,151,168,0.28)'
                  : 'rgba(250,247,239,0.14)',
                border: '1px solid rgba(250,247,239,0.18)',
              }}
            >
              {isEquipped ? 'Unequip' : 'Equip'}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (!isSignedIn) {
                  onRequireSignIn();
                  return;
                }
                onPurchase();
              }}
              disabled={!canAfford && isSignedIn}
              className="w-full cursor-pointer rounded-[10px] border-none py-3 text-[13px] font-semibold text-[#FAF7EF] disabled:cursor-default disabled:opacity-40"
              style={{
                background: 'rgba(250,247,239,0.14)',
                border: '1px solid rgba(250,247,239,0.18)',
              }}
            >
              Buy · {item.price === 0 ? 'Free' : `✦ ${item.price.toLocaleString('en-US')} XP`}
            </button>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
