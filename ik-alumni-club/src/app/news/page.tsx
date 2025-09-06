'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAvailableInformations } from '@/hooks/useInformations';
import ViewAllLayout from '@/components/ViewAllLayout';
import ListPageContent from '@/components/ListPageContent';
import Pagination from '@/components/Pagination';

const ITEMS_PER_PAGE = 10;

export default function NewsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  
  // Firestoreからお知らせを取得
  const { informations, loading } = useAvailableInformations({
    orderBy: 'date',
    orderDirection: 'desc',
  });
  
  const totalPages = Math.ceil(informations.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = informations.slice(startIndex, endIndex);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit', 
      day: '2-digit',
    }).replace(/\//g, '.');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ViewAllLayout title="INFORMATION" bgColor="white" maxWidth="6xl">
      <ListPageContent
        loading={loading}
        items={currentItems}
        emptyMessage="お知らせはありません"
        layout="list"
      >
        {(item) => (
          <Link href={`/news/${item.id}`}>
            <div className="block--txt transition-opacity duration-300 cursor-pointer hover:opacity-60" style={{ paddingTop: '15px', paddingBottom: '15px', paddingLeft: '0', paddingRight: '0' }}>
              <p className="date text-black" style={{ fontSize: '13px', marginBottom: '10px' }}>
                {formatDate(item.date)}
              </p>
              <p className="tit text-gray-800" style={{ fontSize: '14px' }}>
                {item.title}
              </p>
            </div>
          </Link>
        )}
      </ListPageContent>

      {/* ページネーション */}
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        basePath="/news"
      />
    </ViewAllLayout>
  );
}