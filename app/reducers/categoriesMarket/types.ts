interface IObjectKeys {
  [key: string]: any;
}

export interface RawCategoriesMarketInterface extends IObjectKeys {
  id: string;
  name: string;
  market_cap: number;
  market_cap_change_24h: number;
  content: string;
  top_3_coins: string[];
  volume_24h?: number;
  updated_at?: number;
}
