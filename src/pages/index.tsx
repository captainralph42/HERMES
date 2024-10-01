import React from 'react';
import Head from 'next/head';
import PunchlineBackgroundGenerator from '@/components/generation/PunchlineGenerator/PunchlineBackgroundGenerator';
import Sidebar from '@/components/layout/Sidebar/Sidebar';
import Title from '@/components/common/Title/Title'; 
import Footer from '@/components/layout/Footer/Footer';

export default function Home() {
  return (
    <>
      <Head>
        <title>Hermesr</title>
      </Head>
      <Sidebar />

      <main>
        <Title />
        <PunchlineBackgroundGenerator />
      </main>

      <Footer />
    </>
  );
}
