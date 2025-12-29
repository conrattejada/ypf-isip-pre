/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-plusplus */
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import throttle from 'lodash.throttle';
import cls from 'classnames';

import styles from './styles.module.css';

const OVERSCAN_COUNT = 2; // Number of extra rows to render above/below visible area

interface TableBodyProps<T extends { id?: string | number }> {
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  data: T[];
  rowHeight?: number;
  columns: Array<{
    id: string;
    className?: string;
    sticky?: 'left' | 'right' | undefined;
    width?: number;
    valueFormat: (row: T, options?: { [key: string]: any }) => React.ReactNode;
    readOnly?: boolean;
  }>;
  stickyPositions: {
    left?: Record<any, number>;
    right?: Record<any, number>;
  };
  rowClassFn?: (data: T) => string | null;
}

const TableBody = <T extends { id?: string | number }>({
  scrollContainerRef,
  data,
  columns,
  rowHeight,
  rowClassFn,
  stickyPositions,
}: TableBodyProps<T>): JSX.Element => {
  const [displayState, setDisplayState] = useState({
    displayStart: 0,
    displayEnd: 0,
  });

  // Track row heights dynamically if rows can have variable heights
  const rowHeightsRef = useRef<number[]>(
    new Array(data.length).fill(rowHeight)
  );

  const calculateVisibleRange = useCallback(() => {
    if (!scrollContainerRef.current) return { start: 0, end: 0 };

    const { scrollTop } = scrollContainerRef.current;
    const containerHeight = scrollContainerRef.current.clientHeight;

    let startIndex = 0;
    let currentHeight = 0;

    // Find the first visible row
    for (let i = 0; i < rowHeightsRef.current.length; i++) {
      if (currentHeight + rowHeightsRef.current[i] > scrollTop) {
        startIndex = Math.max(0, i - OVERSCAN_COUNT);
        break;
      }
      currentHeight += rowHeightsRef.current[i];
    }

    // Calculate end index to fully fill the container
    let endIndex = startIndex;
    let visibleHeight = 0;

    while (
      endIndex < data.length &&
      visibleHeight < containerHeight + rowHeight * OVERSCAN_COUNT
    ) {
      visibleHeight += rowHeightsRef.current[endIndex];
      endIndex++;
    }

    // Ensure we fill the entire container
    while (visibleHeight < containerHeight && endIndex < data.length) {
      visibleHeight += rowHeightsRef.current[endIndex];
      endIndex++;
    }

    return {
      start: startIndex,
      end: Math.min(endIndex, data.length),
    };
  }, [data.length, scrollContainerRef]);

  const updateDisplayRange = useCallback(() => {
    const { start, end } = calculateVisibleRange();
    setDisplayState((prev) =>
      prev.displayStart !== start || prev.displayEnd !== end
        ? { displayStart: start, displayEnd: end }
        : prev
    );
  }, [calculateVisibleRange]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return () => { };

    const handleScroll = throttle(updateDisplayRange, 50, {
      leading: true,
      trailing: false,
    });

    // Initial calculation
    updateDisplayRange();

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [updateDisplayRange, scrollContainerRef]);

  const totalHeight = useMemo(
    () => rowHeight * (data?.length || 0),
    [data.length]
  );

  const Rows = useMemo(() => {
    // Calculate heights of padding rows
    const startPadding = rowHeightsRef.current
      .slice(0, displayState.displayStart)
      .reduce((sum, height) => sum + height, 0);

    const endPadding = Math.max(
      0,
      rowHeightsRef.current
        .slice(displayState.displayEnd)
        .reduce((sum, height) => sum + height, 0)
    );

    return (
      <>
        <tr key="startRowFiller" style={{ height: startPadding }} />
        {data
          .slice(displayState.displayStart, displayState.displayEnd)
          .map((row, index) => {
            const absoluteIndex = displayState.displayStart + index;
            return (
              <tr
                key={row?.id || absoluteIndex}
                className={cls(styles.Row, rowClassFn(row))}
                ref={(el) => {
                  // Dynamically track row heights if they differ
                  if (el) {
                    const currentHeight = el.getBoundingClientRect().height;
                    if (
                      currentHeight !== rowHeightsRef.current[absoluteIndex]
                    ) {
                      rowHeightsRef.current[absoluteIndex] = currentHeight;
                    }
                  }
                }}
              >
                {columns.map((column) => (
                  <td
                    key={column.id}
                    className={cls(column.className, {
                      [styles.Sticky]: column.sticky,
                    })}
                    style={{
                      width: (column.width || 1) * 80,
                      left:
                        column.sticky === 'left'
                          ? stickyPositions.left[column.id]
                          : undefined,
                      right:
                        column.sticky === 'right'
                          ? stickyPositions.right[column.id]
                          : undefined,
                    }}
                    title={`${column.valueFormat(row, { forExcel: true })}`}
                  >
                    {column.valueFormat(row)}
                  </td>
                ))}
              </tr>
            );
          })}
        <tr key="endRowFiller" style={{ height: endPadding }} />
      </>
    );
  }, [displayState, data, columns, stickyPositions]);

  return <tbody style={{ height: totalHeight }}>{Rows}</tbody>;
};

export default TableBody;
