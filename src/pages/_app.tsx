import React from 'react';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { AlephiumWalletProvider } from '@alephium/web3-react';
import { Analytics } from '@vercel/analytics/react';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AlephiumWalletProvider theme="simple-dark" network="testnet" addressGroup={0}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Component {...pageProps} />
      <Analytics />
    </AlephiumWalletProvider>
  );
}
