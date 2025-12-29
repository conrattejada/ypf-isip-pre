import { useAssetId } from './use-asset-id';
import { useFracFleetId } from './use-frac-fleet-id';

import { AppProps } from '@/shared/models';

interface UseGetPropsInfoResult {
  fracFleetId?: number;
  padId?: number;
  wellId?: number;
  assetId?: number;
}

const useGetPropsInfo = (props: AppProps): UseGetPropsInfoResult => {
  const { padId, assetId, wellId } = useAssetId(props);
  const { fracFleetId } = useFracFleetId(props, padId);

  return {
    fracFleetId,
    padId,
    wellId,
    assetId,
  };
};

export default useGetPropsInfo;
