import styles from './HistoryPage.module.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useAppStore from '../../store/useAppStore.js';
import HistoryItem from '../../components/HistoryItem/HistoryItem.jsx';
import Boxes from '../../components/Boxes/Boxes.jsx';
import Modal from '../../components/Modal/Modal.jsx';
export default function HistoryPage() {
  const aggregateHistory = useAppStore((state) => state.aggregateHistory);
  const resetHistory = useAppStore((state) => state.resetHistory);

  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [content, setContent] = useState([]);

  const handleOpen = (id) => {
    const current = aggregateHistory.find((item) => item.id === id);
    setContent(current.results);
    setShowModal(true);
  };
  const handleClose = () => setShowModal(false);

  const modalActionBar = (
    <button onClick={handleClose} className={styles.btnClose}>
      ✖
    </button>
  );

  return (
    <div>
      <div className={styles.wrapper}>
        {aggregateHistory?.map(({ id, fileName, timestamp, error }) => (
          <HistoryItem
            key={id}
            fileName={fileName}
            timestamp={timestamp}
            error={error}
            id={id}
            handleOpen={() => handleOpen(id)}
          />
        ))}
      </div>

      <div className={styles.wrapper}>
        <button
          onClick={() => navigate('/generator')}
          className={styles.generateBtn}
        >
          Сгенерировать больше
        </button>
        <button onClick={resetHistory} className={styles.clearBtn}>
          Очистить всё
        </button>
      </div>

      <div>
        {showModal && (
          <Modal onClose={handleClose} actionBar={modalActionBar}>
            {content.map((item, index) => {
              return (
                <div key={index}>
                  <Boxes
                    className={styles.block}
                    title={item.total_spend_galactic.toFixed(1)}
                    subTitle="общие расходы в галактических кредитах"
                    style={{ border: '5px solid black' }}
                  />
                  <Boxes
                    className={styles.block}
                    title={item.rows_affected}
                    subTitle="количество обработанных записей"
                  />
                  <Boxes
                    className={styles.block}
                    title={item.less_spent_at}
                    subTitle="день года с минимальными расходами"
                  />
                  <Boxes
                    className={styles.block}
                    title={item.big_spent_civ}
                    subTitle="цивилизация с максимальными расходами"
                  />
                  <Boxes
                    className={styles.block}
                    title={item.less_spent_civ}
                    subTitle="цивилизация с минимальными расходами"
                  />
                  <Boxes
                    className={styles.block}
                    title={item.big_spent_at}
                    subTitle="день года с максимальными расходами"
                  />
                  <Boxes
                    className={styles.block}
                    title={item.big_spent_value}
                    subTitle="максимальная сумма расходов за день"
                  />
                  <Boxes
                    className={styles.block}
                    title={item.average_spend_galactic.toFixed(1)}
                    subTitle="средние расходы в галактических кредитах"
                  />
                </div>
              );
            })}
          </Modal>
        )}
      </div>
    </div>
  );
}
