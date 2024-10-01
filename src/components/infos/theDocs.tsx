import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import styles from '../../styles/docs.module.css';

const TheDocs = () => {
  const [content, setContent] = useState('');

  useEffect(() => {
    fetch('/api/docs')
      .then((response) => response.json())
      .then((data) => setContent(data.content))
      .catch((error) => console.error('Error fetching the Markdown file:', error));
  }, []);

  return (
    <div className={styles.docsContainer}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};

export default TheDocs;
