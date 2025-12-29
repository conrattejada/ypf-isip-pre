import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { getWells } from '@/shared/api';
import { Well } from '@/shared/models';

const useGetWells = (fracFleetId?: number, padId?: number): UseQueryResult<Well[], unknown> => {
  return useQuery({
    queryKey: ['get-wells', fracFleetId, padId],
    queryFn: () => getWells(fracFleetId, padId),
    enabled: !!fracFleetId,
  });
};

export default useGetWells;
