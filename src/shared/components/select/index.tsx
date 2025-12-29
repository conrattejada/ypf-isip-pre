import { ReactElement, useEffect, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { useTranslation } from 'react-i18next';

export interface Option {
  label: string | JSX.Element;
  value: any;
  metadata?: { [key: string]: any };
}

interface Props {
  label: string;
  formatLabel?: (option: Option) => JSX.Element | string;
  value: any;
  fullWidth?: boolean;
  options: Option[];
  extraOption?: JSX.Element;
  onChange: (event: any) => void;
  includeEmpty?: boolean;
  emptyTag?: string;
}

const useStyles = makeStyles(theme => ({
  formControl: {
    marginBottom: theme.spacing(1),
    minWidth: 120,
    textAlign: 'left',
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const MSelect = ({
  label,
  value,
  options,
  fullWidth,
  formatLabel,
  onChange,
  extraOption,
  includeEmpty,
  emptyTag,
}: Props): ReactElement => {
  const { t } = useTranslation();
  const classes = useStyles();

  const displayOptions = useMemo(() => {
    if (!includeEmpty) return options;
    return [{ value: '', label: emptyTag || t('common.noneSelected') }, ...options];
  }, [options, includeEmpty, emptyTag]);

  useEffect(() => {
    if (!value) {
      onChange({ target: { value: displayOptions?.[0]?.value } });
    }
  }, [displayOptions, value]);

  return (
    <FormControl variant="standard" className={classes.formControl} fullWidth={fullWidth}>
      <InputLabel shrink id={`${label}-label`}>
        {label}
      </InputLabel>
      <Select
        labelId={`${label}-label`}
        id={`${label}-select`}
        value={value || ''}
        onChange={onChange}
        label={label}
        fullWidth={fullWidth}
        displayEmpty={includeEmpty}
      >
        {displayOptions.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {formatLabel ? formatLabel(option) : option?.label}
          </MenuItem>
        ))}
        {!!extraOption && extraOption}
      </Select>
    </FormControl>
  );
};

export default MSelect;
