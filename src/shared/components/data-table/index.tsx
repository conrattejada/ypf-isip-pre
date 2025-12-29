import { useRef, useState, useMemo, useEffect } from 'react';

import TableBody from './table-body';
import HeaderCell from './header-cell';

import styles from './styles.module.css';

const sortFunction = (data, key, sortOrder) => {
  return data.sort((a, b) => {
    if (typeof a[key] === 'string') {
      if (sortOrder === 'asc') return a[key].localeCompare(b[key]);
      return b[key].localeCompare(a[key]);
    }

    if (sortOrder === 'asc') return a[key] > b[key] ? 1 : -1;
    return b[key] > a[key] ? 1 : -1;
  });
};

interface DataTableProps<T extends { id?: string | number }> {
  data: T[];
  columns: Array<{
    id: string;
    label?: string | JSX.Element;
    className?: string;
    headerClassname?: string;
    sticky?: 'left' | 'right' | undefined;
    width?: number;
    valueFormat: (row: T) => React.ReactNode;
    readOnly?: boolean;
  }>;
  rowClassFn?: (data: T) => string | null;
  rowHeight?: number;
}

const DataTable = <T extends { id?: string | number }>({
  data,
  columns,
  rowClassFn,
  rowHeight = 48,
}: DataTableProps<T>): JSX.Element => {
  const scrollContainerRef = useRef(null);
  const [sortedData, setSortedData] = useState(data);
  const [sortOrder, setSortOrder] = useState('asc');
  const sortData = (key) => {
    const sorted = sortFunction(data, key, sortOrder);
    setSortedData(sorted);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  // Calculate sticky positions for header cells
  const stickyPositions = useMemo(() => {
    const leftPositions = {};
    const rightPositions = {};
    let currentLeftPosition = 0;
    let currentRightPosition = 0;

    columns.forEach((column) => {
      if (column.sticky === 'left') {
        leftPositions[column.id] = currentLeftPosition;
        currentLeftPosition += (column.width || 1) * 80;
      } else if (column.sticky === 'right') {
        rightPositions[column.id] = currentRightPosition;
        currentRightPosition += (column.width || 1) * 80;
      }
    });

    return { left: leftPositions, right: rightPositions };
  }, [columns]);

  useEffect(() => {
    setSortedData(data);
  }, [data]);

  return (
    <div ref={scrollContainerRef} className={styles.scrollContainer}>
      <table className={styles.Table}>
        <thead>
          <tr className={styles.HeaderRow}>
            {columns.map((c) => {
              let position: number;

              if (c.sticky === 'left') position = stickyPositions.left[c.id];
              else if (c.sticky === 'right')
                position = stickyPositions.right[c.id];

              return (
                <HeaderCell
                  key={c.id}
                  field={c.id}
                  header={c?.label}
                  sortData={sortData}
                  width={c.width}
                  sticky={c.sticky}
                  rowHeight={rowHeight}
                  className={c?.headerClassname}
                  stickyPosition={position}
                />
              );
            })}
          </tr>
        </thead>
        <TableBody
          scrollContainerRef={scrollContainerRef}
          data={sortedData}
          columns={columns}
          rowHeight={rowHeight}
          stickyPositions={stickyPositions}
          rowClassFn={rowClassFn}
        />
      </table>
    </div>
  );
};

export default DataTable;
