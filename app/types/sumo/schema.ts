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
  data?: ModelBridgeChain[];
}

export interface BridgeBridgeTokenResponse {
  data?: ModelBridgeToken[];
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
  chain_id?: number;
  created_at?: string;
  id?: number;
  status?: boolean;
  token?: ModelChain;
  updated_at?: string;
}

export interface ModelBridgeToken {
  address?: string;
  created_at?: string;
  destination_chain_id?: number;
  id?: number;
  source_chain_id?: number;
  token?: ModelToken;
  token_id?: number;
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
  collectionStatisticId?: number;
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
  slug?: string;
  stats?: string;
  token_id?: number;
  traits?: string;
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
  class?: string;
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
  static?: string;
  status?: string;
  token_id?: string;
  type?: string;
}

export interface ModelMarketplace {
  class?: string;
  collectionAddress?: string;
  createdAt?: string;
  id?: string;
  item_id?: string;
  level?: number;
  mint?: number;
  ownerAddress?: string;
  paymentAssets?: string;
  paymentSymbol?: string;
  price?: number;
  productType?: number;
  saleType?: number;
  status?: string;
  tier?: string;
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

export interface ModelToken {
  address?: string;
  chain_id?: number;
  created_at?: string;
  decimals?: number;
  description?: string;
  email?: string;
  eth_transfers_count?: number;
  holders?: number;
  holders_count?: number;
  id?: number;
  issuances_count?: number;
  logo?: string;
  max_supply_formatted?: number;
  name?: string;
  owner?: string;
  symbol?: string;
  telegram?: string;
  token_audit?: ModelTokenAudit;
  token_audit_id?: number;
  total_supply?: number;
  total_supply_formatted?: number;
  transfers_count?: number;
  twitter?: string;
  txs_count?: number;
  type?: number;
  updated_at?: string;
  website?: string;
}

export interface ModelTokenAudit {
  code_verified?: boolean;
  created_at?: string;
  id?: number;
  lock_transactions?: boolean;
  mint?: boolean;
  proxy?: boolean;
  status?: string;
  token_address?: number;
  unlimited_fees?: boolean;
  updated_at?: string;
  version?: number;
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

export interface V1BridgeTokenListParams {
  /** chain id */
  chainId?: number;
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

export interface V1MarketplaceHotAuctionListParams {
  /** query value */
  language?: string;
}

export interface V1MarketplaceTrendingCollectionListParams {
  /** query value */
  text?: string;
  /** pageNumber */
  pageNumber?: string;
  /** pageSize */
  pageSize?: string;
}
