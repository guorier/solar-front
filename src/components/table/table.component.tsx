'use client';

import React from 'react';
import {
  Collection,
  Column as AriaColumn,
  ColumnProps as AriaColumnProps,
  Row as AriaRow,
  RowProps,
  Table as AriaTable,
  TableHeader as AriaTableHeader,
  TableHeaderProps,
  TableProps as AriaTableProps,
  useTableOptions,
  TableBodyProps,
  TableBody as AriaTableBody,
  CellProps,
  Cell as AriaCell,
  // ColumnResizer,
  // Group,
  TableLoadMoreItem as AriaTableLoadMoreItem,
  TableLoadMoreItemProps,
  Group,
} from 'react-aria-components';
import './table.component.scss';
import { Checkbox } from '@/components';

type TableLayoutType = 'horizontal' | 'vertical';

export type TableProps = AriaTableProps & {
  type?: TableLayoutType;
  cellWidth?: number;
};

export function Table({
  type = 'horizontal',
  cellWidth = 160, 
  style,
  ...props
}: TableProps) {
  return (
    <div
      style={{ width: '100%', height: '100%' }}
      onKeyDownCapture={(e: React.KeyboardEvent<HTMLDivElement>) => {
        const t = e.target as HTMLElement | null;
        const isEditable =
          !!t && !!t.closest('input, textarea, select, [contenteditable="true"]');

        if (!isEditable) return;

        (e.nativeEvent as KeyboardEvent).stopImmediatePropagation?.();
        e.stopPropagation();
      }}
    >
    <AriaTable
      {...props}
      data-table-type={type}
      style={
        {
        ...style,
          ...(type === 'vertical' ? { '--label-width': `${cellWidth}px` } : {}),
        } as React.CSSProperties
      }
      />
    </div>
  );
}

interface ColumnProps extends AriaColumnProps {
  allowsResizing?: boolean;
}

export function Column(props: Omit<ColumnProps, 'children'> & { children?: React.ReactNode }) {
  return (
    <AriaColumn {...props} className="react-aria-Column button-base">
      {() => (
        // {({ allowsSorting, sortDirection }) => (
        <div className="column-header">
          <Group role="presentation" tabIndex={-1} className="column-name">
            {props.children}
          </Group>
          {/* {allowsSorting && (
            <span aria-hidden="true" className="sort-indicator">
              {sortDirection === 'ascending' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </span>
          )} */}
          {props.allowsResizing}
        </div>
      )}
    </AriaColumn>
  );
}

export function TableHeader<T extends object>({ columns, children, ...otherProps }: TableHeaderProps<T>) {
  const { selectionBehavior, selectionMode, allowsDragging } = useTableOptions();

  return (
    <AriaTableHeader {...otherProps}>
      {allowsDragging && (
        <AriaColumn width={20} minWidth={20} style={{ width: 20 }} className="react-aria-Column button-base" />
      )}
      {selectionBehavior === 'toggle' && (
        <AriaColumn width={32} minWidth={32} style={{ width: 32 }} className="react-aria-Column button-base">
          {selectionMode === 'multiple' && <Checkbox slot="selection" />}
        </AriaColumn>
      )}
      <Collection items={columns}>{children}</Collection>
    </AriaTableHeader>
  );
}

export function Row<T extends object>({ id, columns, children, ...otherProps }: RowProps<T>) {
  const { selectionBehavior } = useTableOptions();

  return (
    <AriaRow id={id} {...otherProps}>
      {selectionBehavior === 'toggle' && (
        <Cell>
          <Checkbox slot="selection" />
        </Cell>
      )}
      <Collection items={columns}>{children}</Collection>
    </AriaRow>
  );
}

export function TableBody<T extends object>(props: TableBodyProps<T>) {
  return <AriaTableBody {...props} />;
}

export function Cell(props: CellProps) {
  return <AriaCell {...props} />;
}

export function TableLoadMoreItem(props: TableLoadMoreItemProps) {
  return (
    <AriaTableLoadMoreItem {...props}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
    </AriaTableLoadMoreItem>
  );
}
