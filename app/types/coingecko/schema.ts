/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface PriceListParams {
  /**
   * id of coins, comma-separated if querying more than 1 coin
   * *refers to <b>`coins/list`</b>
   */
  ids: string;
  /**
   * vs_currency of coins, comma-separated if querying more than 1 vs_currency
   * *refers to <b>`simple/supported_vs_currencies`</b>
   */
  vs_currencies: string;
  /** <b>true/false</b> to include market_cap, <b>default: false</b> */
  include_market_cap?: string;
  /** <b>true/false</b> to include 24hr_vol, <b>default: false</b> */
  include_24hr_vol?: string;
  /** <b>true/false</b> to include 24hr_change, <b>default: false</b> */
  include_24hr_change?: string;
  /** <b>true/false</b> to include last_updated_at of price, <b>default: false</b> */
  include_last_updated_at?: string;
  /** <b>full</b> or any value between 0 - 18 to specify decimal place for currency price value, <b>default: 2</b> */
  precision?: string;
}

export interface TokenPriceDetailParams {
  /** The contract address of tokens, comma separated */
  contract_addresses: string;
  /**
   * vs_currency of coins, comma-separated if querying more than 1 vs_currency
   * *refers to <b>`simple/supported_vs_currencies`</b>
   */
  vs_currencies: string;
  /** <b>true/false</b> to include market_cap, <b>default: false</b> */
  include_market_cap?: string;
  /** <b>true/false</b> to include 24hr_vol, <b>default: false</b> */
  include_24hr_vol?: string;
  /** <b>true/false</b> to include 24hr_change, <b>default: false</b> */
  include_24hr_change?: string;
  /** <b>true/false</b> to include last_updated_at of price, <b>default: false</b> */
  include_last_updated_at?: string;
  /** <b>full</b> or any Integer to specify decimal place for currency price value, <b>default: 2</b> */
  precision?: string;
  /** The id of the platform issuing tokens (See asset_platforms endpoint for list of options) */
  id: string;
}

export interface ListListParams {
  /**
   * flag to include platform contract addresses (eg. 0x.... for Ethereum based tokens).
   *  valid values: true, false
   */
  include_platform?: boolean;
}

export interface MarketsListParams {
  /** The target currency of market data (usd, eur, jpy, etc.) */
  vs_currency: string;
  /** The ids of the coin, comma separated crytocurrency symbols (base). refers to `/coins/list`. */
  ids?: string;
  /** filter by coin category. Refer to /coin/categories/list */
  category?: string;
  /**
   * valid values: <b>market_cap_desc, gecko_desc, gecko_asc, market_cap_asc, market_cap_desc, volume_asc, volume_desc, id_asc, id_desc</b>
   * sort results by field.
   * @default "market_cap_desc"
   */
  order?: string;
  /**
   * valid values: 1..250
   *  Total results per page
   * @default 100
   */
  per_page?: number;
  /**
   * Page through results
   * @default 1
   */
  page?: number;
  /**
   * Include sparkline 7 days data (eg. true, false)
   * @default false
   */
  sparkline?: boolean;
  /** Include price change percentage in <b>1h, 24h, 7d, 14d, 30d, 200d, 1y</b> (eg. '`1h,24h,7d`' comma-separated, invalid values will be discarded) */
  price_change_percentage?: string;
}

export interface CoinsDetailParams {
  /** Include all localized languages in response (true/false) <b>[default: true]</b> */
  localization?: string;
  /** Include tickers data (true/false) <b>[default: true]</b> */
  tickers?: boolean;
  /** Include market_data (true/false) <b>[default: true]</b> */
  market_data?: boolean;
  /** Include community_data data (true/false) <b>[default: true]</b> */
  community_data?: boolean;
  /** Include developer_data data (true/false) <b>[default: true]</b> */
  developer_data?: boolean;
  /** Include sparkline 7 days data (eg. true, false) <b>[default: false]</b> */
  sparkline?: boolean;
  /** pass the coin id (can be obtained from /coins) eg. bitcoin */
  id: string;
}

export interface TickersDetailParams {
  /** filter results by exchange_ids (ref: v3/exchanges/list) */
  exchange_ids?: string;
  /** flag to show exchange_logo */
  include_exchange_logo?: string;
  /** Page through results */
  page?: number;
  /** valid values: <b>trust_score_desc (default), trust_score_asc and volume_desc</b> */
  order?: string;
  /** flag to show 2% orderbook depth. valid values: true, false */
  depth?: string;
  /** pass the coin id (can be obtained from /coins/list) eg. bitcoin */
  id: string;
}

export interface HistoryDetailParams {
  /** The date of data snapshot in dd-mm-yyyy eg. 30-12-2017 */
  date: string;
  /** Set to false to exclude localized languages in response */
  localization?: string;
  /** pass the coin id (can be obtained from /coins) eg. bitcoin */
  id: string;
}

export interface MarketChartDetailParams {
  /** The target currency of market data (usd, eur, jpy, etc.) */
  vs_currency: string;
  /** Data up to number of days ago (eg. 1,14,30,max) */
  days: string;
  /** Data interval. Possible value: daily */
  interval?: string;
  /** pass the coin id (can be obtained from /coins) eg. bitcoin */
  id: string;
}

export interface MarketChartRangeDetailParams {
  /** The target currency of market data (usd, eur, jpy, etc.) */
  vs_currency: string;
  /** From date in UNIX Timestamp (eg. 1392577232) */
  from: string;
  /** To date in UNIX Timestamp (eg. 1422577232) */
  to: string;
  /** pass the coin id (can be obtained from /coins) eg. bitcoin */
  id: string;
}

export interface ContractMarketChartDetailParams {
  /** The target currency of market data (usd, eur, jpy, etc.) */
  vs_currency: string;
  /** Data up to number of days ago (eg. 1,14,30,max) */
  days: string;
  /** The id of the platform issuing tokens (See asset_platforms endpoint for list of options) */
  id: string;
  /** Token's contract address */
  contractAddress: string;
}

export interface ContractMarketChartRangeDetailParams {
  /** The target currency of market data (usd, eur, jpy, etc.) */
  vs_currency: string;
  /** From date in UNIX Timestamp (eg. 1392577232) */
  from: string;
  /** To date in UNIX Timestamp (eg. 1422577232) */
  to: string;
  /** The id of the platform issuing tokens (See asset_platforms endpoint for list of options) */
  id: string;
  /** Token's contract address */
  contractAddress: string;
}

export interface OhlcDetailParams {
  /** The target currency of market data (usd, eur, jpy, etc.) */
  vs_currency: string;
  /**  Data up to number of days ago (1/7/14/30/90/180/365/max) */
  days: string;
  /** pass the coin id (can be obtained from /coins/list) eg. bitcoin */
  id: string;
}

export interface AssetPlatformsListParams {
  /**
   * apply relevant filters to results
   *  valid values: "nft" (asset_platform nft-support)
   */
  filter?: string;
}

export interface CategoriesListParams {
  /** valid values: <b>market_cap_desc (default), market_cap_asc, name_desc, name_asc, market_cap_change_24h_desc and market_cap_change_24h_asc</b> */
  order?: string;
}

export interface ExchangesListParams {
  /**
   * Valid values: 1...250
   * Total results per page
   * Default value:: 100
   */
  per_page?: number;
  /** page through results */
  page?: string;
}

export interface PriceListParams9 {
  /** filter tickers by coin_ids (ref: v3/coins/list) */
  coin_ids?: string;
  /** flag to show exchange_logo */
  include_exchange_logo?: string;
  /** Page through results */
  page?: number;
  /** flag to show 2% orderbook depth i.e., cost_to_move_up_usd and cost_to_move_down_usd */
  depth?: string;
  /** valid values: <b>trust_score_desc (default), trust_score_asc and volume_desc</b> */
  order?: string;
  /** pass the exchange id (can be obtained from /exchanges/list) eg. binance */
  id: string;
}

export interface IndexesListParams {
  /** Total results per page */
  per_page?: number;
  /** Page through results */
  page?: number;
}

export interface DerivativesListParams {
  /** ['all', 'unexpired'] - expired to show unexpired tickers, all to list all tickers, defaults to unexpired */
  include_tickers?: string;
}

export interface PriceListParams2 {
  /** order results using following params name_asc，name_desc，open_interest_btc_asc，open_interest_btc_desc，trade_volume_24h_btc_asc，trade_volume_24h_btc_desc */
  order?: string;
  /** Total results per page */
  per_page?: number;
  /** Page through results */
  page?: number;
}

export interface ExchangesDetailParams {
  /** ['all', 'unexpired'] - expired to show unexpired tickers, all to list all tickers, leave blank to omit tickers data in response */
  include_tickers?: string;
  /** pass the exchange id (can be obtained from derivatives/exchanges/list) eg. bitmex */
  id: string;
}

export interface VolumeChartDetailParams {
  /**  Data up to number of days ago (eg. 1,14,30) */
  days: number;
  /** pass the exchange id (can be obtained from /exchanges/list) eg. binance */
  id: string;
}

export interface PriceListParams4 {
  /** valid values: <b>h24_volume_native_asc, h24_volume_native_desc, floor_price_native_asc, floor_price_native_desc, market_cap_native_asc, market_cap_native_desc, market_cap_usd_asc, market_cap_usd_desc</b> */
  order?: string;
  /** The id of the platform issuing tokens (See asset_platforms endpoint for list of options) */
  asset_platform_id?: string;
  /** Total results per page */
  per_page?: number;
  /** Page through results */
  page?: number;
}

export interface SearchListParams {
  /** Search string */
  query: string;
}
