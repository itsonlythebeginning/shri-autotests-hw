import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Button from './Button.jsx';

describe('Button component', () => {
  it('отображается с заголовком по умолчанию, если заголовок не указан', () => {
    render(<Button />);
    expect(screen.getByText('Загрузить файл')).toBeInTheDocument();
  });

  it('рендерится с указанным заголовком', () => {
    render(<Button title="Нажми меня" />);
    expect(screen.getByText('Нажми меня')).toBeInTheDocument();
    expect(screen.queryByText('Загрузить файл')).not.toBeInTheDocument();
  });

  it('показывает загрузчик (loader), когда isLoading имеет значение true', () => {
    render(<Button isLoading={true} title="Загрузка" />);
    const button = screen.getByRole('button');
    const loader = button.querySelector('[data-test-id="loader"]');

    expect(loader).toBeInTheDocument();
    expect(screen.queryByText('Загрузка')).not.toBeInTheDocument();
  });

  it('передает другие props, такие как disabled', () => {
    render(<Button disabled={true} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
