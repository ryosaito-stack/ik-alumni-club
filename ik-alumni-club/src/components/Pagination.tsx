'use client';

import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  basePath?: string;
}

export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  basePath = ''
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // 表示するページ番号の範囲を計算
  const getPageNumbers = () => {
    const delta = 2; // 現在のページの前後に表示するページ数
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="block--pager flex justify-between items-center" style={{ marginTop: '70px', marginBottom: '70px' }}>
      {/* 前へボタン */}
      <div className="pager__item--older">
        <Link 
          href={currentPage === 1 ? '#' : `${basePath}?page=${currentPage - 1}`}
          onClick={(e) => {
            e.preventDefault();
            if (currentPage > 1) {
              onPageChange(currentPage - 1);
            }
          }}
          className={`block w-8 h-8 flex items-center justify-center ${
            currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
      </div>

      {/* ページ番号 */}
      <ul className="flex justify-center items-center gap-3">
        {pageNumbers.map((page, index) => {
        if (page === '...') {
          return (
            <li key={`dots-${index}`} className="px-2">
              <span className="text-gray-500">...</span>
            </li>
          );
        }
        
        const pageNum = page as number;
        return pageNum === currentPage ? (
          <li key={pageNum} className="pager__item--current">
            <span className="relative inline-block px-3 py-1 text-gray-700 font-medium">
              {pageNum}
              <span className="absolute bottom-0 h-0.5 bg-gray-700" style={{ left: '10px', right: '10px' }}></span>
            </span>
          </li>
        ) : (
          <li key={pageNum} className="pager__item--other">
            <Link
              href={`${basePath}?page=${pageNum}`}
              onClick={(e) => {
                e.preventDefault();
                onPageChange(pageNum);
              }}
              className="block px-3 py-1 text-gray-700"
            >
              {pageNum}
            </Link>
          </li>
        );
        })}
      </ul>

      {/* 次へボタン */}
      <div className="pager__item--newer">
        <Link
          href={currentPage === totalPages ? '#' : `${basePath}?page=${currentPage + 1}`}
          onClick={(e) => {
            e.preventDefault();
            if (currentPage < totalPages) {
              onPageChange(currentPage + 1);
            }
          }}
          className={`block w-8 h-8 flex items-center justify-center ${
            currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}