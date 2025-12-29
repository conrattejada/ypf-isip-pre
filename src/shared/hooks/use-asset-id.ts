import { useMemo } from 'react';

import { usePadId } from './use-pad-id';

import { AppProps } from '@/shared/models';

interface UseAssetIdResult {
  padId?: number;
  assetId?: number;
  wellId?: number;
}

export const useAssetId = (props: AppProps): UseAssetIdResult => {
  const { padId } = usePadId(props);
  const { well, wells, app } = props;

  const wellInfo = useMemo(() => {
    if (well?.asset_id) {
      return well?.asset_id;
    }

    if (!padId || !wells?.length) {
      return null;
    }

    const wellId =
      app?.settings?.settingsByAsset?.[`pad--${padId}`]?.selectedAssets?.[0] ?? wells[0]?.id;

    return {
      assetId: wells.find(w => w?.id === `${wellId}`)?.asset_id ?? null,
      wellId,
    };
  }, [padId, well, wells, app]);

  return {
    assetId: wellInfo?.assetId,
    wellId: wellInfo?.wellId ? parseInt(wellInfo?.wellId, 10) : undefined,
    padId,
  };
};
