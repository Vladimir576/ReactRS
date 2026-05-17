import { useEffect, useState } from 'react';
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useLocation,
  useMatch,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import './App.css';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import Header from './components/Header/Header';
import Main from './components/Main/Main';
import Details from './pages/Details';
import { useLocalStorage } from './hooks/useLocalStorage';
import { fetchItems } from './services/itemService';
import type { Item } from './types/types';

const STORAGE_KEY = 'searchTerm';
const LOAD_ERROR_MESSAGE =
  "Something went wrong. We couldn't process your request. Please try again later.";

function getPage(value: string | null) {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

function ErrorTester({ active }: { active: boolean }) {
  if (active) {
    throw new Error('Simulated application error');
  }

  return null;
}

function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const detailsMatch = useMatch('/details/:detailsId');
  const page = getPage(searchParams.get('page'));
  const [searchTerm, setSearchTerm] = useLocalStorage(STORAGE_KEY, '');
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (searchParams.get('page') !== String(page)) {
      setSearchParams({ page: String(page) }, { replace: true });
    }
  }, [page, searchParams, setSearchParams]);

  useEffect(() => {
    let ignore = false;

    async function loadItems() {
      setLoading(true);
      setErrorMessage('');

      try {
        const loadedItems = await fetchItems({ query: searchTerm, page });

        if (!ignore) {
          setItems(loadedItems);
          setLoading(false);
        }
      } catch {
        if (!ignore) {
          setItems([]);
          setErrorMessage(LOAD_ERROR_MESSAGE);
          setLoading(false);
        }
      }
    }

    void loadItems();

    return () => {
      ignore = true;
    };
  }, [searchTerm, page]);

  function handleSearch(value: string) {
    const trimmedValue = value.trim();

    setSearchTerm(trimmedValue);
    navigate('/?page=1');
  }

  function handleRetry() {
    setLoading(true);
    setErrorMessage('');

    fetchItems({ query: searchTerm, page })
      .then((loadedItems) => {
        setItems(loadedItems);
        setLoading(false);
      })
      .catch(() => {
        setItems([]);
        setErrorMessage(LOAD_ERROR_MESSAGE);
        setLoading(false);
      });
  }

  function handlePageChange(newPage: number) {
    if (newPage < 1) {
      return;
    }

    navigate(`${location.pathname}?page=${newPage}`);
  }

  return (
    <Main
      searchTerm={searchTerm}
      loading={loading}
      errorMessage={errorMessage}
      items={items}
      onSearch={handleSearch}
      onRetry={handleRetry}
      page={page}
      onPageChange={handlePageChange}
      hasDetails={Boolean(detailsMatch)}
    />
  );
}

function AboutPage() {
  return (
    <main className="simple-page">
      <h2>About this app</h2>
      <p>An application created using React and main tools. Created by Vladimir</p>
      <a
        href="https://rs.school/courses/reactjs"
        target="_blank"
        rel="noreferrer"
      >
        RS School React course
      </a>
    </main>
  );
}

function NotFoundPage() {
  return (
    <main className="simple-page">
      <h2>404</h2>
      <p>Page was not found.</p>
      <Link to="/?page=1">Back to the app</Link>
    </main>
  );
}

function AppContent() {
  const [simulateError, setSimulateError] = useState(false);

  return (
    <ErrorBoundary onReset={() => setSimulateError(false)}>
      <div className="app-shell">
        <Header onTriggerError={() => setSimulateError(true)} />
        <Routes>
          <Route path="/" element={<HomePage />}>
            <Route path="details/:detailsId" element={<Details />} />
          </Route>
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <ErrorTester active={simulateError} />
      </div>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
