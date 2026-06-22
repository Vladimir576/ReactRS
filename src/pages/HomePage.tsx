import Main from '../components/Main/Main';
import { useDashboardItems } from '../hooks/useDashboardItems';

export default function HomePage() {
  const dashboard = useDashboardItems();

  return <Main {...dashboard} />;
}
