import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="simple-page">
      <h2>404</h2>
      <p>Page was not found.</p>
      <Link to="/?page=1">Back to the app</Link>
    </main>
  );
}
