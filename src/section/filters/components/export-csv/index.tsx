import { Button } from '@corva/ui/components';
import { UploadIcon } from '@corva/ui/icons';
import { useTranslation } from 'react-i18next';
import { isNumber } from 'lodash';
import { useMemo } from 'react';

import { useRecordStore } from '@/shared/stores';
import { COLUMNS } from '@/shared/constants';
import { Column, MasterFracRecord } from '@/shared/models';

const formatValue = (datum: MasterFracRecord, c: Column<MasterFracRecord>, separator: string) => {
  const value = c?.formatValue(datum, { forExcel: true });
  if (value && isNumber(value) && c?.inputType === 'number') {
    return `${value}`.replaceAll('.', ',');
  }

  return `${value}`?.replaceAll?.(separator, '.')?.replaceAll('\n', '') || '';
};

interface ExportCSVProps {
  filename: string;
  separator?: string;
}

const ExportCSV = ({ filename, separator = ';' }: ExportCSVProps): JSX.Element => {
  const { t } = useTranslation();
  const records = useRecordStore(state => state.records);

  const columns = useMemo(() => {
    const hiddenColumns = COLUMNS.filter(c => c?.isPJR).map(c => c.field.replace('.pjr', ''));
    return COLUMNS.filter(c => !hiddenColumns.includes(c.field));
  }, [COLUMNS]);

  const downloadCSV = () => {
    const csvString = [
      `sep=${separator}`,
      // Headers
      columns.map(c => (t(c.name) as string)?.replaceAll(separator, '.')).join(separator),
      // Data
      ...records.map(datum => columns.map(c => formatValue(datum, c, separator)).join(separator)),
    ].join('\n');

    const blob = new Blob([csvString], { type: 'text/csv' });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || 'download.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Button startIcon={<UploadIcon />} onClick={downloadCSV} variant="text" color="primary">
      {t('filters.export')}
    </Button>
  );
};

export default ExportCSV;
