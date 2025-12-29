import { useEffect, useState } from 'react';

import { getPadId } from '@/shared/api';
import { AppProps } from '@/shared/models';

interface UsePadResult {
  padId?: number;
  loading: boolean;
}

export const usePadId = (props: AppProps): UsePadResult => {
  const { wells, app } = props;
  const [padId, setPadId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPadId = async () => {
      setLoading(true);

      const { padId: settingsPadId } = app?.settings || {};

      if (settingsPadId) {
        setPadId(settingsPadId);
        setLoading(false);
        return;
      }

      if (!wells?.length) {
        setPadId(null);
        setLoading(false);
        return;
      }

      try {
        const fetchedPadId = await getPadId(wells?.[0]?.id);
        setPadId(fetchedPadId);
      } catch (error) {
        console.error('Error fetching padId:', error);
        setPadId(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPadId();
  }, [app?.settings?.padId, wells]);

  return { padId, loading };
};
