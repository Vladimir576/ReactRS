import { Link } from '@/i18n/navigation';

export const metadata = {
  title: '404 - Not Found',
};

export default function NotFoundPage() {
  return (
    <main className="simple-page">
      <h2>404 - Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      <Link href="/">Go back home</Link>
    </main>
  );
}
