import BottomNav from './BottomNav';

export default function AppPageLayout({
  children,
}: {
  children?: React.ReactNode;
  phoneBackground?: 'default' | 'ink';
}) {
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
        <div className="relative z-10 h-full pb-[84px]">{children}</div>
        <BottomNav />
      </div>
    </div>
  );
}
