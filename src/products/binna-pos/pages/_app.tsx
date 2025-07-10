import React from 'react';
import type { AppProps } from 'next/app';
import POSNavbar from '../components/POSNavbar';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps, router }: AppProps & { router: any }) {
  // Hide navbar on login page
  const hideNavbar = router.pathname === '/login';
  return (
    <>
      {!hideNavbar && <POSNavbar />}
      <Component {...pageProps} />
    </>
  );
}
