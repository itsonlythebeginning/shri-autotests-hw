import styles from './components/Nav/Nav.module.css';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Main from './components/Main/Main.jsx';
import Nav from './components/Nav/Nav.jsx';

vi.mock('./Pages/AnalystPage/AnalystPage.jsx', () => ({
  default: () => <div>Analyst Page Content</div>,
}));
vi.mock('./Pages/HistoryPage/HistoryPage.jsx', () => ({
  default: () => <div>History Page Content</div>,
}));
vi.mock('./Pages/GeneratorPage/GeneratorPage.jsx', () => ({
  default: () => <div>Generator Page Content</div>,
}));

describe('App Routing', () => {
  const renderAppWithRouter = (initialRoute = '/') => {
    return render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <Nav />
        <Main />
      </MemoryRouter>
    );
  };

  it('перенаправляет с "/" на "/upload" при первоначальной загрузке', () => {
    renderAppWithRouter('/');
    expect(screen.getByText('Analyst Page Content')).toBeInTheDocument();
  });

  it('отображает AnalystPage на маршруте "/upload" и устанавливает активную ссылку', () => {
    renderAppWithRouter('/upload');
    expect(screen.getByText('Analyst Page Content')).toBeInTheDocument();
    const analystLink = screen.getByRole('link', { name: /csv аналитик/i });
    expect(analystLink).toHaveClass(styles.active);
  });

  it('переходит на страницу Истории при нажатии на ссылку', async () => {
    const user = userEvent.setup();
    renderAppWithRouter('/upload');

    const historyLink = screen.getByRole('link', { name: /история/i });
    await user.click(historyLink);

    expect(screen.getByText('History Page Content')).toBeInTheDocument();
    expect(screen.queryByText('Analyst Page Content')).not.toBeInTheDocument();
    expect(historyLink).toHaveClass(styles.active);
  });

  it('переходит на страницу Generator при нажатии на ссылку', async () => {
    const user = userEvent.setup();
    renderAppWithRouter('/upload');

    const generatorLink = screen.getByRole('link', { name: /csv генератор/i });
    await user.click(generatorLink);

    expect(screen.getByText('Generator Page Content')).toBeInTheDocument();
    expect(screen.queryByText('Analyst Page Content')).not.toBeInTheDocument();
    expect(generatorLink).toHaveClass(styles.active);
  });
});
