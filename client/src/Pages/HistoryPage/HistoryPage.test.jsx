import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import HistoryPage from './HistoryPage';
import useAppStore from '../../store/useAppStore';

const mockedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

vi.mock('../../components/Modal/Modal.jsx', () => ({
  default: ({ children, onClose, actionBar }) => (
    <div data-testid="modal">
      <div data-testid="modal-content">{children}</div>
      <div onClick={onClose} data-testid="modal-close-button">
        Close
      </div>
      {actionBar}
    </div>
  ),
}));

const initialStoreState = useAppStore.getState();

const mockHistory = [
  {
    id: '1',
    fileName: 'data-alpha.csv',
    timestamp: '2025-06-27 10:00',
    error: false,
    results: [
      {
        total_spend_galactic: 10000.5,
        rows_affected: 50,
        less_spent_at: '123',
        big_spent_civ: 'humans',
        less_spent_civ: 'monsters',
        big_spent_at: '321',
        big_spent_value: 999.9,
        average_spend_galactic: 200.1,
      },
    ],
  },
  {
    id: '2',
    fileName: 'data-beta.csv',
    timestamp: '2025-06-27 11:00',
    error: true,
    results: [],
  },
];

describe('HistoryPage', () => {
  beforeEach(() => {
    act(() => {
      useAppStore.setState(initialStoreState, true);
    });
    mockedNavigate.mockClear();

    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';
    document.body.appendChild(modalContainer);
  });

  it('открывает и закрывает модальное окно с данными при клике на элемент истории', async () => {
    const user = userEvent.setup();
    act(() => {
      useAppStore.setState({ aggregateHistory: mockHistory });
    });

    render(
      <MemoryRouter>
        <HistoryPage />
      </MemoryRouter>
    );

    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();

    const historyItem = screen.getByText('data-alpha.csv');
    await user.click(historyItem);

    const modal = await screen.findByTestId('modal');
    expect(modal).toBeInTheDocument();

    expect(screen.getByTestId('modal-content')).toHaveTextContent(
      'общие расходы в галактических кредитах'
    );
    expect(screen.getByTestId('modal-content')).toHaveTextContent('200.1');

    const closeButton = screen.getByText('✖');
    await user.click(closeButton);

    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });
});
