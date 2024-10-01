import React from 'react';
import Head from 'next/head';
import PunchlineBackgroundGenerator from '@/components/generation/PunchlineGenerator/PunchlineBackgroundGenerator';
import Sidebar from '@/components/layout/Sidebar/Sidebar';
import Title from '@/components/common/Title/Title'; 
import Footer from '@/components/layout/Footer/Footer';
import Popup from '@/components/Popup';

export default function DApp() {
  return (
    <>
      <Head>
        <title>Hermes</title>
      </Head>

      <Popup />

      <Sidebar />

      <main>
        <Title />
        <PunchlineBackgroundGenerator />
      </main>

      <Footer />
    </>
  );
}
