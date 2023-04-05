/* eslint-disable import/no-named-as-default-member */
// destructuring env keys might not work in old node versions
// import { glo } from './../types/coingecko/schema';
// import qs from 'query-string';
import qs from 'query-string';
import fetcher from './fetcher';
import {
  HandlerSearchDappRequest,
  HandlerWalletHomeConfigResponse,
  HandlerNotificationResponse,
  HandlerResponseData,
  HandlerWalletConfigResponse,
  HandlerChainResponse,
  DappDappHomeResponse,
  DappSearchDappResponse,
  DappPopularSearchResponse,
  DappTrackingUsageRequest,
  MarketplaceCollectionCategoryResponse,
  MarketplaceHotAuctionResponse,
  V1BridgeChainListParams,
  V1CollectionSearchListParams,
  BridgeBridgeChainResponse,
  V1BridgeTokenListParams,
  MarketplaceCollectionResponse,
  V1MarketplaceCollectionTopListParams,
  V1MarketplaceCollectionTrendingListParams,
  CoingeckoNewsRequest,
  CoingeckoNewsResponse,
  // CoingeckoLearnsResponse,
  CoingeckoLearnRequest,
  CoingeckoLearns,
  SearchTokenResponse,
  SearchTokenRequest,
  TrendingTokenResponse,
} from './../types';
import {
  CoinsDetailParams,
  MarketChartDetailParams,
  MarketsListParams,
} from '../types/coingecko/schema';
import {
  RawCoinMarketsInterface,
  RawGlobalMarketInterface,
  RawMarketChartInterface,
} from '../reducers/coinmarkets/types';
import { RawCategoriesMarketInterface } from '../reducers/categoriesMarket';
import { RawCrossChainInterface } from '../reducers/crossChain/types';
import { RawTokenByChainInterface } from '../reducers/tokenByChain/types';

/* eslint-disable prefer-destructuring */
export const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3/';
export const COINDESK_NEWS_BIZ =
  'https://www.coindesk.com/pf/api/v3/content/fetch/websked-collections?query=%7B%22content_alias%22%3A%22web3content%22%2C%22format%22%3A%22main-navigation-article%22%2C%22from%22%3A%220%22%2C%22size%22%3A%224%22%7D';
export const COINDESK_NEWS =
  'https://www.coindesk.com/pf/api/v3/content/fetch/websked-collections?query=%7B%22content_alias%22%3A%22main-nav-podcasts%22%2C%22format%22%3A%22main-navigation-article%22%2C%22from%22%3A%220%22%2C%22size%22%3A%224%22%7D&d=244&_website=coindesk';
export const COINDESK_TICKER =
  'https://production.api.coindesk.com/v2/tb/price/ticker?assets=';

export const COIN_GECKO_NEWS = 'https://mobile.api.coingecko.com/api/v3/news';
export const COIN_GECKO_LEARNS =
  'https://mobile.api.coingecko.com/api/v3/posts/learn';

export const MULTICHAIN_BASE_URL = 'https://bridgeapi.anyswap.exchange/';

// export const BASE_URL = Config?.BASE_URL;

export const PATHS = {
  coingeckoPing: '/v3/ping',
  coingeckoGlobal: 'global',
  coingeckoNFTList: '/v3/nfts/list',
  coingeckoNFTData: '/v3/nfts/{id}',
  coingeckoTokenSearchTrending: '/v3/search/trending',
  coingeckoCoinsMarkets: 'coins/markets',
  categoriesMarket: 'coins/categories',
  coingeckoCoinsDetails: 'coins',
  coingeckoMarketChart: 'market_chart',
  multiChain: 'data/bridgeChainInfo',
  tokenByChain: 'v4/tokenlistv4',
};

class Client {
  headers: HeadersInit_ = {
    'Content-Type': 'application/json',
  };

  privateHeaders: HeadersInit_ = {
    'Content-Type': 'application/json',
  };

  baseUrl = 'https://prod3-api.bicyclefi.io';
  address = '';
  icrosschainBaseUrl = 'https://prod3-api.bicyclefi.io';

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
  getCoindeskTickers() {
    return fetcher<any>(
      `https://production.api.coindesk.com/v2/tb/price/ticker?assets=BTC,ETH,XRP,BCH,BNB`,
      {
        headers: this.headers,
      },
    );
  }

  // =========================== Coingecko API ==========================
  getCoingeckoGlobal() {
    return fetcher<RawGlobalMarketInterface>(
      `${COINGECKO_BASE_URL}${PATHS.coingeckoGlobal}`,
      {
        headers: this.headers,
      },
    );
  }
  getTokenPrice() {
    return fetcher<any>(`${COINGECKO_BASE_URL}${PATHS.coingeckoGlobal}`, {
      headers: this.headers,
    });
  }
  getCoingeckoNftList() {
    return fetcher<any>(`${COINGECKO_BASE_URL}${PATHS.coingeckoNFTList}`, {
      headers: this.headers,
    });
  }
  getCoinGeckoNews(request: CoingeckoNewsRequest) {
    return fetcher<CoingeckoNewsResponse>(
      `${COIN_GECKO_NEWS}?${qs.stringify(request)}`,
      {
        headers: this.headers,
      },
    );
  }
  getCoinGeckoLearns(request: CoingeckoLearnRequest) {
    return fetcher<CoingeckoLearns[]>(
      `${COIN_GECKO_LEARNS}?${qs.stringify(request)}`,
      {
        headers: this.headers,
      },
    );
  }
  public getSearchCoingeckoToken(request: SearchTokenRequest) {
    return fetcher<SearchTokenResponse>(
      `${COINGECKO_BASE_URL}/search?${qs.stringify(request)}`,
      {
        headers: this.headers,
        method: 'GET',
      },
    );
  }
  public getSearchTokenTrending() {
    return fetcher<TrendingTokenResponse>(
      `${COINGECKO_BASE_URL}/search/trending`,
      {
        headers: this.headers,
      },
    );
  }
  //======================= DApp API ==========================
  public getDappHome() {
    console.log('****** getDappHome ******');
    return fetcher<DappDappHomeResponse>(`${this.baseUrl}/api/v1/dapp/home`, {
      headers: this.headers,
    });
  }
  public getDappSearch(request: HandlerSearchDappRequest) {
    return fetcher<DappSearchDappResponse>(
      `${this.baseUrl}/api/v1/dapp/search?${qs.stringify(request)}`,
      {
        headers: this.headers,
        method: 'GET',
      },
    );
  }
  public getDappSearchPopular() {
    return fetcher<DappPopularSearchResponse>(
      `${this.baseUrl}/api/v1/dapp/popular-search`,
      {
        headers: this.headers,
      },
    );
  }
  public getDappByCategory(categoryId: string | number) {
    return fetcher<DappSearchDappResponse>(
      `${this.baseUrl}/api/v1/dapp/category/${categoryId}`,
      {
        headers: this.headers,
      },
    );
  }
  public getWalletHome() {
    return fetcher<HandlerWalletHomeConfigResponse>(
      `${this.baseUrl}/api/v1/wallet/home`,
      {
        headers: this.headers,
      },
    );
  }
  public getNotification() {
    return fetcher<HandlerNotificationResponse>(
      `${this.baseUrl}/api/v1/notification`,
      {
        headers: this.headers,
      },
    );
  }
  public trackingDAppUsage(body: Required<DappTrackingUsageRequest>) {
    return fetcher<HandlerResponseData>(
      `${this.baseUrl}/api/v1/dapp/tracking`,
      {
        headers: this.headers,
        method: 'POST',
        body: JSON.stringify(body),
      },
    );
  }
  public getChain() {
    return fetcher<HandlerChainResponse>(
      `${this.baseUrl}/api/v1/system/chain`,
      {
        headers: this.headers,
      },
    );
  }
  public getConfig() {
    return fetcher<HandlerWalletConfigResponse>(
      `${this.baseUrl}/api/v1/system/config`,
      {
        headers: this.headers,
      },
    );
  }
  public getCollectionCategory() {
    return fetcher<MarketplaceCollectionCategoryResponse>(
      `${this.baseUrl}/api/v1/collection/category`,
      {
        headers: this.headers,
      },
    );
  }
  public getSearchCollection(
    searchCollectionParam: V1CollectionSearchListParams,
  ) {
    return fetcher<MarketplaceCollectionCategoryResponse>(
      `${this.baseUrl}/api/v1/collection/search?${qs.stringify(
        searchCollectionParam,
      )}`,
      {
        headers: this.headers,
      },
    );
  }
  public getHotAuction() {
    return fetcher<MarketplaceHotAuctionResponse>(
      `${this.baseUrl}/api/v1/marketplace/hot-auction`,
      {
        headers: this.headers,
      },
    );
  }
  public getMarketplaceTrendingCollection(
    request: V1MarketplaceCollectionTrendingListParams,
  ) {
    return fetcher<MarketplaceCollectionResponse>(
      `${this.baseUrl}/api/v1/marketplace/collection/trending?${qs.stringify(
        request,
      )}`,
      {
        headers: this.headers,
      },
    );
  }
  public getMarketplaceTopCollection(
    request: V1MarketplaceCollectionTopListParams,
  ) {
    return fetcher<MarketplaceCollectionResponse>(
      `${this.baseUrl}/api/v1/marketplace/collection/top?${qs.stringify(
        request,
      )}`,
      {
        headers: this.headers,
      },
    );
  }
  public getCollectionDetail(collectionName: string) {
    return fetcher<MarketplaceHotAuctionResponse>(
      `${this.baseUrl}/api/v1/marketplace/collection/${collectionName}`,
      {
        headers: this.headers,
      },
    );
  }
  public getBridgeChain(params: V1BridgeChainListParams) {
    return fetcher<BridgeBridgeChainResponse>(
      `${this.baseUrl}/api/v1/bridge/chain?${qs.stringify(params)}`,
      {
        headers: this.headers,
      },
    );
  }
  public getBridgeToken(params: V1BridgeTokenListParams) {
    return fetcher<BridgeBridgeChainResponse>(
      `${this.baseUrl}/api/v1/bridge/token?${qs.stringify(params)}`,
      {
        headers: this.headers,
      },
    );
  }
  public getMultichainChain(chainId: number) {
    return fetcher(
      `https://bridgeapi.multichain.org/v4/tokenlistv4/${chainId}`,
      {
        headers: this.headers,
      },
    );
  }
  public getiCrosschainChains() {
    return fetcher<HandlerChainResponse>(
      `${this.icrosschainBaseUrl}/api/v1/system/chain`,
      {
        headers: this.headers,
      },
    );
  }

  public getCoinsMarket(params: MarketsListParams) {
    const stringifyParams = qs.stringify(params);
    return fetcher<RawCoinMarketsInterface[]>(
      `${COINGECKO_BASE_URL}${PATHS.coingeckoCoinsMarkets}?${stringifyParams}`,
      {
        headers: this.headers,
      },
    );
  }

  public getCategoriesMarket() {
    return fetcher<RawCategoriesMarketInterface[]>(
      `${COINGECKO_BASE_URL}${PATHS.categoriesMarket}?order=market_cap_change_24h_desc`,
      {
        headers: this.headers,
      },
    );
  }

  public getCoinsDetails(params: Omit<CoinsDetailParams, 'id'>, id: string) {
    const stringifyParams = qs.stringify(params);
    return fetcher<RawCoinMarketsInterface>(
      `${COINGECKO_BASE_URL}${PATHS.coingeckoCoinsDetails}/${id}?${stringifyParams}`,
      {
        headers: this.headers,
      },
    );
  }

  public getMarketChart(params: MarketChartDetailParams) {
    const stringifyParams = qs.stringify(params);

    return fetcher<RawMarketChartInterface>(
      `${COINGECKO_BASE_URL}${PATHS.coingeckoCoinsDetails}/${params.id}/${PATHS.coingeckoMarketChart}?${stringifyParams}`,
      {
        headers: this.headers,
      },
    );
  }

  public getCandlestickChart(params: MarketChartDetailParams) {
    const stringifyParams = qs.stringify(params);

    return fetcher<any>(
      `${COINGECKO_BASE_URL}${PATHS.coingeckoCoinsDetails}/${params.id}/ohlc?${stringifyParams}`,
      {
        headers: this.headers,
      },
    );
  }

  public getMultiChain() {
    return fetcher<RawCrossChainInterface>(
      `${MULTICHAIN_BASE_URL}${PATHS.multiChain}`,
      {
        headers: this.headers,
      },
    );
  }

  public getTokenByChain(chainId: string) {
    return fetcher<RawTokenByChainInterface>(
      `${MULTICHAIN_BASE_URL}${PATHS.tokenByChain}/${chainId}`,
      {
        headers: this.headers,
      },
    );
  }
}

const client = new Client();

export { client, Client };
