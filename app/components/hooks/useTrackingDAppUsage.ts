import { HandlerTrackingUsageRequest } from 'app/types';
import { useCallback, useState, useEffect } from 'react';
import { client } from '../../services/apis';
import useErrorHandler from './useErrorHandler.hook';

interface SystemNotification {
  trackingUsage: (dappId: number, from: string) => void;
}

export function useTrackingDAppUsage(): SystemNotification {
  const errorHandler = useErrorHandler();
  const trackingUsage = useCallback(
    async (dappId, from) => {
      try {
        const body: Required<HandlerTrackingUsageRequest> = {
          dapp_id: dappId,
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
