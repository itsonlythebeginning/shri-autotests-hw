import styles from './Main.module.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import AnalystPage from '../../Pages/AnalystPage/AnalystPage.jsx';
import HistoryPage from '../../Pages/HistoryPage/HistoryPage.jsx';
import GeneratorPage from '../../Pages/GeneratorPage/GeneratorPage.jsx';
export default function Main() {
  return (
    <main className={styles.container}>
      <Routes>
        <Route path="/" element={<Navigate to="/upload" replace />} />
        <Route path="/upload" element={<AnalystPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/generator" element={<GeneratorPage />} />
      </Routes>
    </main>
  );
}
