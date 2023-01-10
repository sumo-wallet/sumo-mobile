export interface HandlerSearchDappRequest {
  text?: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface anyToken {
  name: string;
  symbol: string;
  decimals: number;
  address: string;
  chainId?: string;
}

export interface anyChain {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  chainId?: string;
  anytoken?: anyToken;
  fromanytoken?: anyToken;
  underlying: boolean;
  type: string;
  router: string;
  tokenid?: string;
  routerABI: string;
  isLiquidity: boolean;
  isApprove: boolean;
  isFromLiquidity: boolean;
  spender?: string;
  BigValueThreshold: number;
  MaximumSwap: number;
  MaximumSwapFee: number;
  MinimumSwap: number;
  MinimumSwapFee: number;
  SwapFeeRatePerMillion: number;
  pairid: string;
  DepositAddress: string;
  BaseFeePercent: 0;
  sortId: 0;
  tokenType: string;
}

export interface DestChains {
  [key: string]: anyChain;
}
export interface EVMToken {
  name: string;
  symbol: string;
  decimals: number;
  address: string;
  price: number;
  logoUrl: string;
  destChains: DestChains;
}
