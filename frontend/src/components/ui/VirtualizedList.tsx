import React, { memo, useMemo, useCallback, useState, useEffect, useRef } from 'react';

interface VirtualizedListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string;
  overscan?: number;
  className?: string;
}

// ✅ OTIMIZADO: Virtualização para listas grandes
const VirtualizedList = memo(<T,>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  keyExtractor,
  overscan = 5,
  className = ''
}: VirtualizedListProps<T>) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // ✅ OTIMIZADO: useMemo para cálculos de virtualização
  const visibleRange = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + overscan,
      items.length - 1
    );
    
    return {
      start: Math.max(0, startIndex - overscan),
      end: endIndex
    };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end + 1);
  }, [items, visibleRange]);

  const totalHeight = useMemo(() => {
    return items.length * itemHeight;
  }, [items.length, itemHeight]);

  const offsetY = useMemo(() => {
    return visibleRange.start * itemHeight;
  }, [visibleRange.start, itemHeight]);

  // ✅ OTIMIZADO: useCallback para scroll handler
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  // ✅ OTIMIZADO: useCallback para scroll to item
  const scrollToItem = useCallback((index: number) => {
    if (containerRef.current) {
      const targetScrollTop = index * itemHeight;
      containerRef.current.scrollTop = targetScrollTop;
    }
  }, [itemHeight]);

  // ✅ OTIMIZADO: useCallback para scroll to top
  const scrollToTop = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, []);

  // ✅ OTIMIZADO: useCallback para scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = totalHeight;
    }
  }, [totalHeight]);

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0
          }}
        >
          {visibleItems.map((item, index) => {
            const actualIndex = visibleRange.start + index;
            return (
              <div
                key={keyExtractor(item, actualIndex)}
                style={{ height: itemHeight }}
              >
                {renderItem(item, actualIndex)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

// ✅ OTIMIZADO: displayName para debugging
VirtualizedList.displayName = 'VirtualizedList';

export default VirtualizedList;

