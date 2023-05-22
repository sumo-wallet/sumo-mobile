interface IObjectKeys {
  [key: string]: any;
}

type chainId = string;

export interface RawChainIdInterface {
  key: {
    address: string; // Destination token address
    name: string; // Destination token name
    symbol: string; // Destination token symbol
    decimals: string; // Destination token decimals
    anytoken: {
      // Destination anytoken information
      address: string; //
      symbol: string; //
      decimals: string; //
    };
    fromanytoken: {
      // Source Chain anytoken information
      address: string; //
      symbol: string; //
      decimals: string; //
    };
    underlying: {
      // Destination underlying information, if it doesn't exist, return false.
      address: string; //
      symbol: string; //
      decimals: string; //
    };
    type: string; // The type of bridge tx. It would say router for most tokens. And it'd say swapin or swapout for older V2 setup.
    router: string; // router address. The address you interace with.
    tokenid: string; // tokenid
    routerABI: string; // The abi and function you cal to bridge this token.
    isLiquidity: string; // If liquidity is needed.
    isApprove: string; // Is approval needed.
    isFromLiquidity: string; // Is source chain liquidity shown on frontend.

    BigValueThreshold: string; // Big value threshold. It'd take longer over this threshold.
    MaximumSwap: string; // Maximum amount to bridge
    MaximumSwapFee: string; //
    MinimumSwap: string; // Minimal amount to bridge. Lower than this won't be processed.
    MinimumSwapFee: string; //
    SwapFeeRatePerMillion: string; // % of fee. 0.1 means 0.1% fee of the total amount.

    pairid: string; // pairid
    DepositAddress: string; // Deposit address for older V2 bridge setup.
    BaseFeePercent: string; // Fee percentage for V2 bridge.
    sortId: string; //
    chainId: string; // chainId
    tokenType: string; // token type.
  };
}

export interface ExplorerInterface {
  address: string;
  tx: string;
}

export interface RawTokenByChainInterface extends IObjectKeys {
  chainId: chainId; // Source Chain ID
  address: string; //  token address
  name: string; // token name
  symbol: string; // token symbol
  decimals: string; // token decimals
  price: string; // token price
  logoUrl: string; // token logo url
  tokenType: string; // This is either "NATIVE" for native gas token or "TOKEN" for all other tokens
  destChains: Record<chainId, RawChainIdInterface>;
  explorer?: ExplorerInterface;
  explorer_cn?: ExplorerInterface;
  id: string;
}
