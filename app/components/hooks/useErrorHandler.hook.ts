import React from 'react';
import { AxiosError } from 'axios';
import { useNavigation } from '@react-navigation/native';

export enum ApiErrorCode {
  NetworkError = 1,
  BadRequest = 400,
  Unauthenticated = 401,
  Forbidden = 403,
  Notfound = 404,
  ServerError = 500,
  GatewayTimeout = 504,
}

function isAxiosError<T = unknown>(
  error: Error | AxiosError<T> | unknown,
): error is AxiosError<T> {
  return (error as AxiosError).isAxiosError;
}

export class ApiError extends Error {
  public readonly code: ApiErrorCode;
  public readonly stack: string | undefined;

  constructor(error: Error | unknown) {
    if (!isAxiosError(error)) {
      throw new Error('The error passed in constructor must be an axios error');
    }
    super(error.message);
    this.stack = error.stack;
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      this.code = error.response.status;
    } else if (error.request) {
      this.code = ApiErrorCode.NetworkError;
    } else {
      throw new Error('An error occurred while setting up the api request');
    }
  }
}

export function isApiError(
  error: Error | ApiError | unknown,
): error is ApiError {
  return (error as ApiError).code !== undefined;
}

export type ErrorHandler = (error: Error | unknown) => Promise<void>;

export default function useErrorHandler(): ErrorHandler {
  const navigation = useNavigation();
  return React.useCallback(
    async (error: Error | unknown) => {
      if (!isApiError(error)) {
        // toast.error('An error occurred in the app.');
        return;
      }
      // Check internet connection first
      // if (!window.navigator.onLine) {
      //   toast.error('Please check your internet connection.');
      //   return;
      // }
      navigation.goBack();
    },
    [navigation],
  );
}
