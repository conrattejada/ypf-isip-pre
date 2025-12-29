import { Checkbox, Modal, TextField } from '@corva/ui/components';
import { FormControlLabel } from '@material-ui/core';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './styles.module.css';

import { COLUMNS } from '@/shared/constants';
import { useAppStore } from '@/shared/context';

type SettingsProps = {
  isOpen: boolean;
  onClose: () => void;
};

const Settings = ({ isOpen, onClose }: SettingsProps): JSX.Element => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');

  const selectedColumns = useAppStore('columns');
  const toggleColumn = useAppStore('toggleColumn');

  const handleSearchChange = (e: React.ChangeEvent<{ value: string }>) => {
    setSearch(e.target.value);
  };

  const displayedColumns = useMemo(() => {
    if (!search) return COLUMNS.filter((c) => !c?.isPJR);
    return COLUMNS.filter((c) => !c?.isPJR).filter((c) =>
      t(c?.name).toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={t('table.settings.title')}
      size="small"
    >
      <section className={styles.container}>
        <h3>{t('table.settings.columnsTitle')}</h3>
        <TextField
          value={search}
          onChange={handleSearchChange}
          placeholder={t('table.settings.search')}
        />
        <div className={styles.columns}>
          {displayedColumns.map((c) => (
            <FormControlLabel
              key={c.field}
              control={<Checkbox onChange={() => toggleColumn(c.field)} />}
              label={t(c?.name)}
              checked={selectedColumns.includes(c.field)}
            />
          ))}
        </div>
      </section>
    </Modal>
  );
};

export default Settings;
