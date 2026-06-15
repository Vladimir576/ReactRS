import { memo, useCallback } from 'react';
import './Pagination.css';

interface PaginationProps {
  page: number;
  onPageChange: (page: number) => void;
}

function Pagination({ page, onPageChange }: PaginationProps) {
  const goToPreviousPage = useCallback(() => {
    onPageChange(page - 1);
  }, [onPageChange, page]);

  const goToNextPage = useCallback(() => {
    onPageChange(page + 1);
  }, [onPageChange, page]);

  return (
    <div className="pagination">
      <button
        type="button"
        onClick={goToPreviousPage}
        disabled={page <= 1}
      >
        Previous
      </button>
      <span>Page {page}</span>
      <button type="button" onClick={goToNextPage}>
        Next
      </button>
    </div>
  );
}

export default memo(Pagination);
