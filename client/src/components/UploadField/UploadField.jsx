import styles from './UploadFiels.module.css';
import { useRef, useState } from 'react';
import Button from '../Button/Button.jsx';
import useAppStore from '../../store/useAppStore.js';

export default function UploadField({ results, setResults }) {
  const filePicker = useRef(null);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);

  const { addHistoryEntry } = useAppStore();

  const lineCount = 10000;
  const url = `http://localhost:3000/aggregate?rows=${lineCount}`;

  const validateFile = (selectedFile) => {
    if (!selectedFile) {
      return 'Файл не выбран';
    }
    const extension = selectedFile.name.split('.').pop().toLowerCase();
    if (extension !== 'csv') {
      return selectedFile.name;
    }
    return null;
  };

  const handleReset = () => {
    setFile(null);
    setIsError(null);
    setResults([]);
    setIsProcessed(false);
  };

  const handlePick = () => {
    if (file || isError) {
      return;
    }
    filePicker.current.click();
  };

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files?.[0];
    const err = validateFile(selectedFile);
    if (err) {
      setIsError(err);
      setFile(null);
      return;
    }
    setIsError(null);
    setFile(selectedFile);
  };

  const handleDragEnter = (event) => {
    if (file || isError) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (event) => {
    if (file || isError) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (event) => {
    if (file || isError) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    setDragActive(true);
  };

  const handleDrop = (event) => {
    if (file || isError) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);

    const droppedFile = event.dataTransfer.files[0];
    const err = validateFile(droppedFile);
    if (err) {
      setIsError(err);
      setFile(null);
      return;
    }

    setIsError(null);
    setFile(droppedFile);
  };

  const handleProcessClick = async () => {
    if (!file) {
      setIsError('Выберите файл');
      return;
    }

    setIsError(null);
    setIsLoading(true);
    setResults([]);

    const formatDate = (date) => {
      const d = new Date(date);
      return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1)
        .toString()
        .padStart(2, '0')}.${d.getFullYear()}`;
    };

    const baseHistoryEntry = {
      fileName: file.name,
      timestamp: formatDate(new Date()),
    };

    let lastResult = null;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error('Ошибка сервера: ' + errorText);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer = buffer + decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop();

        for (const line of lines) {
          if (line.trim()) {
            try {
              const obj = JSON.parse(line);
              setResults([obj]);
              lastResult = obj;
            } catch (err) {
              console.error('Ошибка парсинга JSON:', err);
            }
          }
        }
      }

      if (buffer.trim()) {
        try {
          const obj = JSON.parse(buffer);
          setResults([obj]);
          lastResult = obj;
        } catch (err) {
          console.error('Ошибка парсинга JSON:', err);
        }
      }

      addHistoryEntry({
        ...baseHistoryEntry,
        status: 'успешно',
        error: null,
        results: lastResult ? [lastResult] : [],
        id: Date.now(),
      });
    } catch (err) {
      setIsError(err.message);

      addHistoryEntry({
        ...baseHistoryEntry,
        status: 'неуспешно',
        error: err.message,
        results: lastResult ? [lastResult] : [],
        id: Date.now(),
      });
    } finally {
      setIsLoading(false);
      setIsProcessed(true);
    }
  };

  return (
    <>
      <div
        className={`${styles.wrapper} ${dragActive ? styles.dragActive : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className={styles.btnWrapper}>
          <Button
            onClick={handlePick}
            title={file?.name || isError}
            className="upload"
            status={
              isProcessed
                ? 'processed'
                : isError
                  ? 'error'
                  : file
                    ? 'file'
                    : 'success'
            }
            isLoading={isLoading}
          />
          {(file || isError || isProcessed) && !isLoading && (
            <button className={styles.deleteBtn} onClick={handleReset}>
              ✖
            </button>
          )}
        </div>
        <input
          type="file"
          ref={filePicker}
          data-testid="file-input"
          onChange={handleFileUpload}
          accept=".csv"
          className={styles.hidden}
        />
        <p
          className={`${styles.subtitle} ${
            isError ? styles.error : isProcessed ? styles.success : ''
          }`}
        >
          {isLoading
            ? 'Идет парсинг'
            : isError
              ? 'упс, не то...'
              : isProcessed
                ? 'Готово!'
                : !file
                  ? 'или перетащите сюда!'
                  : 'файл загружен'}
        </p>
      </div>
      {!isError && results.length === 0 && (
        <div className={styles.bottomWrapper}>
          <Button
            onClick={handleProcessClick}
            title="Отправить"
            disabled={!file}
            className="send"
            status={file ? 'active' : ''}
          />
        </div>
      )}
    </>
  );
}
