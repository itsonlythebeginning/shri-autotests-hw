import styles from './Button.module.css';
export default function Button({ title, className, status, isLoading, ...rest }) {
  const baseClass = styles[className] || '';
  const statusClass = status && styles[status] ? styles[status] : '';

  const classes = `${baseClass} ${statusClass}`.trim();

  return (
    <button {...rest} className={classes}>
      {isLoading ? (
        <div className={styles.loader} data-test-id='loader'></div>
      ) : (
        title || 'Загрузить файл'
      )}
    </button>
  );
}