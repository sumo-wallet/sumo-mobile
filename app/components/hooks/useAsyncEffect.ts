import { DependencyList, useEffect } from 'react';
import { useAsyncFn } from './useAsyncFn';

export interface UseAsyncEffectReturn<T extends any, Args extends any[]> {
  loading: boolean;
  error: undefined | Error;
  value: T | undefined;
  call: (...args: Args) => Promise<T>;
}

export const useAsyncEffect = <T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>,
  deps?: DependencyList,
  initialState?: Omit<Partial<UseAsyncEffectReturn<T, Args>>, 'call'>,
): UseAsyncEffectReturn<T, Args> => {
  // @ts-ignore
  const [{ loading, error, value }, call] = useAsyncFn(fn, deps, {
    loading: true,
    error: undefined,
    value: undefined,
    ...initialState,
  });

  useEffect(() => {
    // noinspection JSIgnoredPromiseFromCall
    call();
  }, [call]);

  return {
    call,
    error,
    loading,
    value,
  };
};
