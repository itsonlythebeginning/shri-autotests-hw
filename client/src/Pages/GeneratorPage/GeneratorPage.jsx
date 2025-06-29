import styles from '../../components/Button/Button.module.css';
import stylesTwo from './GeneratorPage.module.css';
import { useState } from 'react';
import Button from '../../components/Button/Button.jsx';
export default function GeneratorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);
  const [isProcessed, setIsProcessed] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    setIsError(null);

    setIsProcessed(false);

    try {
      const params = new URLSearchParams({
        size: '0.1',
        withErrors: 'off',
        maxSpend: '1000',
      });

      const response = await fetch(`http://localhost:3000/report?${params}`);
      if (!response.ok) {
        throw new Error('Ошибка генерации отчета');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'report.csv';
      document.body.appendChild(link);
      link.click();
      link.remove();

      setIsProcessed(true);
    } catch (err) {
      setIsError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setIsLoading(false);
    setIsError(null);
    setIsProcessed(false);
  };

  const status = isProcessed
    ? 'processed'
    : isError
      ? 'error'
      : isLoading
        ? 'loading'
        : 'active';

  return (
    <div className={stylesTwo.wrapper}>
      <div className={stylesTwo.btnWrapper}>
        <Button
          onClick={handleGenerate}
          title={
            isError ? 'Ошибка!' : isProcessed ? 'Done!' : 'Начать генерацию'
          }
          className="upload"
          status={status}
          isLoading={isLoading}
        />
        {(isProcessed || isError) && !isLoading && (
          <button className={stylesTwo.deleteBtn} onClick={handleReset}>
            ✖
          </button>
        )}
      </div>
      <p
        className={`${stylesTwo.subtitle} ${
          isError ? styles.error : isProcessed ? stylesTwo.success : ''
        }`}
      >
        {isLoading
          ? 'идет процесс генерации'
          : isError
            ? 'упс, не то...'
            : isProcessed
              ? 'файл сгенерирован!'
              : ''}
      </p>
    </div>
  );
}
