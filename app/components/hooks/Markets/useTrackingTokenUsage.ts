import { HandlerTrackingUsageRequest } from 'app/types';
import { useCallback } from 'react';
import { client } from '../../../services/apis';
import useErrorHandler from '../useErrorHandler.hook';

interface TrackingData {
  trackingUsage: (dappId: number, from: string) => void;
}

export function useTrackingTokenUsage(): TrackingData {
  const errorHandler = useErrorHandler();
  const trackingUsage = useCallback(
    async (token, from) => {
      try {
        const body: Required<HandlerTrackingUsageRequest> = {
          token,
          from,
        };
        await client.trackingDAppUsage(body);
      } catch (error) {
        await errorHandler(error);
        // eslint-disable-next-line no-empty
      } finally {
      }
    },
    [errorHandler],
  );

  return { trackingUsage };
}
