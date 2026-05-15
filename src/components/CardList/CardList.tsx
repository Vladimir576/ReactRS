import { Component } from 'react';
import type { Item } from '../../types/types';
import Card from '../Card/Card';
import './CardList.css';

interface CardListProps {
  items: Item[];
}

export default class CardList extends Component<CardListProps> {
  render() {
    return (
      <ul className="card-list">
        {this.props.items.map((item) => (
          <li key={item.id}>
            <Card item={item} />
          </li>
        ))}
      </ul>
    );
  }
}
