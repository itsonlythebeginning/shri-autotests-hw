import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import GeneratorPage from './GeneratorPage.jsx';

global.fetch = vi.fn();
window.URL.createObjectURL = vi.fn();
window.URL.revokeObjectURL = vi.fn();

describe('GeneratorPage component', () => {
  beforeEach(() => {
    fetch.mockClear();
    window.URL.createObjectURL.mockClear();
  });

  it('начальное состояние: кнопка генерации рендеров', () => {
    render(<GeneratorPage />);
    expect(
      screen.getByRole('button', { name: 'Начать генерацию' })
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/идет процесс генерации/i)
    ).not.toBeInTheDocument();
  });

  it('сбрасывает состояние при нажатии кнопки сброса', async () => {
    const user = userEvent.setup();
    fetch.mockResolvedValue({ ok: false });

    render(<GeneratorPage />);

    await user.click(screen.getByRole('button', { name: 'Начать генерацию' }));

    const resetButton = await screen.findByRole('button', { name: '✖' });

    await user.click(resetButton);

    expect(
      screen.getByRole('button', { name: 'Начать генерацию' })
    ).toBeInTheDocument();
    expect(screen.queryByText(/упс, не то/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: '✖' })
    ).not.toBeInTheDocument();
  });
});
