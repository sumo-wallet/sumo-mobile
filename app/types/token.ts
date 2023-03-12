export interface UserToken {
  address: string;
  symbol: string;
  decimals: number;
  image: string; // https://static.metaswap.codefi.network/api/v1/tokenIcons/97/0x6eae77b4fad152328f8e481424ca418af180bd7b.png
  isERC721: boolean;
  aggregators: any[];
  balanceError: any;
}

export interface SearchTokenRequest {
  query?: string;
}
export interface SearchToken {
  id: string;
  name: string;
  market_cap_rank: number;
  symbol: string;
  thumb: string;
  large: string;
}

export interface SearchTokenResponse {
  coins: SearchToken[];
}

export interface TrendingItemToken {
  item: SearchToken;
}
export interface TrendingTokenResponse {
  coins: TrendingItemToken[];
}
