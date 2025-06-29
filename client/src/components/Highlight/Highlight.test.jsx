import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Highlight from './Highlight.jsx';
import { dayOfYearToDate } from '../utils/dayOfYearToDate.js';

vi.mock('../utils/dayOfYearToDate.js', () => ({
  dayOfYearToDate: vi.fn((day) => `formatted-date-for-${day}`),
}));

describe('Highlight component', () => {
  it('правильно отображает заголовок и подзаголовок для данных', () => {
    render(<Highlight title="Value 123" subTitle="Some description" />);
    expect(screen.getByText('Value 123')).toBeInTheDocument();
    expect(screen.getByText('Some description')).toBeInTheDocument();
  });

  it('вызывает dayOfYearToDate для "день года с минимальными расходами"', () => {
    render(
      <Highlight title="150" subTitle="день года с минимальными расходами" />
    );

    expect(dayOfYearToDate).toHaveBeenCalledWith(150);
    expect(screen.getByText('formatted-date-for-150')).toBeInTheDocument();
  });

  it('вызывает dayOfYearToDate для "день года с максимальными расходами"', () => {
    render(
      <Highlight title="250" subTitle="день года с максимальными расходами" />
    );

    expect(dayOfYearToDate).toHaveBeenCalledWith(250);
    expect(screen.getByText('formatted-date-for-250')).toBeInTheDocument();
  });
});
