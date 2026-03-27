'use client';

import { Group } from 'react-aria-components';
import { ButtonComponent, Icons } from '@/components';
import './pagination.scss';
import { useMemo, useRef, useEffect } from 'react';

export interface PaginationProps {
  data: { page: number; size: number; total: number };
  onChange?: (page: number) => void;
}

const PAGE_WINDOW = 5;

export function Pagination({ data, onChange }: PaginationProps) {
  const page = data.page || 1;
  const size = data.size || 20;

  const lastTotalRef = useRef<number>(data.total || 0);

  useEffect(() => {
    if (typeof data.total === 'number' && data.total > 0) {
      lastTotalRef.current = data.total;
    }
  }, [data.total]);

  const stableTotal = data.total > 0 ? data.total : lastTotalRef.current;

  const totalPages = useMemo(() => Math.max(1, Math.ceil(stableTotal / size)), [stableTotal, size]);

  const blockStart = useMemo(() => {
    return Math.floor((page - 1) / PAGE_WINDOW) * PAGE_WINDOW + 1;
  }, [page]);

  const blockEnd = useMemo(() => {
    return Math.min(totalPages, blockStart + PAGE_WINDOW - 1);
  }, [totalPages, blockStart]);

  const visiblePages = useMemo(() => {
    return Array.from({ length: blockEnd - blockStart + 1 }, (_, i) => blockStart + i);
  }, [blockStart, blockEnd]);

  // const handleFirst = () => {
  //   if (page <= 1) return;
  //   onChange?.(1);
  // };

  const handlePrev = () => {
    if (page <= 1) return;
    onChange?.(page - 1);
  };

  const handleNext = () => {
    if (page >= totalPages) return;
    onChange?.(page + 1);
  };

  // const handleLast = () => {
  //   if (page >= totalPages) return;
  //   onChange?.(totalPages);
  // };

  return (
    <div className="pagination">
      <Group>
        <ButtonComponent
          variant="none"
          icon={<Icons iName="arrow_left" />}
          onPress={handlePrev}
          isDisabled={page <= 1}
        />

        {visiblePages.map((p) => (
          <ButtonComponent
            key={p}
            variant="none"
            className="btn-pg"
            aria-current={page === p ? 'page' : undefined}
            onPress={() => onChange?.(p)}
          >
            {p}
          </ButtonComponent>
        ))}

        <ButtonComponent
          variant="none"
          icon={<Icons iName="arrow_right" />}
          onPress={handleNext}
          isDisabled={page >= totalPages}
        />
      </Group>
    </div>
  );
}
