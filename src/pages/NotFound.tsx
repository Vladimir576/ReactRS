import { Link } from '@/i18n/navigation';

export default function NotFound() {
  return (
    <main className="simple-page">
      <h2>404</h2>
      <p>Page was not found.</p>
      <Link href="/">Back to the app</Link>
    </main>
  );
}
