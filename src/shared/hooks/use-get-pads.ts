import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { getPads } from '@/shared/api';
import { Pad } from '@/shared/models';

const useGetPads = (fracFleetId?: number): UseQueryResult<Pad[], unknown> => {
  return useQuery({
    queryKey: ['get-pads', fracFleetId],
    queryFn: () => getPads(fracFleetId),
    enabled: !!fracFleetId,
  });
};

export default useGetPads;
