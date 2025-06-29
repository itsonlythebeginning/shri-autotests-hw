import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Highlights from './Highlights.jsx';

vi.mock('../Highlight/Highlight.jsx', () => ({
  default: ({ title, subTitle }) => (
    <div data-testid="highlight">
      <span>{title}</span>
      <span>{subTitle}</span>
    </div>
  ),
}));

const mockResults = [
  {
    total_spend_galactic: 1000,
    rows_affected: 50,
    less_spent_at: '123',
    big_spent_civ: 'humans',
    less_spent_civ: 'monsters',
    big_spent_at: '321',
    big_spent_value: 999.9,
    average_spend_galactic: 200.1,
  },
];

describe('Highlights component', () => {
  it('отображает шаблон, когда массив результатов пуст', () => {
    render(<Highlights results={[]} />);
    expect(screen.getByText('Здесь')).toBeInTheDocument();
    expect(screen.getByText('появятся хайлайты')).toBeInTheDocument();
    expect(screen.queryByTestId('highlight')).not.toBeInTheDocument();
  });

  it('отображает список компонентов Highlight если массив результатов не пуст', () => {
    render(<Highlights results={mockResults} />);

    expect(screen.queryByText('Здесь')).not.toBeInTheDocument();

    const highlightElements = screen.getAllByTestId('highlight');
    expect(highlightElements.length).toBe(8);

    expect(screen.getByText('1000.0')).toBeInTheDocument();
    expect(
      screen.getByText('общие расходы в галактических кредитах')
    ).toBeInTheDocument();
  });
});
