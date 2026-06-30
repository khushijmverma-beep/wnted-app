'use client';

import Head from 'next/head';
import AltDesignApp from '@/components/AltDesignApp';

const phoneFrameStyle: React.CSSProperties = {
  width: '390px',
  height: '844px',
  borderRadius: '40px',
  border: '1px solid rgba(250,247,239,0.08)',
  background: '#000000',
};

const phoneShellBackground = '#0f1d36';

export default function Home() {
  return (
    <>
      <Head>
        <title>Wnted</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div
        className="fixed inset-0 flex min-h-screen items-center justify-center font-clash"
        style={{ background: phoneShellBackground }}
      >
        <div className="relative overflow-hidden" style={phoneFrameStyle}>
          <AltDesignApp />
        </div>
      </div>
    </>
  );
}
