import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/Header/Header.jsx';
import Main from './components/Main/Main.jsx';

function App() {
  return (
    <Router>
      <Header />
      <Main />
    </Router>
  );
}

export default App;
