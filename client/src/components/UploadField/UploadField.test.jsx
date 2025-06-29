import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import UploadField from './UploadField.jsx';

global.fetch = vi.fn(
  () =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          body: createMockReadableStream(['строка1', 'строка2']),
        });
      }, 500);
    })
);

const mockedAddHistoryEntry = vi.fn();
vi.mock('../../store/useAppStore.js', () => ({
  default: () => ({
    addHistoryEntry: mockedAddHistoryEntry,
  }),
}));

const createFile = (name, type) => {
  const file = new File(['(⌐□_□)'], name, { type });
  return file;
};

function createMockStream(chunks) {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(chunk));
      }
      controller.close();
    },
  });
}

describe('UploadField component', () => {
  const mockSetResults = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(Date, 'now').mockReturnValue(123456789);
  });

  it('правильно отображает начальное состояние', () => {
    render(<UploadField results={[]} setResults={mockSetResults} />);
    expect(screen.getByText('Загрузить файл')).toBeInTheDocument();
    expect(screen.getByText('или перетащите сюда!')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Отправить' })).toBeDisabled();
  });

  it('управляет выбором файлов и обновляет UI', async () => {
    const user = userEvent.setup();
    render(<UploadField results={[]} setResults={mockSetResults} />);

    const file = createFile('test.csv', 'text/csv');
    const fileInput = screen.getByTestId('file-input');

    await user.upload(fileInput, file);

    expect(screen.getByText('test.csv')).toBeInTheDocument();
    expect(screen.getByText('файл загружен')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Отправить' })
    ).not.toBeDisabled();
  });

  it('обрабатывает успешную обработку файлов через стримы', async () => {
    const user = userEvent.setup();
    const mockJsonChunk = '{"total_spend_galactic": 100}\n';
    const mockStream = createMockStream([mockJsonChunk]);

    fetch.mockResolvedValue({
      ok: true,
      body: mockStream,
      getReader: () => mockStream.getReader(),
    });

    render(<UploadField results={[]} setResults={mockSetResults} />);

    const file = createFile('data.csv', 'text/csv');
    await user.upload(screen.getByTestId('file-input'), file);

    const sendButton = screen.getByRole('button', { name: 'Отправить' });
    await user.click(sendButton);

    await waitFor(() => {
      expect(mockSetResults).toHaveBeenCalledWith([
        { total_spend_galactic: 100 },
      ]);
      expect(mockedAddHistoryEntry).toHaveBeenCalledWith({
        fileName: 'data.csv',
        timestamp: expect.any(String),
        status: 'успешно',
        error: null,
        results: [{ total_spend_galactic: 100 }],
        id: 123456789,
      });
      expect(screen.getByText('Готово!')).toBeInTheDocument();
    });
  });

  it('обрабатывает ошибку FETCH и добавляет запись об ошибке в историю', async () => {
    const user = userEvent.setup();
    fetch.mockResolvedValue({
      ok: false,
      text: () => Promise.resolve('Internal Server Error'),
    });

    render(<UploadField results={[]} setResults={mockSetResults} />);

    const file = createFile('data.csv', 'text/csv');
    await user.upload(screen.getByTestId('file-input'), file);
    await user.click(screen.getByRole('button', { name: 'Отправить' }));

    await waitFor(() => {
      expect(screen.getByText('упс, не то...')).toBeInTheDocument();
      expect(mockedAddHistoryEntry).toHaveBeenCalledWith(
        expect.objectContaining({
          fileName: 'data.csv',
          status: 'неуспешно',
          error: 'Ошибка сервера: Internal Server Error',
        })
      );
    });
  });
});
