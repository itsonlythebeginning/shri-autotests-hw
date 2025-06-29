import styles from './Analyst.module.css';
import { useState } from 'react';
import UploadField from '../../components/UploadField/UploadField.jsx';
import Highlights from '../../components/Highlights/Highlights.jsx';

export default function AnalystPage() {
  const [results, setResults] = useState([]);

  return (
    <>
      <div className={styles.textWrapper}>
        <p className={styles.title}>
          Загрузите <span className={styles.subTitle}>csv</span> файл и получите
          <span className={styles.subTitle}> полную информацию</span> о нём за
          сверхнизкое время
        </p>
      </div>
      <UploadField results={results} setResults={setResults} />
      <Highlights results={results} />
    </>
  );
}
