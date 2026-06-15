import {
  memo,
  useCallback,
  useMemo,
  useState,
  type KeyboardEvent,
  type UIEvent,
} from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { Item } from '../../types/types';
import {
  selectItems,
  selectToggleItem,
  useSelectedItemsStore,
} from '../../store/selectedItemsStore';
import Card from '../Card/Card';
import './CardList.css';

const CARD_ROW_HEIGHT = 142;
const CARD_LIST_VIEWPORT_HEIGHT = 476;
const VIRTUAL_OVERSCAN = 3;

interface CardListProps {
  items: Item[];
}

interface CardListRowProps {
  item: Item;
  checked: boolean;
  top: number;
  onOpenDetails: (itemId: number) => void;
  onToggleSelectedItem: (item: Item) => void;
}

const CardListRow = memo(function CardListRow({
  item,
  checked,
  top,
  onOpenDetails,
  onToggleSelectedItem,
}: CardListRowProps) {
  const handleOpenDetails = useCallback(() => {
    onOpenDetails(item.id);
  }, [item.id, onOpenDetails]);

  const handleSelectChange = useCallback(() => {
    onToggleSelectedItem(item);
  }, [item, onToggleSelectedItem]);

  const handleCardKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.target !== event.currentTarget) {
        return;
      }

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onOpenDetails(item.id);
      }
    },
    [item.id, onOpenDetails]
  );

  const rowStyle = useMemo(
    () => ({
      height: CARD_ROW_HEIGHT,
      transform: `translateY(${top}px)`,
    }),
    [top]
  );

  return (
    <li className="card-list-row" style={rowStyle}>
      <div
        role="button"
        tabIndex={0}
        className="card-button"
        onClick={handleOpenDetails}
        onKeyDown={handleCardKeyDown}
      >
        <Card
          item={item}
          checked={checked}
          onSelectChange={handleSelectChange}
        />
      </div>
    </li>
  );
});

export default function CardList({ items }: CardListProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedItems = useSelectedItemsStore(selectItems);
  const toggleSelectedItem = useSelectedItemsStore(selectToggleItem);
  const page = searchParams.get('page') || '1';
  const [scrollTop, setScrollTop] = useState(0);

  const openDetails = useCallback(
    (itemId: number) => {
      navigate(`/details/${itemId}?page=${page}`);
    },
    [navigate, page]
  );

  const handleScroll = useCallback((event: UIEvent<HTMLUListElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  const visibleRange = useMemo(() => {
    const visibleCount = Math.ceil(CARD_LIST_VIEWPORT_HEIGHT / CARD_ROW_HEIGHT);
    const startIndex = Math.max(
      0,
      Math.floor(scrollTop / CARD_ROW_HEIGHT) - VIRTUAL_OVERSCAN
    );
    const endIndex = Math.min(
      items.length,
      startIndex + visibleCount + VIRTUAL_OVERSCAN * 2
    );

    return { startIndex, endIndex };
  }, [items.length, scrollTop]);

  const visibleItems = useMemo(
    () => items.slice(visibleRange.startIndex, visibleRange.endIndex),
    [items, visibleRange]
  );

  const listHeight = useMemo(
    () => ({ height: items.length * CARD_ROW_HEIGHT }),
    [items.length]
  );

  return (
    <ul className="card-list" onScroll={handleScroll}>
      <li className="card-list-spacer" style={listHeight} aria-hidden="true" />
      {visibleItems.map((item, index) => (
        <CardListRow
          key={`character-${item.id}`}
          item={item}
          checked={Boolean(selectedItems[item.id])}
          top={(visibleRange.startIndex + index) * CARD_ROW_HEIGHT}
          onOpenDetails={openDetails}
          onToggleSelectedItem={toggleSelectedItem}
        />
      ))}
    </ul>
  );
}
