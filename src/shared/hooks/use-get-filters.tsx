import { useEffect, useMemo } from 'react';

import { useAppStore } from '../context';

import useGetFleets from './use-get-fleets';
import useGetPads from './use-get-pads';
import useGetWells from './use-get-wells';

const useGetFilters = () => {
  const { fracFleetId, padId, wellId, period } = useAppStore('filters');
  const setFilter = useAppStore('setFilter');
  const setFilters = useAppStore('setFilters');

  const { data: fracFleets } = useGetFleets();
  const { data: pads } = useGetPads(fracFleetId);
  const { data: wells } = useGetWells(fracFleetId, padId);

  const currentFracFleet = useMemo(
    () => (fracFleets || []).find(ff => ff.id === fracFleetId),
    [fracFleets, fracFleetId]
  );

  const fracFleetOptions = useMemo(
    () =>
      (fracFleets || []).map(ff => ({
        value: ff?.id,
        label: ff?.name,
      })),
    [fracFleets]
  );

  const padOptions = useMemo(
    () =>
      (pads || []).map(p => ({
        value: p?.id,
        label: p.name,
        active: p?.id === currentFracFleet?.activePad,
      })),
    [pads, currentFracFleet]
  );

  const wellOptions = useMemo(
    () =>
      (wells || []).map(w => ({
        value: w?.id,
        label: w?.name,
        asset_id: w?.assetId
      })),
    [wells]
  );
  useEffect(() => {
    let updatedPad;
    const padIds = (pads || []).map(p => p?.id);
    if (padIds.includes(padId)) return;

    if (padIds.includes(currentFracFleet?.activePad)) {
      updatedPad = currentFracFleet?.activePad;
    }

    setFilters({ fracFleetId, padId: updatedPad, period, wellId: undefined });
  }, [currentFracFleet, pads, padId]);

  useEffect(() => {
    const wellIds = (wells || []).map(w => w?.id);
    if (wellIds.includes(wellId)) return;

    setFilter('wellId', '');
  }, [padId, wells, wellId]);

  return { fracFleets: fracFleetOptions, pads: padOptions, wells: wellOptions };
};

export default useGetFilters;
