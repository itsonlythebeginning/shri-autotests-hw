import styles from './Boxes.module.css';
import { dayOfYearToDate } from '../utils/dayOfYearToDate.js';

export default function Boxes({ title, subTitle }) {
  if (
    subTitle === 'день года с минимальными расходами' ||
    subTitle === 'день года с максимальными расходами'
  ) {
    return (
      <div className={styles.wrapper}>
        <h2 className={styles.title}>{dayOfYearToDate(Number(title))}</h2>
        <h3 className={styles.subTitle}>{subTitle}</h3>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>{title}</h2>
      <h3 className={styles.subTitle}>{subTitle}</h3>
    </div>
  );
}
