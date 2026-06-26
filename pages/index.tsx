import Head from 'next/head';
import dynamic from 'next/dynamic';

const WelcomeScreen = dynamic(() => import('@/components/WelcomeScreen'), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      <Head>
        <title>Wnted</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <WelcomeScreen />
    </>
  );
}
