
import React from 'react';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface VirtualizedListProps<T> {
  items: T[];
  height: number;
  itemSize: number;
  width?: number | string;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  itemKey?: (index: number, data: T[]) => string;
}

export function VirtualizedList<T>({
  items,
  height,
  itemSize,
  width = '100%',
  renderItem,
  className = '',
  itemKey = (index) => String(index),
}: VirtualizedListProps<T>) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // Adjust height based on device if needed
  const adjustedHeight = isMobile ? height * 0.8 : height;

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-muted-foreground">
        No items to display
      </div>
    );
  }

  const Row = ({ index, style }: ListChildComponentProps) => {
    const item = items[index];
    return (
      <div style={style} key={itemKey(index, items)}>
        {renderItem(item, index)}
      </div>
    );
  };

  return (
    <List
      className={`scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 ${className}`}
      height={adjustedHeight}
      itemCount={items.length}
      itemSize={itemSize}
      width={width}
    >
      {Row}
    </List>
  );
}
