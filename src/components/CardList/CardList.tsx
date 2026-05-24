import type { KeyboardEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { Item } from '../../types/types';
import {
  selectItems,
  selectToggleItem,
  useSelectedItemsStore,
} from '../../store/selectedItemsStore';
import Card from '../Card/Card';
import './CardList.css';

interface CardListProps {
  items: Item[];
}

export default function CardList({ items }: CardListProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedItems = useSelectedItemsStore(selectItems);
  const toggleSelectedItem = useSelectedItemsStore(selectToggleItem);
  const page = searchParams.get('page') || '1';

  function openDetails(itemId: number) {
    navigate(`/details/${itemId}?page=${page}`);
  }

  function handleCardKeyDown(event: KeyboardEvent<HTMLDivElement>, itemId: number) {
    if (event.target !== event.currentTarget) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openDetails(itemId);
    }
  }

  return (
    <ul className="card-list">
      {items.map((item) => (
        <li key={item.id}>
          <div
            role="button"
            tabIndex={0}
            className="card-button"
            onClick={() => openDetails(item.id)}
            onKeyDown={(event) => handleCardKeyDown(event, item.id)}
          >
            <Card
              item={item}
              checked={Boolean(selectedItems[item.id])}
              onSelectChange={() => toggleSelectedItem(item)}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
