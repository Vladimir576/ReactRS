import { Link, useSearchParams } from 'react-router-dom';
import type { Item } from '../../types/types';
import Card from '../Card/Card';
import './CardList.css';

interface CardListProps {
  items: Item[];
}

export default function CardList({ items }: CardListProps) {
  const [searchParams] = useSearchParams();
  const page = searchParams.get('page') || '1';

  return (
    <ul className="card-list">
      {items.map((item) => (
        <li key={item.id}>
          <Link className="card-link" to={`/details/${item.id}?page=${page}`}>
            <Card item={item} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
