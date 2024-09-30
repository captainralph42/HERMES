import React from 'react';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <p>© 2024 Punchline Generator. All rights reserved.</p>
      <p>This dApp was created as part of Hackathon 1.5 by Just1 and CaptainRalph.</p>
    </footer>
  );
};

export default Footer;
