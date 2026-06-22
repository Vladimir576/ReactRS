'use client';

import type { MouseEvent } from 'react';
import type { Item } from '../../types/types';
import './Card.css';

interface CardProps {
  item: Item;
  checked: boolean;
  onSelectChange: () => void;
}

export default function Card({ item, checked, onSelectChange }: CardProps) {
  function stopOpeningDetails(event: MouseEvent) {
    event.stopPropagation();
  }

  return (
    <article className="result-card">
      <label className="card-checkbox-label" onClick={stopOpeningDetails}>
        <input
          type="checkbox"
          checked={checked}
          onChange={onSelectChange}
          aria-label={`Select ${item.name}`}
        />
      </label>
      <div>
        <h3>{item.name}</h3>
        <p>{item.description}</p>
      </div>
    </article>
  );
}
