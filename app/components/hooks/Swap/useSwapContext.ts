import {
  ModelDexRouter,
  SwapSwapDexPath,
  V1SwapRouteListParams,
} from 'app/types';
import { useCallback, useState, useEffect } from 'react';
import { iClient } from '../../../services/icrosschainApis';
import useErrorHandler from '../useErrorHandler.hook';

interface Route {
  path: string[];
}
interface SwapContext {
  isLoading: boolean;
  dexes: ModelDexRouter[];
  hasMore: boolean;
  fromToken: string;
  destinationToken: string;
  fromAmount: number;
  toAmount: number;
  defaultDex: ModelDexRouter;
  fromDex: ModelDexRouter;
  routes: Route[];
  fromChainId: number;
  toChainId: number;
  slippage: number;
  priceImpact: number;
  setFromDex: (dex: ModelDexRouter) => void;
  setChainId: (chainId: number) => void;
  setFromToken: (fromToken: any) => void;
  setToToken: (to: any) => void;
  setFromAmount: (amount: string) => void;
  estimate: () => void;
}

export function useSwapContext(): SwapContext {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [dexes, setDexes] = useState<ModelDexRouter[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [chainId, setChainId] = useState<number>(1);
  const [fromToken, setFromToken] = useState(null);
  const [destinationToken, setDestinationToken] = useState(null);
  const [fromAmount, setFromAmount] = useState('0');
  const [toAmount, setToAmount] = useState(0);
  const [defaultDex, setDefaultDex] = useState<ModelDexRouter>(null);
  const [fromDex, setFromDex] = useState<ModelDexRouter>(null);
  const [routes, setRoutes] = useState<Route[]>(null);
  const [fromChainId, setFromChainId] = useState(0);
  const [toChainId, setToChainId] = useState(0);
  const [slippage, setSlippage] = useState(0);
  const [priceImpact, setPriceImpact] = useState(0);
  const [swapSwapDexPath, setSwapSwapDexPath] = useState<SwapSwapDexPath[]>([]);
  const errorHandler = useErrorHandler();

  const initDex = useCallback(async () => {
    console.log('Init dex');
    if (!fromDex && dexes) {
      setFromDex(dexes[0]);
    }
  }, [dexes, fromDex]);

  const getDexes = useCallback(async () => {
    try {
      setLoading(true);
      const res = await iClient.getSwapDexByChain({ chainId });
      if (res?.data) {
        setDexes(res.data);
      } else {
        setHasMore(true);
      }
    } catch (error) {
      await errorHandler(error);
    } finally {
      setLoading(false);
    }
  }, [errorHandler, chainId]);

  const findRoute = useCallback(async () => {
    if (!fromAmount || !fromToken || !destinationToken) {
      return;
    }
    try {
      setLoading(true);
      const params: V1SwapRouteListParams = {
        amountIn: fromAmount,
        chainId: fromChainId,
        fromToken,
        toToken: destinationToken,
        slippage,
      };
      const res = await iClient.getSwapRoutes(params);
      if (res?.data) {
        setSwapSwapDexPath(res.data);
      } else {
        setHasMore(true);
      }
    } catch (error) {
      await errorHandler(error);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromChainId, fromToken, destinationToken, errorHandler]);

  const estimate = () => {
    findRoute();
  };

  // auto get dex by chain id
  useEffect(() => {
    getDexes().then();
  }, [getDexes]);

  // auto select the first dex
  useEffect(() => {
    initDex().then();
  }, [initDex]);

  // auto find new route when change token or chain
  useEffect(() => {
    findRoute().then();
  }, [findRoute]);

  return {
    isLoading,
    dexes,
    hasMore,
    fromToken,
    destinationToken,
    fromAmount,
    toAmount,
    defaultDex,
    fromDex,
    routes,
    fromChainId,
    toChainId,
    slippage,
    priceImpact,
    setFromDex,
    setChainId,
    setFromToken,
    setDestinationToken,
    setFromAmount,
    estimate,
  };
}
