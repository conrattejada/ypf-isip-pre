import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';

import { getMasterFracData, getMasterFracUnits } from '@/shared/api';
import { useAppStore } from '@/shared/context';
import { useRecordStore, useUnitStore } from '@/shared/stores';
import { useDebounce } from '@/shared/hooks';

const useGetFracData = (): void => {
  const { fracFleetId, padId, wellId, period } = useAppStore('filters');
  const updateFilters = useAppStore('setFilter');
  const setIsLoading = useRecordStore(state => state.setIsLoading);
  const setRecords = useRecordStore(state => state.setRecords);
  const setRefetchRecords = useRecordStore(state => state.setRefetchRecords);
  const setUnits = useUnitStore(state => state.setUnits);
  const fracQueryKey = useDebounce(['get-frac-data', fracFleetId, padId, wellId, period], 500);
  const { data, isLoading, isSuccess, refetch } = useQuery({
    queryKey: fracQueryKey,
    queryFn: () => getMasterFracData(fracFleetId, padId, wellId, period),
    enabled: !!fracFleetId,
  });
  const { data: units, isSuccess: unitSuccess } = useQuery({
    queryKey: ['get-frac-units'],
    queryFn: () => getMasterFracUnits(),
  });

  useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading]);

  useEffect(() => {
    setRecords(data || []);
    if (data?.length && data.length > 0) {
      const assetId = data?.[0]?.asset_id;
      updateFilters('assetId', assetId);
    }
  }, [data]);

  useEffect(() => {
    if (unitSuccess) {
      setUnits(units);
    }
  }, [units, unitSuccess, setUnits]);

  useEffect(() => {
    setRefetchRecords(refetch);
  }, [refetch]);
};

export default useGetFracData;
