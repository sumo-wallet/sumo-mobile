export interface Ticker {
  iso: string;
  name: string;
  slug: string;
  url: string;
  changePercent: number;
  changeValue: number;
  timestamp: number;
  priceO: number;
  priceH: number;
  priceL: number;
  priceC: number;
  circulatingSupply: number;
  marketCap: number;
}
