import type { Item } from '../../types/types';
import './Card.css';

interface CardProps {
  item: Item;
}

export default function Card({ item }: CardProps) {
  return (
    <article className="result-card">
      <h3>{item.name}</h3>
      <p>{item.description}</p>
    </article>
  );
}
