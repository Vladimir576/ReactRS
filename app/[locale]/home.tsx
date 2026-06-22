'use client';

import Main from '@/src/components/Main/Main';
import { useDashboardItems } from '@/src/hooks/useDashboardItems';

export default function HomePage() {
  const {
    searchTerm,
    loading,
    refreshing,
    errorMessage,
    items,
    page,
    selectedItemId,
    onSearch,
    onRetry,
    onPageChange,
    onSelectItem,
    onCloseDetails,
  } = useDashboardItems();

  return (
    <Main
      searchTerm={searchTerm}
      loading={loading}
      refreshing={refreshing}
      errorMessage={errorMessage}
      items={items}
      page={page}
      selectedItemId={selectedItemId}
      onSearch={onSearch}
      onRetry={onRetry}
      onPageChange={onPageChange}
      onSelectItem={onSelectItem}
      onCloseDetails={onCloseDetails}
    />
  );
}
