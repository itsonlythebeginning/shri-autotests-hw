import styles from './HistoryItem.module.css';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import HistoryItem from './HistoryItem.jsx';
import useAppStore from '../../store/useAppStore.js';

const mockedRemoveHistoryEntry = vi.fn();
vi.mock('../../store/useAppStore.js', () => ({
  default: vi.fn(() => ({
    removeHistoryEntry: mockedRemoveHistoryEntry,
  })),
}));

describe('HistoryItem component', () => {
  const mockProps = {
    fileName: 'test-file.csv',
    timestamp: '2025-06-29',
    error: false,
    id: '123',
    handleOpen: vi.fn(),
  };

  beforeEach(() => {
    mockedRemoveHistoryEntry.mockClear();
    mockProps.handleOpen.mockClear();
    useAppStore.mockClear();
  });

  it('корректно отображает информацию о файле', () => {
    render(<HistoryItem {...mockProps} />);
    expect(screen.getByText('test-file.csv')).toBeInTheDocument();
    expect(screen.getByText('2025-06-29')).toBeInTheDocument();
  });

  it('отображает сообщение об успешном выполнении, если нет ошибок', () => {
    render(<HistoryItem {...mockProps} error={false} />);
    const successMessage = screen.getByText('Обработан успешно');
    const errorMessage = screen.getByText('Не удалось обработать');

    expect(successMessage).not.toHaveClass(styles.error);
    expect(errorMessage).toHaveClass(styles.error);
  });

  it('отображает сообщение об ошибке, когда свойство error имеет значение true', () => {
    render(<HistoryItem {...mockProps} error={true} />);
    const successMessage = screen.getByText('Обработан успешно');
    const errorMessage = screen.getByText('Не удалось обработать');

    expect(successMessage).toHaveClass(styles.error);
    expect(errorMessage).not.toHaveClass(styles.error);
  });
});
