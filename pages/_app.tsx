import '@/src/styles/globals.css';
import type { AppProps } from 'next/app';
import { FellowNavbar } from '@/src/components/ui/navbar';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <FellowNavbar />
      <Component {...pageProps} />
    </>
  );
}
