// destructuring env keys might not work in old node versions
// import Config from 'react-native-config';
// import { glo } from './../types/coingecko/schema';
import qs from 'query-string';
import fetcher from './fetcher';

/* eslint-disable prefer-destructuring */
export const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3/';
export const COINDESK_NEWS_BIZ =
  'https://www.coindesk.com/pf/api/v3/content/fetch/websked-collections?query=%7B%22content_alias%22%3A%22web3content%22%2C%22format%22%3A%22main-navigation-article%22%2C%22from%22%3A%220%22%2C%22size%22%3A%224%22%7D';
export const COINDESK_NEWS =
  'https://www.coindesk.com/pf/api/v3/content/fetch/live-wire?query=%7B%22from%22%3A0%2C%22language%22%3A%22en%22%2C%22size%22%3A40%2C%22website%22%3A%22coindesk%22%7D&d=221&_website=coindesk';
export const COINDESK_TICKER =
  'https://production.api.coindesk.com/v2/tb/price/ticker?assets=';

// export const BASE_URL = Config?.BASE_URL;

export const PATHS = {
  coingeckoPing: '/v3/ping',
  coingeckoGlobal: '/v3/global',
};

class Client {
  headers: HeadersInit_ = {
    'Content-Type': 'application/json',
  };

  privateHeaders: HeadersInit_ = {
    'Content-Type': 'application/json',
  };

  address = '';

  setHeaders(headers: Record<string, any>) {
    this.headers = { ...this.headers, ...headers };
  }

  setAddress(newAddress: string) {
    this.address = newAddress;
  }

  setPrivateHeaders(headers: Record<string, any>) {
    this.privateHeaders = { ...this.privateHeaders, ...headers };
  }

  setSignature(Signature: string) {
    this.setPrivateHeaders({ Signature });
  }

  setChallenge(Challenge: string) {
    this.setPrivateHeaders({ Challenge });
  }

  clearTokens() {
    this.privateHeaders = { 'Content-Type': 'application/json' };
  }

  getCoindeskNews() {
    return fetcher<any>(`${COINDESK_NEWS_BIZ}`, {
      headers: this.headers,
    });
  }
  getCoindeskAllNews() {
    return fetcher<any>(`${COINDESK_NEWS}`, {
      headers: this.headers,
    });
  }
  getCoindeskTickers(tickers: string) {
    return fetcher<any>(`https://production.api.coindesk.com/v2/tb/price/ticker?assets=BTC,ETH,XRP,BCH,BNB`, {
      headers: this.headers,
    });
  }
  getCoingeckoGlobal() {
    return fetcher<any>(`${COINGECKO_BASE_URL}${PATHS.coingeckoGlobal}`, {
      headers: this.headers,
    });
  }
  getTokenPrice(address: string) {
    return fetcher<any>(`${COINGECKO_BASE_URL}${PATHS.coingeckoGlobal}`, {
      headers: this.headers,
    });
  }
}

const client = new Client();

export { client };
