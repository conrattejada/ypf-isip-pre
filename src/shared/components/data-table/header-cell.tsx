import cls from 'classnames';

import styles from './styles.module.css';

type HeaderCellProps = {
  header: string | JSX.Element;
  field: string;
  width?: number;
  sticky?: 'left' | 'right' | undefined;
  className?: string;
  rowHeight?: number;
  sortData?: (field: string) => void;
  stickyPosition?: number;
};

const HeaderCell = ({
  header,
  field,
  width,
  sticky,
  rowHeight,
  className,
  sortData,
  stickyPosition = 0,
}: HeaderCellProps): JSX.Element => {
  return (
    <th
      className={cls(className, styles.Header, { [styles.Sticky]: sticky })}
      role="button"
      tabIndex={0}
      onClick={() => sortData(field)}
      style={{
        width: (width || 1) * 80,
        minWidth: (width || 1) * 80,
        left: sticky === 'left' ? stickyPosition : undefined,
        right: sticky === 'right' ? stickyPosition : undefined,
        height: rowHeight,
      }}
    >
      <div>{header}</div>
    </th>
  );
};

export default HeaderCell;
