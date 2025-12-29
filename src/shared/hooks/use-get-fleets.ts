import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { getFracFleets } from '@/shared/api';
import { FracFleet } from '@/shared/models';

const useGetFleets = (): UseQueryResult<FracFleet[], unknown> => {
  return useQuery({
    queryKey: ['get-frac-fleets'],
    queryFn: getFracFleets,
    staleTime: 30 * 60 * 1000,
  });
};

export default useGetFleets;
