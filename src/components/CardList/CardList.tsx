'use client';

import type { KeyboardEvent } from 'react';
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
  onSelectItem: (itemId: number) => void;
}

export default function CardList({ items, onSelectItem }: CardListProps) {
  const selectedItems = useSelectedItemsStore(selectItems);
  const toggleSelectedItem = useSelectedItemsStore(selectToggleItem);

  function handleCardKeyDown(event: KeyboardEvent<HTMLDivElement>, itemId: number) {
    if (event.target !== event.currentTarget) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelectItem(itemId);
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
            onClick={() => onSelectItem(item.id)}
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
