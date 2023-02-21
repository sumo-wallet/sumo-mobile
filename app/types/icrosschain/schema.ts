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

export interface GetUserStakingInfoResponseUserStakingTokenInfo {
  stakingTokens?: ModelsCrossChainLiquidityTokens;
  amount?: string;
}

export interface SolanaRouteKeys {
  id?: string;
  baseMint?: string;
  quoteMint?: string;
  lpMint?: string;
  /** @format int64 */
  baseDecimals?: number;
  /** @format int64 */
  quoteDecimals?: number;
  /** @format int64 */
  lpDecimals?: number;
  /** @format int64 */
  version?: number;
  programId?: string;
  authority?: string;
  openOrders?: string;
  targetOrders?: string;
  baseVault?: string;
  quoteVault?: string;
  withdrawQueue?: string;
  lpVault?: string;
  /** @format int64 */
  marketVersion?: number;
  marketProgramId?: string;
  marketId?: string;
  marketAuthority?: string;
  marketBaseVault?: string;
  marketQuoteVault?: string;
  marketBids?: string;
  marketAsks?: string;
  marketEventQueue?: string;
}

export interface TxTokenInfoRouterElem {
  address?: string;
  symbol?: string;
  /** @format int64 */
  decimals?: number;
}

export interface ModelsAggregateStatisticByDay {
  /** @format date-time */
  time?: string;
  percentIncrease?: string;
  volume?: string;
}

export interface ModelsAggregateStatisticResponse {
  transactions?: ModelsAggregateStatisticByDay[];
  amountInUSD?: ModelsAggregateStatisticByDay[];
  /** @format int64 */
  totalUser?: number;
  /** @format int64 */
  supportBlockchain?: number;
  /** @format int64 */
  activeValidator?: number;
  /** @format int64 */
  totalTransaction?: number;
  /** @format int64 */
  assetsBridged?: number;
  transactionIn24Hour?: ModelsAggregateStatisticByDay;
  amountUSDIn24Hour?: ModelsAggregateStatisticByDay;
}

export interface ModelsChain {
  /** @format int64 */
  id?: number;
  name?: string;
  logo?: string;
  rpc?: string;
  dexes?: ModelsDex[];
  tokens?: ModelsToken[];
  code?: string;
  explorerUrl?: string;
  explorerName?: string;
  crossChainRouterAddress?: string;
}

export interface ModelsClaimHistory {
  txHash?: string;
  amount?: string;
  /** @format uint64 */
  time?: string;
  status?: string;
}

export interface ModelsCreateReferralRequest {
  referedBy?: string;
}

export interface ModelsCreateReferralResponse {
  status?: string;
}

export interface ModelsCrossChainLiquidityPools {
  id?: string;
  totalLiquidity?: string;
  volume24h?: string;
  lpApy?: string;
  farmingApy?: string;
  finalApy?: string;
  chain?: ModelsChain;
  yourLiquidity?: string;
  token?: ModelsToken;
}

export interface ModelsCrossChainLiquidityTokens {
  id?: string;
  name?: string;
  symbol?: string;
  totalLiquidity?: string;
  volume24h?: string;
  lpApy?: string;
  farmingApy?: string;
  finalApy?: string;
  logo?: string;
  yourLiquidity?: string;
  crossChainLiquidityPools?: ModelsCrossChainLiquidityPools[];
  yourLiquidityUSD?: string;
}

export interface ModelsDepositStakingResponse {
  status?: string;
}

export interface ModelsDex {
  id?: string;
  name?: string;
  contractVer?: string;
  factory?: string;
  router?: string;
  fee?: string;
  toCoin?: string;
  toToken?: string;
  /** @format int64 */
  chainId?: number;
  logo?: string;
  tokens?: ModelsToken[];
}

export interface ModelsEstimateSwapFeeRequest {
  from?: string;
  inToken?: ModelsEstimateSwapFeeRequestTxTokenInfo;
  outToken?: ModelsEstimateSwapFeeRequestTxTokenInfo;
  single?: boolean;
}

export interface ModelsEstimateSwapFeeRequestTxTokenInfo {
  amount?: string;
  tokenId?: string;
  dexId?: string;
  /** @format int64 */
  chainId?: number;
  /** @format float */
  slippage?: number;
  tokenAddress?: string;
}

export interface ModelsEstimateSwapFeeResponse {
  inToken?: ModelsEstimateSwapFeeResponseTxTokenInfo;
  outToken?: ModelsEstimateSwapFeeResponseTxTokenInfo;
  /** @format int64 */
  estimatedTime?: string;
  single?: boolean;
  referencePrice?: string;
  srcChainGas?: string;
  srcChainGasPrice?: string;
  dstChainGas?: string;
  dstChainGasPrice?: string;
  relayerGas?: string;
  swapAmountInUSDT?: string;
  crossChainHandlingFee?: string;
}

export interface ModelsEstimateSwapFeeResponseTxTokenInfo {
  amountIn?: string;
  /** @format int64 */
  decimalsIn?: number;
  amountOut?: string;
  /** @format int64 */
  decimalsOut?: number;
  crosschainHandlingFee?: string;
  /** @format float */
  priceImpact?: number;
  router?: TxTokenInfoRouterElem[];
  /** @format int64 */
  chainId?: number;
  routerAddress?: string;
  factoryAddress?: string;
  amountInUSD?: string;
  amountOutUSD?: string;
  amountOutWithSlippage?: string;
  amountInWithSlippage?: string;
  solanaRouter?: ModelsSolanaRoute[];
  minAmountOut?: string;
  fees?: string[];
  routeVersion?: string;
}

export interface ModelsGetAllChainResponse {
  chains?: ModelsChain[];
}

export interface ModelsGetAllSolanaPoolResponse {
  solanaPools?: ModelsSolanaPool[];
}

export interface ModelsGetChallengeResponse {
  challenge?: string;
}

export interface ModelsGetClaimHistoriesResponse {
  claimHistories?: ModelsClaimHistory[];
}

export interface ModelsGetClaimSignatureResponse {
  signature?: string;
  /** @format uint64 */
  claimId?: string;
  amount?: string;
  /** @format uint64 */
  expiredTime?: string;
}

export interface ModelsGetClaimStakingRewardSignatureResponse {
  signature?: string;
  /** @format uint64 */
  claimId?: string;
  amount?: string;
  /** @format uint64 */
  expiredTime?: string;
}

export interface ModelsGetFeeUSDStatisticResponse {
  byDays?: ModelsAggregateStatisticByDay[];
  within24Hours?: ModelsAggregateStatisticByDay;
}

export interface ModelsGetPoolsResponse {
  pools?: ModelsPool[];
}

export interface ModelsGetReferredUsersResponse {
  users?: ModelsReferredUser[];
}

export interface ModelsGetRefundsResponse {
  refunds?: ModelsRefund[];
}

export interface ModelsGetStakingPoolHistoriesResponse {
  stakingPoolHistories?: ModelsStakingPoolHistory[];
  /** @format int64 */
  totalPage?: number;
  /** @format int64 */
  page?: number;
  /** @format int64 */
  pageSize?: number;
  /** @format int64 */
  totalTx?: number;
}

export interface ModelsGetStakingPoolResponse {
  crossChainLiquidityTokens?: ModelsCrossChainLiquidityTokens[];
}

export interface ModelsGetSwapHistoryResponse {
  swapHistory?: ModelsSwapHistory[];
  /** @format int64 */
  totalPage?: number;
  /** @format int64 */
  page?: number;
  /** @format int64 */
  pageSize?: number;
  /** @format int64 */
  totalTx?: number;
}

export interface ModelsGetTokenListResponse {
  tokens?: ModelsToken[];
}

export interface ModelsGetTokenListsResponse {
  tokenLists?: ModelsTokenList[];
}

export interface ModelsGetTokensResponse {
  tokens?: ModelsToken[];
}

export interface ModelsGetTotalRewardResponse {
  walletAddress?: string;
  referedBy?: string;
  active?: boolean;
  rewardClaimed?: string;
  rewardAvailable?: string;
  totalSwapAmount?: string;
  withdraw?: boolean;
  hasPendingClaim?: boolean;
}

export interface ModelsGetTransactionHistoryResponse {
  swapHistory?: ModelsSwapHistory[];
  /** @format int64 */
  totalPage?: number;
  /** @format int64 */
  page?: number;
  /** @format int64 */
  pageSize?: number;
  /** @format int64 */
  totalTx?: number;
}

export interface ModelsGetUserStakingInfoResponse {
  totalStaking?: string;
  liquidityFeeEarning?: string;
  totalFarmingReward?: string;
  hasPendingClaim?: boolean;
  userStakingTokenInfos?: GetUserStakingInfoResponseUserStakingTokenInfo[];
}

export interface ModelsGetWithdrawStakingResponse {
  /** @format uint64 */
  id?: string;
  /** @format int64 */
  chainId?: number;
  amount?: string;
  tokenAddress?: string;
  lpReward?: string;
  apy?: string;
  signature?: string[];
}

export interface ModelsHealthzResponse {
  status?: string;
}

export interface ModelsIndexCustomTokenRequest {
  /** @format int64 */
  chainId?: number;
  tokenAddress?: string;
}

export interface ModelsIndexCustomTokenResponse {
  token?: ModelsToken;
}

export interface ModelsManuallyRetrySwapRequest {
  /** @format int64 */
  srcChainId?: number;
  srcTxHash?: string;
  isCross?: boolean;
  isAuto?: boolean;
}

export interface ModelsManuallyRetrySwapResponse {
  result?: string;
  swapHistory?: ModelsSwapHistory;
}

export interface ModelsPool {
  /** @format int64 */
  id?: number;
  contractAddress?: string;
  /** @format int64 */
  contractChainID?: number;
  token0?: ModelsToken;
  token1?: ModelsToken;
  /** @format double */
  tokenPerBlock?: number;
  isFinished?: boolean;
}

export interface ModelsReferredUser {
  id?: string;
  walletAddress?: string;
  referedBy?: string;
  active?: boolean;
  rewardClaimed?: string;
  rewardAvailable?: string;
  amountSwapUsd?: string;
  /** @format float */
  commissionLevel1?: number;
  /** @format float */
  commissionLevel2?: number;
  /** @format uint64 */
  referralExpiration?: string;
  /** @format int64 */
  level?: number;
}

export interface ModelsRefund {
  txHash?: string;
  status?: string;
  /** @format uint64 */
  timestamp?: string;
}

export interface ModelsRejectRefundRequest {
  txHash?: string;
}

export interface ModelsRejectRefundResponse {
  message?: string;
}

export interface ModelsRequestRefundRequest {
  txHash?: string;
  /** @format int64 */
  chainId?: number;
  userAddress?: string;
}

export interface ModelsRequestRefundResponse {
  message?: string;
}

export interface ModelsSolanaPool {
  id?: string;
  ammId?: string;
  authority?: string;
  openOrders?: string;
  targetOrders?: string;
  marketProgramId?: string;
  marketId?: string;
  marketBids?: string;
  marketAsks?: string;
  marketEventQueue?: string;
  marketBaseVault?: string;
  marketQuoteVault?: string;
  marketAuthority?: string;
  baseVault?: string;
  quoteVault?: string;
  /** @format int64 */
  baseDecimals?: number;
  /** @format int64 */
  quoteDecimals?: number;
  /** @format int64 */
  lpDecimals?: number;
  /** @format int64 */
  version?: number;
  token0?: string;
  token1?: string;
}

export interface ModelsSolanaRoute {
  source?: string;
  keys?: SolanaRouteKeys;
}

export interface ModelsStakingPoolHistory {
  status?: string;
  /** @format int64 */
  updateTime?: string;
  message?: string;
  txHash?: string;
  /** @format int64 */
  chainId?: number;
  info?: ModelsStakingPoolHistoryInfo;
}

export interface ModelsStakingPoolHistoryInfo {
  /** @format uint64 */
  id?: string;
  amount?: string;
  tokenAddress?: string;
  lpReward?: string;
  apy?: string;
  signature?: string[];
}

export interface ModelsSwapHistory {
  userAddress?: string;
  isSingle?: boolean;
  /** @format int64 */
  sourceChainId?: number;
  sourceChainTxHash?: string;
  sourceToken?: ModelsToken;
  sourceAmount?: string;
  sourceChainStatus?: string;
  /** @format int64 */
  destinationChainId?: number;
  destinationChainTxHash?: string;
  destinationToken?: ModelsToken;
  destinationAmount?: string;
  destinationChainStatus?: string;
  /** @format uint64 */
  timestamp?: string;
  /** @format float */
  fee?: number;
  refundStatus?: string;
  amountInUSD?: string;
  retryable?: boolean;
  refundable?: boolean;
  refund?: ModelsRefund;
}

export interface ModelsSwapSourceTxHashRequest {
  srcChainTxHash?: string;
  /** @format int64 */
  srcChainId?: number;
}

export interface ModelsSwapSourceTxHashResponse {
  result?: string;
}

export interface ModelsToken {
  id?: string;
  name?: string;
  address?: string;
  /** @format int64 */
  chainId?: number;
  /** @format int64 */
  decimals?: number;
  symbol?: string;
  logo?: string;
  recommendDexId?: string;
  dexIds?: string[];
}

export interface ModelsTokenList {
  name?: string;
  logo?: string;
  /** @format int64 */
  id?: number;
  /** @format int64 */
  total?: number;
}

export interface ModelsTrackSwapRequest {
  srcTxHash?: string;
  dstTxHash?: string;
  estimatedRouter?: ModelsEstimateSwapFeeResponse;
  userAddress?: string;
}

export interface ModelsTrackSwapResponse {
  srcTxHash?: string;
  srcTxStatus?: string;
  dstTxHash?: string;
  dstTxStatus?: string;
  single?: boolean;
  srcAmount?: string;
  dstAmount?: string;
  srcToken?: ModelsToken;
  dstToken?: ModelsToken;
}

export interface ModelsUpdateComfirmedClaimFarmingResponse {
  status?: string;
}

export interface ModelsUpdateComfirmedClaimReferredRewardResponse {
  status?: string;
}

export interface ModelsUpdateLPStatusResponse {
  status?: string;
}

export interface ProtobufAny {
  typeUrl?: string;
  /** @format byte */
  value?: string;
}

export interface RpcStatus {
  /** @format int32 */
  code?: number;
  message?: string;
  details?: ProtobufAny[];
}

export interface SwapGetRefundsParams {
  /** @format int64 */
  page?: number;
  /** @format int64 */
  pageSize?: number;
}

export interface SwapDepositStakingParams {
  txHash?: string;
  /** @format int64 */
  chainID?: number;
}

export interface SwapGetStakingPoolHistoriesParams {
  address?: string;
  /** @format int64 */
  page?: number;
  /** @format int64 */
  pageSize?: number;
}

export interface SwapGetStakingPoolsParams {
  address?: string;
}

export interface SwapUpdateComfirmedClaimFarmingParams {
  /** @format uint64 */
  claimId?: string;
}

export interface SwapUpdateLpStatusParams {
  txHash?: string;
  /** @format int64 */
  chainID?: number;
}

export interface SwapGetWithdrawStakingParams {
  poolId?: string;
  userAddress?: string;
  amount?: string;
}

export interface SwapGetSwapHistoryParams {
  /** @format int64 */
  page?: number;
  /** @format int64 */
  pageSize?: number;
  /** @format date-time */
  startTime?: string;
  /** @format date-time */
  endTime?: string;
  /** @format int64 */
  srcChainId?: number;
  /** @format int64 */
  dstChainId?: number;
  srcToken?: string;
  dstToken?: string;
  isAdmin?: boolean;
  userAddress: string;
}

export interface SwapGetTransactionHistoryParams {
  userAddress?: string;
  /** @format int64 */
  page?: number;
  /** @format int64 */
  pageSize?: number;
  srcTxHash?: string;
  dstTxHash?: string;
}

export interface SwapGetTokenParams {
  keyword?: string;
  /** @format int64 */
  chainId?: number;
}

export interface SwapGetChalengeParams {
  address?: string;
}

export interface SwapGetClaimHistoriesParams {
  address?: string;
}

export interface SwapGetClaimSignatureParams {
  /** @format int64 */
  chainId?: number;
}

export interface SwapGetReferredUsersParams {
  address?: string;
}

export interface SwapGetTotalRewardParams {
  address?: string;
}

export interface SwapUpdateComfirmedClaimReferredRewardParams {
  /** @format uint64 */
  claimId?: string;
}
