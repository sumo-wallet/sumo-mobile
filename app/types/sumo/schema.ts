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

export interface ErrorsError {
  code?: number;
  message?: string;
}

export interface HandlerChallengeData {
  challenge?: string;
}

export interface HandlerDappHomeResponse {
  banner?: ModelBanner[];
  category?: ModelCategory[];
  home_list?: ModelDApps[];
  hot_dapp?: ModelDApp[];
}

export interface HandlerFeature {
  deepLink?: string;
  logo?: string;
  name?: string;
  url?: string;
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

export interface HandlerPopularSearchResponse {
  data?: ModelSearchHistory[];
}

export interface HandlerResponseData {
  message?: string;
}

export interface HandlerSearchDappResponse {
  d_app?: ModelDApp[];
}

export interface HandlerTrackingUsageRequest {
  dapp_id?: number;
  from?: string;
}

export interface HandlerUpsertWalletResponse {
  data?: HandlerResponseData;
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
  /** query value */
  text?: string;
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

export interface V1MarketplaceSearchListParams {
  /** query value */
  text?: string;
}
