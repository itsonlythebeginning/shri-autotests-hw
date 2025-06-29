import styles from './HistoryItem.module.css';
import useAppStore from '../../store/useAppStore.js';

export default function HistoryItem({ fileName, timestamp, error, id, handleOpen, }) {

  const removeHistoryEntry = useAppStore((state) => state.removeHistoryEntry);
  const handleDelete = (id) => {
    removeHistoryEntry(id);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.box} onClick={handleOpen}>
        <div className={`${styles.title} ${styles.file}`}>{fileName}</div>
        <div>{timestamp}</div>

        <div
          data-test-id="success-message" className={`${styles.title} ${styles.smile} ${error ? styles.error : ''}`}
        >
          Обработан успешно
        </div>
        <div
          data-test-id="error-message" className={`${styles.title} ${styles.sad} ${!error ? styles.error : ''}`}
        >
          Не удалось обработать
        </div>
      </div>
      <div className={styles.delete} onClick={() => handleDelete(id)}>
        <button className={styles.trash}></button>
      </div>
    </div>
  );
}
