'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronDown, Mic, Search, Sparkles } from 'lucide-react';
import AppPageLayout from '@/components/AppPageLayout';
import styles from './discover.module.css';

const categoryTabs = [
  { id: 'all', label: 'All' },
  { id: 'electronics', label: 'Electronics' },
  { id: 'fashion', label: 'Fashion' },
  { id: 'beauty', label: 'Beauty' },
  { id: 'home', label: 'Home' },
  { id: 'wellness', label: 'Wellness' },
  { id: 'sports', label: 'Sports' },
  { id: 'books', label: 'Books' },
];

const priceRanges = [
  { id: 'all', label: 'Any Price', min: 0, max: Infinity },
  { id: 'under50', label: 'Under $50', min: 0, max: 50 },
  { id: '50to100', label: '$50 – $100', min: 50, max: 100 },
  { id: '100to250', label: '$100 – $250', min: 100, max: 250 },
  { id: '250to500', label: '$250 – $500', min: 250, max: 500 },
  { id: '500to1000', label: '$500 – $1,000', min: 500, max: 1000 },
  { id: 'over1000', label: '$1,000+', min: 1000, max: Infinity },
];

const products = [
  {
    id: 1,
    name: 'MacBook Pro 14',
    category: 'Electronics',
    price: 1999,
    image: '/macBook.png',
  },
  {
    id: 2,
    name: 'Air Forces 1',
    category: 'Fashion',
    price: 110,
    image: '/GreenSambas.png',
  },
  {
    id: 3,
    name: 'Dyson Airwrap',
    category: 'Beauty',
    price: 499,
    image: '/dyson.png',
  },
  {
    id: 4,
    name: 'Bottega Bag',
    category: 'Fashion',
    price: 3900,
    image: '/BotegaBag.png',
  },
  {
    id: 5,
    name: 'iPad Pro',
    category: 'Electronics',
    price: 1099,
    image: '/IpadPro.png',
  },
  {
    id: 6,
    name: 'Lulu Leggings',
    category: 'Fashion',
    price: 98,
    image: '/LuLuLeggings.png',
  },
  {
    id: 7,
    name: 'AirPods Max',
    category: 'Electronics',
    price: 549,
    image: '/AirpodMax.png',
  },
  {
    id: 8,
    name: 'Rare Beauty Set',
    category: 'Beauty',
    price: 65,
    image: '/CentellaSkinCare.png',
  },
  {
    id: 9,
    name: 'Nike Dunks',
    category: 'Sports',
    price: 110,
  },
  {
    id: 10,
    name: 'Kindle Paperwhite',
    category: 'Books',
    price: 139,
  },
  {
    id: 11,
    name: 'Charlotte Tilbury',
    category: 'Beauty',
    price: 45,
    image: '/OstreneFaceWash.png',
  },
  {
    id: 12,
    name: 'New Balance 574',
    category: 'Sports',
    price: 89,
  },
  {
    id: 13,
    name: 'Sony Headphones',
    category: 'Electronics',
    price: 349,
    image: '/AirpodProMax.png',
  },
  {
    id: 14,
    name: 'Glossier Set',
    category: 'Beauty',
    price: 55,
  },
  {
    id: 15,
    name: 'Carhartt Beanie',
    category: 'Fashion',
    price: 35,
  },
  {
    id: 16,
    name: 'Theragun Mini',
    category: 'Wellness',
    price: 199,
  },
  {
    id: 17,
    name: 'Nespresso',
    category: 'Home',
    price: 179,
  },
  {
    id: 18,
    name: 'Ninja Blender',
    category: 'Home',
    price: 129,
  },
  {
    id: 19,
    name: 'Patagonia Fleece',
    category: 'Fashion',
    price: 149,
  },
  {
    id: 20,
    name: 'YSL Perfume',
    category: 'Beauty',
    price: 135,
    image: '/LoweaPerfume.png',
  },
];

const formatPrice = (price: number) =>
  `$${price.toLocaleString('en-US')}`;

export default function DiscoverPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activePriceRange, setActivePriceRange] = useState('all');
  const [isPriceDropdownOpen, setIsPriceDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeRangeLabel =
    priceRanges.find((range) => range.id === activePriceRange)?.label ??
    'Any Price';

  const filteredProducts = products.filter((p) => {
    const categoryMatch =
      activeCategory === 'all' ||
      p.category.toLowerCase() === activeCategory;
    const range = priceRanges.find((r) => r.id === activePriceRange)!;
    const priceMatch = p.price >= range.min && p.price <= range.max;
    return categoryMatch && priceMatch;
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsPriceDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <AppPageLayout phoneBackground="ink">
      <div
        className={`flex h-full flex-col overflow-y-auto px-4 pt-[36px] pb-[90px] text-white font-clash ${styles.discoverScroll}`}
      >
        {/* HEADER */}
        <h1 className="mb-3 text-left text-[28px] font-normal tracking-[1px] text-[#FAF7EF]">
          Discover
        </h1>

        {/* SEARCH BAR + AI SPARKLE */}
        <div className="flex items-center gap-2">
          <div
            className={`flex flex-1 items-center gap-2.5 px-3 py-2 ${styles.glassWidget}`}
            style={{ borderRadius: '12px' }}
          >
            <Search
              size={15}
              className="shrink-0 text-[#FAF7EF]"
              style={{ opacity: 0.45 }}
            />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full bg-transparent text-[12px] text-[#FAF7EF] outline-none placeholder:text-[rgba(250,247,239,0.35)]"
            />
            <button type="button" aria-label="Voice search" className="shrink-0">
              <Mic size={15} className="text-[#FAF7EF]" style={{ opacity: 0.45 }} />
            </button>
          </div>
          <button
            type="button"
            aria-label="AI search"
            disabled
            className={`flex h-[34px] w-[34px] shrink-0 items-center justify-center ${styles.glassWidget}`}
            style={{ borderRadius: '10px', opacity: 0.7, cursor: 'default' }}
          >
            <Sparkles size={13} className="text-[#FAF7EF]" style={{ opacity: 0.65 }} />
          </button>
        </div>

        {/* ROW 1 — CATEGORY TABS */}
        <div className={`${styles.categoryScroll} mt-3 mb-[10px]`}>
          {categoryTabs.map((tab) => {
            const isActive = activeCategory === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategory(tab.id)}
                className={`${styles.categoryTab} ${isActive ? styles.categoryTabActive : ''}`}
              >
                <span
                  className={`${styles.categoryTabLabel} ${isActive ? styles.categoryTabLabelActive : ''}`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* ROW 2 — FILTER ROW */}
        <div className="mb-3 flex items-center justify-between">
          <p
            className="text-[10px] uppercase text-[#FAF7EF]"
            style={{ opacity: 0.35, letterSpacing: '1.5px' }}
          >
            302031 items
          </p>

          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setIsPriceDropdownOpen((open) => !open)}
              className={`flex cursor-pointer items-center gap-[6px] transition-all duration-200 ${styles.glassWidget}`}
              style={{
                borderRadius: '10px',
                padding: '7px 12px',
              }}
            >
              <span className="text-[10px] font-medium text-[#FAF7EF]">
                {activeRangeLabel}
              </span>
              <ChevronDown
                size={12}
                className="text-[#FAF7EF]"
                style={{
                  opacity: 0.6,
                  transform: isPriceDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                }}
              />
            </button>

            {isPriceDropdownOpen && (
              <div
                className={`absolute right-0 z-50 overflow-hidden ${styles.glassWidget}`}
                style={{
                  top: 'calc(100% + 6px)',
                  background: 'rgba(38,48,59,0.45)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  borderRadius: '12px',
                  padding: '6px',
                  minWidth: '160px',
                }}
              >
                {priceRanges.map((range) => {
                  const isActive = activePriceRange === range.id;

                  return (
                    <button
                      key={range.id}
                      type="button"
                      onClick={() => {
                        setActivePriceRange(range.id);
                        setIsPriceDropdownOpen(false);
                      }}
                      className="w-full cursor-pointer whitespace-nowrap rounded-lg text-left text-[11px] transition-all duration-150"
                      style={{
                        padding: '9px 12px',
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? '#FAF7EF' : 'rgba(250,247,239,0.65)',
                        background: isActive
                          ? 'rgba(250,247,239,0.1)'
                          : 'transparent',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background =
                            'rgba(250,247,239,0.05)';
                          e.currentTarget.style.color = 'rgba(250,247,239,0.9)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = 'rgba(250,247,239,0.65)';
                        }
                      }}
                    >
                      {range.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* PRODUCTS GRID */}
        {filteredProducts.length === 0 ? (
          <p
            className="py-10 text-center text-[12px] text-white"
            style={{ opacity: 0.45 }}
          >
            No items match your filters
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className={`flex flex-col overflow-hidden ${styles.glassWidget}`}
                style={{
                  borderRadius: '14px',
                }}
              >
                <div
                  className={`relative mx-2 mt-2 flex h-[110px] w-[calc(100%-16px)] items-center justify-center overflow-hidden rounded-[10px] ${styles.productImageArea}`}
                >
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="175px"
                    />
                  ) : (
                    <span
                      className="text-[11px] uppercase tracking-[1.5px] text-[#FAF7EF]"
                      style={{ opacity: 0.35 }}
                    >
                      {product.category}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1 p-3">
                  <p className="text-[11px] font-medium leading-tight text-[#FAF7EF]">
                    {product.name}
                  </p>
                  <p
                    className="text-[9px] uppercase text-[#FAF7EF]"
                    style={{ opacity: 0.4, letterSpacing: '1px' }}
                  >
                    {product.category}
                  </p>
                  <p className="text-[12px] font-medium text-[#FAF7EF]">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppPageLayout>
  );
}
