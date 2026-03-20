// Shim layer for Next.js Pages Router
// This will be used when migrating to Next.js

import type { AppProps } from 'next/app';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
