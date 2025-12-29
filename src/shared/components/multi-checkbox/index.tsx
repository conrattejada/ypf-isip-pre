import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FormControlLabel, FormGroup, FormLabel } from '@material-ui/core';
import { Checkbox } from '@corva/ui/componentsV2';

import styles from './styles.module.css';

type Value = string | number;

type Option = {
  label: string;
  value: Value;
};

type Props = {
  options: Option[];
  value: Value[];
  onChange: (value: Value[]) => void;
};

const MultiCheckbox = ({ options, value, onChange }: Props): JSX.Element => {
  const { t } = useTranslation();
  const isChecked = useCallback(
    (tag: Value) => (value || []).includes(tag),
    [value]
  );

  const toggleCheckbox = useCallback(
    (tag: Value) => {
      if ((value || []).includes(tag)) {
        return () => onChange([...value.filter((x) => x !== tag)]);
      } else {
        return () => onChange([...value, tag]);
      }
    },
    [value]
  );

  return (
    <FormGroup>
      <FormLabel className={styles.label}>{t('table.columns.tec')}</FormLabel>
      <div className={styles.container}>
        {options.map((tag) => (
          <FormControlLabel
            key={tag.value}
            className={styles.checkbox}
            control={
              <Checkbox
                checked={isChecked(tag.value)}
                onChange={toggleCheckbox(tag.value)}
              />
            }
            label={tag.label}
          />
        ))}
      </div>
    </FormGroup>
  );
};

export default MultiCheckbox;
