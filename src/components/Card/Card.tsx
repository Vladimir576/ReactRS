import { Component } from 'react';
import type { Item } from '../../types/types';
import './Card.css';

interface CardProps {
  item: Item;
}

export default class Card extends Component<CardProps> {
  render() {
    const { name, description } = this.props.item;

    return (
      <article className="result-card">
        <h3>{name}</h3>
        <p>{description}</p>
      </article>
    );
  }
}
