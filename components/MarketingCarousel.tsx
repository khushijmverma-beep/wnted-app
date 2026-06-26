const WIDGETS = [
  {
    label: 'Track spending',
    title: 'Know where every dollar goes',
    body: 'Auto-categorize purchases and see your habits at a glance.',
  },
  {
    label: 'Set goals',
    title: 'Save for what you want',
    body: 'Fund wishlist items with smart weekly targets.',
  },
  {
    label: 'Price alerts',
    title: 'Buy at the right moment',
    body: 'Get notified when items drop to your target price.',
  },
];

function MarketingCard({
  label,
  title,
  body,
}: {
  label: string;
  title: string;
  body: string;
}) {
  return (
    <div
      className="shrink-0 w-[200px] rounded-[20px] p-4"
      style={{
        background: 'rgba(62, 78, 96, 0.32)',
        border: '1px solid rgba(250, 247, 239, 0.14)',
      }}
    >
      <p className="text-[10px] font-medium uppercase tracking-[1.5px] text-[rgba(250,247,239,0.45)]">
        {label}
      </p>
      <p className="mt-2 text-[14px] font-medium leading-[1.35] text-[#FAF7EF]">
        {title}
      </p>
      <p className="mt-1.5 text-[12px] font-normal leading-[1.5] text-[rgba(250,247,239,0.5)]">
        {body}
      </p>
    </div>
  );
}

export default function MarketingCarousel() {
  const items = [...WIDGETS, ...WIDGETS];

  return (
    <section className="relative z-10 mt-10 overflow-hidden px-6">
      <div className="flex w-max animate-marquee gap-3 hover:[animation-play-state:paused]">
        {items.map((widget, index) => (
          <MarketingCard
            key={`${widget.label}-${index}`}
            label={widget.label}
            title={widget.title}
            body={widget.body}
          />
        ))}
      </div>
    </section>
  );
}
