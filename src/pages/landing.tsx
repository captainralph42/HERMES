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
        <button onClick={handleAccessDApp} className={styles.accessButton}>
          Enter the realm
        </button>
      </div>
    </div>
  );
};

export default Landing;
