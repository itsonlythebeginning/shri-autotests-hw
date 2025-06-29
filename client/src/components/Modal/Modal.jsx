import styles from './Modal.module.css';
import ReactDOM from 'react-dom';
import { useEffect } from 'react';

export default function Modal({ onClose, children, actionBar }) {
  useEffect(() => {
    document.body.classList.add('modal-open');

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

  return ReactDOM.createPortal(
    <div>
      <div onClick={onClose} className={styles.modalBackdrop}></div>
      <div className={styles.modalContent}>
        <div className={styles.modalBody}>
          {children}
          <div className={styles.modalFooter}>{actionBar}</div>
        </div>
      </div>
    </div>,
    document.querySelector('.modal-container')
  );
}
