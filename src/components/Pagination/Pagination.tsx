import './Pagination.css';

interface PaginationProps {
  page: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, onPageChange }: PaginationProps) {
  return (
    <div className="pagination">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        Previous
      </button>
      <span>Page {page}</span>
      <button type="button" onClick={() => onPageChange(page + 1)}>
        Next
      </button>
    </div>
  );
}
