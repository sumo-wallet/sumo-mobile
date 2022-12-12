// eslint-disable-next-line import/no-extraneous-dependencies
import mitt from 'mitt';

export const emitter = new mitt();

export const EVENTS = {
  API_ERROR: 'API_ERROR',
};
