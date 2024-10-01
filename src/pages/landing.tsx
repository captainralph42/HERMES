import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from '../styles/Landing.module.css';

const Landing = () => {
  const router = useRouter();

  const handleAccessDApp = () => {
    router.push('/app');
  };

  return (
    <div className={styles.container}>
      <div className={styles.backgroundImage}>
        <Image
          src="/images/landing_page.png"
          alt="Background"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
      </div>

      <header className={styles.header}>
        <h1 className={styles.title}>Welcome to Hermes</h1>
        <p className={styles.slogan}>Where code meets creativity</p>
      </header>

      <div className={styles.content}>
        <p className={styles.description}>
        Welcome to Hermes, the dApp that combines fun and blockchain. Here, you can generate totally random punchlines and compliments—often sarcastic, always tied to the world of crypto. And the best part? Each punchline is minted as an NFT, so you get a unique piece to add to your wallet.
        It’s simple: you adjust the sliders to tweak the tone (more humor, love, subtlety, or even the length), the AI does the rest, and your NFT is ready to be collected or shared. If you're looking for some laughs while riding the crypto wave, Hermes is the perfect place for you.
        </p>
        <button onClick={handleAccessDApp} className={styles.accessButton}>
          Enter the realm
        </button>
      </div>
    </div>
  );
};

export default Landing;
