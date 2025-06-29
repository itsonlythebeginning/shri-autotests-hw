import styles from './Highlights.module.css';
import Highlight from '../Highlight/Highlight.jsx';

export default function Highlights({ results }) {
  return (
    <div className={styles.wrapper}>
      {results && results.length > 0 ? (
        results.map((item, index) => (
          <div key={index} className={styles.gridContainer}>
            <Highlight
              className={styles.block}
              title={item.total_spend_galactic.toFixed(1)}
              subTitle="общие расходы в галактических кредитах"
            />
            <Highlight
              className={styles.block}
              title={item.rows_affected}
              subTitle="количество обработанных записей"
            />
            <Highlight
              className={styles.block}
              title={item.less_spent_at}
              subTitle="день года с минимальными расходами"
            />
            <Highlight
              className={styles.block}
              title={item.big_spent_civ}
              subTitle="цивилизация с максимальными расходами"
            />
            <Highlight
              className={styles.block}
              title={item.less_spent_civ}
              subTitle="цивилизация с минимальными расходами"
            />
            <Highlight
              className={styles.block}
              title={item.big_spent_at}
              subTitle="день года с максимальными расходами"
            />
            <Highlight
              className={styles.block}
              title={item.big_spent_value}
              subTitle="максимальная сумма расходов за день"
            />
            <Highlight
              className={styles.block}
              title={item.average_spend_galactic.toFixed(1)}
              subTitle="средние расходы в галактических кредитах"
            />
          </div>
        ))
      ) : (
        <div className={`${styles.wrapper} ${styles.wrapperFull}`}>
          <h2 className={styles.title}>Здесь</h2>
          <h3 className={styles.title}>появятся хайлайты</h3>
        </div>
      )}
    </div>
  );
}
