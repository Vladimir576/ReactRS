'use client';

import { useTranslations } from 'next-intl';
import './Pagination.css';

interface PaginationProps {
  page: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, onPageChange }: PaginationProps) {
  const t = useTranslations();

  return (
    <div className="pagination">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        {t('pagination.previous')}
      </button>
      <span>
        {t('pagination.page')} {page}
      </span>
      <button type="button" onClick={() => onPageChange(page + 1)}>
        {t('pagination.next')}
      </button>
    </div>
  );
}
