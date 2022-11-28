import fetch from 'isomorphic-unfetch';
import { emitter, EVENTS } from './emitter';

export type FetcherError = Error & { response: Response };

export default async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<JSON> {
  const res = await fetch(input, init);
  if (res.ok) {
    return res.json();
  }

  const json = await res.json();
  // console.log('json : ' + JSON.stringify(json));
  const error = new Error(json?.message || res.statusText) as FetcherError;
  error.response = res;
  // console.log('json?.message: ' + json?.message);
  error.message = json?.message;
  emitter.emit(EVENTS.API_ERROR, {
    input,
    status: res.status,
    statusText: res.statusText,
    message: json?.message,
    response: res,
  });

  return Promise.reject(error);
}
