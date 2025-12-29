import { useEffect, useState } from 'react';

import { getFracFleetId } from '@/shared/api';
import { AppProps } from '@/shared/models';

interface UseFracFleetIdResult {
  fracFleetId?: number;
  loading: boolean;
}

export const useFracFleetId = (props: AppProps, padId?: number): UseFracFleetIdResult => {
  const { app } = props;
  const [fracId, setFracId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFracId = async () => {
      setLoading(true);

      const { fracFleetId: settingsFracId } = app?.settings || {};

      if (settingsFracId) {
        setFracId(settingsFracId);
        setLoading(false);
        return;
      }

      if (!padId) {
        setFracId(null);
        setLoading(false);
        return;
      }

      try {
        const fetchedFracId = await getFracFleetId(padId);
        setFracId(fetchedFracId);
      } catch (error) {
        console.error('Error fetching fracFleetId:', error);
        setFracId(null);
      } finally {
        setLoading(false);
      }
    };

    fetchFracId();
  }, [app?.settings?.fracFleetId, padId]);

  return { fracFleetId: fracId, loading };
};
