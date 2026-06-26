import BottomNav from './BottomNav';

export default function AppPageLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#26303B] flex items-center justify-center font-clash">
      <div
        className="relative overflow-hidden"
        style={{
          width: '390px',
          height: '844px',
          borderRadius: '40px',
          border: '1px solid rgba(250,247,239,0.08)',
        }}
      >
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/background.png')" }}
          />
          <div
            className="absolute inset-0"
            style={{
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
          />
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(13,17,23,0.38)' }}
          />
        </div>

        <div className="relative z-10 h-full pb-[84px]">{children}</div>
        <BottomNav />
      </div>
    </div>
  );
}
