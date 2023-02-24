export interface TokenTx {
  blockNumber?: string;
  timeStamp?: string;
  hash?: string;
  nonce?: string;
  blockHash?: string;
  from?: string;
  contractAddress?: string;
  to?: string;
  value?: string;
  tokenName?: string;
  tokenSymbol?: string;
  tokenDecimal?: string;
  transactionIndex?: number;
  gas?: number;
  gasPrice?: number;
  gasUsed?: number;
  cumulativeGasUsed?: number;
  input?: string;
  confirmations?: string;
}

export interface TokenTxResponse {
  status?: string;
  message?: string;
  result?: TokenTx[];
}

export interface TokenTxRequest {
  address?: string;
  sort?: string;
  startblock?: number;
  offset?: number;
  page?: number;
  contractaddress?: string;
  symbol?: string;
}

export interface ChainBalanceRequest {
  address?: string;
}

export interface TokenBalance {
  symbol?: string;
  website?: string;
  iconUrl?: string;
  decimals?: number;
  address?: string;
  name?: string;
  coin?: number;
  type?: number;
  type_name?: string;
  uname?: string;
  gas_limit?: number;
  desc?: string;
  is_risk?: number;
  audited?: number;
  balance?: string;
}

export interface ChainBalance {
  balance?: number;
  tokens?: TokenBalance[];
}

export interface ChainBalanceResponse {
  code?: number;
  msg?: string;
  data?: ChainBalance;
}
