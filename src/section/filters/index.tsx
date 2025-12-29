/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo, useState, ChangeEvent } from 'react';
import {  Button, StyledDropdownEditor } from '@corva/ui/components';
import { Chip, Switch, TextInput } from '@corva/ui/componentsV2';
import { LeftAlignmentIcon } from '@corva/ui/icons';
import {
  showErrorNotification,
  showSuccessNotification,
} from '@corva/ui/utils';
import { useMutation } from '@tanstack/react-query';

import styles from './styles.module.css';

import { LoadingModal, Select } from '@/shared/components';
import { useRecordStore, useSelectionStore } from '@/shared/stores';
import { recalculateRecords } from '@/shared/api/master-frac';
import { useGetFilters } from '@/shared/hooks';
import { TIME_PERIODS } from '@/shared/constants';
import { useAppStore } from '@/shared/context';
import { AppSideBar } from '@corva/ui/components';

type Fields = 'frac' | 'pad' | 'well' | 'period';

const Filters = (): JSX.Element => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const stageList = useAppStore('stagesList')
  const toggleStages = useAppStore('toggleStages')
  const stages = useAppStore('stages')




  const {
    assetId,
    fracFleetId,
    padId,
    wellId,
    period: timePeriod,
  } = useAppStore('filters');
  const updateFilters = useAppStore('setFilter');
  const showPJR = useAppStore('showPJR');
  const togglePJR = useAppStore('toggleShowPJR');
  const graph = useAppStore('graph');
  const toggleGraph = useAppStore('toggleGraph');
  const top_perforation = useAppStore('top_perforation');
  const toggleTopPerforation = useAppStore('toggleTopPerforation');
  const bottom_perforation = useAppStore('bottom_perforation');
  const toggleBottomPerforation = useAppStore('toggleBottomPerforation');

  const selectedRecords = useSelectionStore((state) => state.selectedRecords);
  const clearRecords = useSelectionStore((state) => state.clearRecords);
  const updateRecords = useSelectionStore((state) => state.updateRecords);
  const refetchRecords = useRecordStore((state) => state.refetchRecords);

  const { t } = useTranslation();
  const { fracFleets, pads, wells } = useGetFilters();
  const {
    data: recalculateResponse,
    mutate: recalculate,
    isSuccess: recalculateSuccess,
    isError: recalculateError,
    isLoading: recalculateLoading,
  } = useMutation({
    mutationKey: ['recalculate', assetId, selectedRecords],
    mutationFn: (ids: string[]) => recalculateRecords(assetId, ids),
  });

  const handleChange = useCallback((field: Fields) => {
    const getChangeFn = (field: Fields) => {
      switch (field) {
        case 'frac':
          return (value) => updateFilters('fracFleetId', value);
        case 'pad':
          return (value) => updateFilters('padId', value);
        case 'well':
          return (value) => updateFilters('wellId', value);
        case 'period':
          return (value) => updateFilters('period', value);
        default:
          return undefined;
      }
    };

    const changeFn = getChangeFn(field);
    // @ts-ignore
    return (e: React.ChangeEvent<{ name?: string; value: unknown }>) =>
      changeFn(e.target.value);
  }, []);

  const padOptions = useMemo(
    () =>
      (pads || []).map((p) => ({
        value: p?.value,
        label: p?.active ? (
          <div className={styles.option}>
            <span>{p?.label}</span>
            <Chip.Affix.Indicator className={styles.successBg}>
              Active
            </Chip.Affix.Indicator>
          </div>
        ) : (
          p?.label
        ),
      })),
    [pads]
  );

  const timePeriodOptions = useMemo(
    () =>
      TIME_PERIODS.map((tp) => ({
        value: tp,
        label: tp.replace('h', ' hours'),
      })),
    []
  );

  useEffect(() => {
    if (recalculateSuccess) {
      if (recalculateResponse.failed_ids.length === 0) {
        showSuccessNotification(t('filters.recalculateSuccess'));
        setTimeout(() => {
          refetchRecords();
          clearRecords();
        }, 500);
      } else {
        showErrorNotification(t('filters.recalculateFailed'));
        updateRecords(recalculateResponse.failed_ids);
      }
    }
  }, [recalculateSuccess, recalculateResponse]);

  useEffect(() => {
    if (recalculateError) {
      showErrorNotification(t('filters.recalculateError'));
    }
  }, [recalculateError]);

  if (selectedRecords.length > 0) {
    return (
      <div className={styles.flexContainer}>
        <div className={styles.recalculation}>
          <div className={styles.selected}>
            <span>
              {t('filters.recordsSelected', { number: selectedRecords.length })}
            </span>
          </div>
          <div className={styles.recalcActions}>
            <Button variant="text" color="primary" onClick={clearRecords}>
              {t('common.cancel')}
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => recalculate(selectedRecords)}
            >
              {t('filters.recalculate')}
            </Button>
          </div>
        </div>
        <LoadingModal
          isOpen={recalculateLoading}
          title={t('filters.recalculateLoadingTitle')}
          message={t('filters.recalculateLoadingMessage')}
        />
      </div>
    );
  }
  return (
    <AppSideBar
      size="small"
      isOpen={settingsOpen}
      setIsOpen={setSettingsOpen}
      anchor="left"
      header={<span>filtros</span>}
      headerIcon={<LeftAlignmentIcon />}
      allOptionsButtonShown={''}
      isAllOptionsSelected
    >
      <div className={styles.container}>
        <div className={styles.filters}>
          <Select
            label={t('filters.fracFleet')}
            value={
              fracFleets.map((o) => o.value).includes(fracFleetId)
                ? fracFleetId
                : ''
            }
            options={fracFleets}
            onChange={handleChange('frac')}
          />
          <Select
            label={t('filters.pad')}
            value={padOptions.map((o) => o.value).includes(padId) ? padId : ''}
            options={padOptions}
            onChange={handleChange('pad')}
            includeEmpty
            emptyTag="All"
          />
          <Select
            label={t('filters.well')}
            value={wells.map((o) => o.value).includes(wellId) ? wellId : ''}
            options={wells}
            onChange={handleChange('well')}
            includeEmpty
            emptyTag="All"
          />
          <Select
            label="Plot type"
            value={graph}
            options={[
              { value: 'Crossplot', label: 'Isip pre-post Crossplot' },
              { value: 'Isip', label: 'Isip Lineplot' },
              { value: 'Isip_dots', label: 'Isip vs Depth Crossplot' },
            ]}
            onChange={(e: ChangeEvent<{ value: string }>) =>
              toggleGraph(e.target.value)
            }
          />
          {graph === 'Crossplot' && (
            <TextInput
              label="Top MD (m)"
              type="number"
              value={top_perforation}
              onChange={(e: number | undefined) => {
                toggleTopPerforation(e)
              }
              }
            />
          )}
          {graph === 'Crossplot' && (
            <TextInput
              label="Bottom MD (m)"
              type="number"
              value={bottom_perforation}
              onChange={(e: number | undefined) =>
                toggleBottomPerforation(e)
              }
            />
          )}

          <StyledDropdownEditor
            currentValue={stages}
            placeholder="Select Stages"
            options={stageList}
            onChange={(val: (number)[]) =>
              toggleStages(val)
            }
            multiple={true}
            renderValue={(selected: (number)[]) => {
              if (!selected || selected.length === 0) return 'All';
              const labels = stageList
                .filter((option) => selected.includes(option.value))
                .map(opt => opt.label)
              if (labels?.length > 0) return labels.join(', ');
            }}
          />
          <Switch
            onLabel={t('filters.showPJR')}
            onChange={togglePJR}
            checked={showPJR}
          />

        </div>
      </div>
    </AppSideBar>
  );
};

export default Filters;
