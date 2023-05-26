import '/styles/globals.css';
import { Component } from 'react';
import type * as app from 'next/app';
export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}


