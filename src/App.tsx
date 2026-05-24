import { HashRouter } from 'react-router-dom';
import './App.css';
import AppShell from './components/AppShell/AppShell';
import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <AppShell />
      </HashRouter>
    </ThemeProvider>
  );
}
