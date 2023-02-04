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

export interface BridgeBridgeChainResponse {
  data?: ModelChain[];
}

export interface BridgeBridgeTokenResponse {
  data?: ModelBridgeChain[];
}

export interface BridgeBridgeTransaction {
  amount?: number;
  contractAddress?: string;
  fromChainId?: number;
  fromTxHash?: string;
  id?: number;
  receiverAddress?: string;
  toChainId?: number;
  toTxHash?: string;
  tokenAddress?: string;
  walletAddress?: string;
}

export interface BridgeNewBridgeTransactionRequest {
  amount?: number;
  contractAddress?: string;
  fromChainId?: number;
  toChainId?: number;
  tokenAddress?: string;
  txHash?: string;
  walletAddress?: string;
}

export interface BridgeNewBridgeTransactionResponse {
  data?: BridgeBridgeTransaction;
}

export interface BridgeUpdateBridgeTransactionRequest {
  bridgeStatus?: string;
  fromChainId?: number;
  fromTxHash?: string;
  receivedAmount?: number;
  toStatus?: string;
  transactionId?: number;
}

export interface BridgeUpdateBridgeTransactionResponse {
  data?: BridgeBridgeTransaction;
}

export interface DappDappHomeResponse {
  banner?: ModelBanner[];
  category?: ModelCategory[];
  home_list?: ModelDApps[];
  hot_dapp?: ModelDApp[];
}

export interface DappPopularSearchResponse {
  data?: ModelSearchHistory[];
}

export interface DappSearchDappResponse {
  d_app?: ModelDApp[];
}

export interface DappTrackingUsageRequest {
  dapp_id?: number;
  from?: string;
}

export interface ErrorsError {
  code?: number;
  message?: string;
}

export interface HandlerChallengeData {
  challenge?: string;
}

export interface HandlerFeature {
  deepLink?: string;
  logo?: string;
  name?: string;
  url?: string;
}

export interface HandlerChainResponse {
  data?: ModelChain[];
}

export interface HandlerCreateReferralRequest {
  walletAddress?: string;
}

export interface HandlerGetChallengeResponse {
  data?: HandlerChallengeData;
}

export interface HandlerGetSystemConfigResponse {
  data?: ModelSystemConfig[];
}

export interface HandlerListReferralResponse {
  data?: ModelReferralData[];
}

export interface HandlerMarketResponse {
  data?: ModelNotification[];
}

export interface HandlerMyProfileResponse {
  data?: ModelUser;
}

export interface HandlerNewWalletRequest {
  newWallet?: string;
  userId?: string;
}

export interface HandlerNewWalletResponse {
  data?: ModelWallet;
}

export interface HandlerNotificationResponse {
  data?: ModelNotification[];
}

export interface HandlerResponseData {
  message?: string;
}

export interface HandlerRpcResponse {
  data?: ModelRpc[];
}

export interface HandlerUpsertWalletResponse {
  data?: HandlerResponseData;
}

export interface HandlerWalletConfigResponse {
  build?: number;
  support_url?: string;
  version?: string;
}

export interface HandlerWalletHomeConfigResponse {
  banner?: ModelBanner[];
  hotDapp?: ModelCategoryApp[];
  hotFeature?: HandlerFeature[];
  hotToken?: string;
  showNew?: boolean;
}

export interface HandlerWalletInfoResponse {
  BCFBalance?: number;
  CYCBalance?: number;
  canDeposit?: boolean;
  canWithdraw?: boolean;
  exchangeDepositPercent?: number;
  exchangeWithdrawPercent?: number;
}

export interface MarketplaceBuyNFTRequest {
  contractAddress?: string;
  itemType?: string;
  tokenId?: string;
  txHash?: string;
}

export interface MarketplaceBuyNFTResponse {
  data?: MarketplaceResponseData;
}

export interface MarketplaceCollectionCategory {
  color?: string;
  imageUrl?: string;
  name?: string;
}

export interface MarketplaceCollectionCategoryResponse {
  data?: MarketplaceCollectionCategory[];
}

export interface MarketplaceCollectionResponse {
  data?: ModelCollection[];
  pageNumber?: number;
  pageSize?: number;
  totalPage?: number;
}

export interface MarketplaceHotAuctionResponse {
  data?: ModelMarketItemData[];
}

export interface MarketplaceItemListingResponse {
  data?: ModelMarketItemData[];
  total?: number;
}

export interface MarketplaceResponseData {
  message?: string;
}

export interface MarketplaceSellNFTRequest {
  contractAddress?: string;
  price?: number;
  sellTokenAddress?: string;
  tokenId?: string;
  txHash?: string;
  type?: number;
}

export interface MarketplaceSellNFTResponse {
  data?: ModelMarketplace;
}

export interface ModelBanner {
  created_at?: string;
  id?: number;
  location?: string;
  name?: string;
  order?: number;
  status?: string;
  thumbnail?: string;
  updated_at?: string;
  url?: string;
}

export interface ModelBridgeChain {
  created_at?: string;
  desChain?: ModelChain;
  desChainId?: number;
  id?: number;
  scrChainId?: number;
  srcChain?: ModelChain;
  srcTokenAddress?: string;
  status?: string;
  tokenConfigJson?: string;
  updated_at?: string;
}

export interface ModelCategory {
  chain_id?: number;
  created_at?: string;
  id?: number;
  name?: string;
  order?: number;
  status?: string;
  updated_at?: string;
}

export interface ModelCategoryApp {
  app_id?: number;
  category?: ModelCategory;
  category_id?: number;
  created_at?: string;
  dapp?: ModelDApp;
  id?: number;
  updated_at?: string;
}

export interface ModelChain {
  created_at?: string;
  currency?: string;
  explorer_name?: string;
  explorer_url?: string;
  finality?: number;
  id?: number;
  logo?: string;
  multicall_address?: string;
  name?: string;
  status?: string;
  symbol?: string;
  updated_at?: string;
}

export interface ModelCollection {
  background_color?: string;
  banner_image_url?: string;
  created_at?: string;
  description?: string;
  editors?: string;
  external_link?: string;
  fees?: string;
  id?: number;
  image_url?: string;
  is_rarity_enabled?: boolean;
  name?: string;
  payment_tokens?: string;
  primary_asset_contracts?: string;
  safelist_request_status?: string;
  /** Traits                string    `json:"traits"` */
  slug?: string;
  stats?: ModelCollectionStats;
  stats_id?: number;
}

export interface ModelCollectionStats {
  average_price?: number;
  count?: number;
  floor_price?: number;
  id?: number;
  market_cap?: number;
  num_owners?: number;
  num_reports?: number;
  one_day_average_price?: number;
  one_day_change?: number;
  one_day_difference?: number;
  one_day_sales?: number;
  one_day_sales_change?: number;
  one_day_volume?: number;
  one_hour_average_price?: number;
  one_hour_change?: number;
  one_hour_difference?: number;
  one_hour_sales?: number;
  one_hour_sales_change?: number;
  one_hour_volume?: number;
  seven_day_average_price?: number;
  seven_day_change?: number;
  seven_day_difference?: number;
  seven_day_sales?: number;
  seven_day_volume?: number;
  six_hour_average_price?: number;
  six_hour_change?: number;
  six_hour_difference?: number;
  six_hour_sales?: number;
  six_hour_sales_change?: number;
  thirty_day_average_price?: number;
  thirty_day_change?: number;
  thirty_day_difference?: number;
  thirty_day_sales?: number;
  thirty_day_volume?: number;
  total_sales?: number;
  total_supply?: number;
  total_volume?: number;
}

export interface ModelDApp {
  chain?: ModelChain;
  chain_id?: number;
  created_at?: string;
  description?: string;
  id?: number;
  logo?: string;
  name?: string;
  order?: number;
  status?: string;
  thumbnail?: string;
  updated_at?: string;
  usage_count?: number;
  website?: string;
}

export interface ModelDApps {
  app?: ModelDApp[];
  category?: ModelCategory;
}

export interface ModelMarketItemData {
  chainId?: number;
  description?: string;
  id?: string;
  name?: string;
  nftAddress?: string;
  owner_address?: string;
  paymentAssets?: string;
  paymentSymbol?: string;
  price?: number;
  product_type?: number;
  slug?: string;
  status?: string;
  token_id?: string;
  type?: string;
}

export interface ModelMarketplace {
  chainId?: number;
  collectionAddress?: string;
  createdAt?: string;
  id?: string;
  imageUrl?: string;
  ownerAddress?: string;
  paymentAssets?: string;
  paymentSymbol?: string;
  price?: number;
  saleType?: number;
  status?: string;
  token_id?: string;
  type?: number;
  updatedAt?: string;
}

export interface ModelNotification {
  created_at?: string;
  deep_link?: string;
  icon?: string;
  id?: number;
  location?: string;
  status?: string;
  title?: string;
  type?: string;
  updated_at?: string;
  url?: string;
}

export interface ModelReferralData {
  bonus_for_referrer?: string;
  referral_date?: string;
  wallet_address?: string;
}

export interface ModelRpc {
  chain_id?: number;
  created_at?: string;
  id?: number;
  updated_at?: string;
  url?: string;
}

export interface ModelSearchHistory {
  created_at?: string;
  id?: number;
  search?: number;
  search_text?: string;
  updated_at?: string;
}

export interface ModelSystemConfig {
  created_at?: string;
  data?: number[];
  id?: string;
  name?: string;
  updated_at?: string;
}

export interface ModelUser {
  account_status?: number;
  bcf_balance?: number;
  bcf_daily_earn?: number;
  bnb_balance?: number;
  bonus_energy?: number;
  bonus_for_referrer?: string;
  busd_balance?: number;
  change_bike?: number;
  created_at?: string;
  cyc_balance?: number;
  cyc_cap?: number;
  cyc_daily_earn?: number;
  daily_donation?: number;
  email?: string;
  energy?: number;
  gender?: string;
  id?: number;
  max_energy?: number;
  name?: string;
  network?: string;
  next_refill?: number;
  otp_status?: number;
  private_key?: string;
  public_key?: string;
  referral_date?: string;
  referred_by?: string;
  referrer?: ModelUser;
  status?: string;
  total_bike?: number;
  total_distance?: number;
  total_session?: number;
  total_time?: number;
  updated_at?: string;
  wallet_address?: string;
}

export interface ModelWallet {
  address?: string;
  id?: number;
  user_id?: number;
}

export interface V1AuthChallengeListParams {
  /** wallet address */
  address: string;
}

export interface V1AuthEmailOtpListParams {
  /** email */
  email: string;
}

export interface V1AuthUpsertWalletCreateParams {
  /** wallet address */
  walletAddress: string;
}

export interface V1BridgeChainListParams {
  /** source token */
  tokenAddress?: string;
  /** source chain id */
  chainId?: number;
}

export interface V1BridgeSyncListParams {
  /** chain id */
  chainId?: number;
}

export interface V1BridgeTokenListParams {
  /** from chain id */
  fromChainId?: number;
  /** to chain id */
  toChainId?: number;
}

export interface V1BridgeTransactionsListParams {
  /** wallet address */
  walletAddress?: string;
}

export interface V1CollectionCategoryListParams {
  /** query value */
  language?: string;
}

export interface V1CollectionSearchListParams {
  /** query value */
  text?: string;
  /** pageNumber */
  pageNumber?: string;
  /** pageSize */
  pageSize?: string;
}

export interface V1DappCategoryIdListParams {
  /** pageNumber */
  pageNumber?: string;
  /** pageSize */
  pageSize?: string;
  /** id */
  id: number;
}

export interface V1DappSearchListParams {
  /** query value */
  text?: string;
  /** pageNumber */
  pageNumber?: string;
  /** pageSize */
  pageSize?: string;
}

export interface V1MarketSearchListParams {
  /** query value */
  text?: string;
}

export interface V1MarketplaceAssetsListParams {
  /** pageNumber */
  pageNumber?: string;
  /** pageSize */
  pageSize?: string;
  /** nft type ERC-721, ERC-1155 */
  type?: string;
  /** 0 | 32 */
  priceMin?: number;
  /** 1 | 32 */
  priceMax?: number;
  /** name of collection */
  collections?: string;
  /** sell token like usd, eth, sol */
  symbol?: string;
  /** chain like avalanche, arbitrum */
  chains?: string;
  /** eth, usdt, bnb */
  paymentAssets?: string;
  /** price asc | desc | latest */
  sort?: string;
  /** price, createAt */
  sortField?: string;
}

export interface V1MarketplaceCollectionTopListParams {
  /** query value */
  text?: string;
  /** pageNumber */
  pageNumber?: string;
  /** pageSize */
  pageSize?: string;
}

export interface V1MarketplaceCollectionTrendingListParams {
  /** pageNumber */
  pageNumber?: string;
  /** pageSize */
  pageSize?: string;
}

export interface V1MarketplaceHotAuctionListParams {
  /** query value */
  language?: string;
}
