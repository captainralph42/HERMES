import React from 'react'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { AlephiumWalletProvider } from '@alephium/web3-react'
import { Analytics } from '@vercel/analytics/react'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AlephiumWalletProvider theme="simple-dark" network="testnet" addressGroup={0}>
      <Component {...pageProps} />
      <Analytics />
    </AlephiumWalletProvider>
  )
}
