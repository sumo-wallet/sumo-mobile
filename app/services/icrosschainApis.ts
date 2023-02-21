/* eslint-disable import/no-named-as-default-member */
// destructuring env keys might not work in old node versions
import qs from 'query-string';
import fetcher from './fetcher';
import { Client } from './apis';
import {
  ModelsEstimateSwapFeeRequest,
  ModelsEstimateSwapFeeResponse,
  ModelsGetAllChainResponse,
  ModelsSwapSourceTxHashRequest,
  ModelsSwapSourceTxHashResponse,
  ModelsToken,
  ModelsTrackSwapRequest,
  ModelsTrackSwapResponse,
} from './../types/icrosschain/schema';

class ICrossChainClient extends Client {
  icrosschainBaseUrl = 'https://prod3-api.bicyclefi.io';

  public getICrosschainChains() {
    return fetcher<ModelsGetAllChainResponse>(
      `${this.icrosschainBaseUrl}/api/v1/chains`,
      {
        headers: this.headers,
      },
    );
  }
  public searchToken(token: string, chainId: number) {
    return fetcher<ModelsGetAllChainResponse>(
      `${this.icrosschainBaseUrl}/api/v1/token?keyword=${token}&chainId=${chainId}}`,
      {
        headers: this.headers,
      },
    );
  }
  public estimateSwap(body: ModelsEstimateSwapFeeRequest) {
    return fetcher<ModelsEstimateSwapFeeResponse>(
      `${this.icrosschainBaseUrl}/api/v1/swap/estimate-fee-2`,
      {
        headers: this.headers,
        method: 'POST',
        body: JSON.stringify(body),
      },
    );
  }
  public track(body: ModelsTrackSwapRequest) {
    return fetcher<ModelsTrackSwapResponse>(
      `${this.icrosschainBaseUrl}/api/v1/swap/track`,
      {
        headers: this.headers,
        method: 'POST',
        body: JSON.stringify(body),
      },
    );
  }
  public callbackSourceTransaction(body: ModelsSwapSourceTxHashRequest) {
    return fetcher<ModelsSwapSourceTxHashResponse>(
      `${this.icrosschainBaseUrl}/api/v1/swap/source-txhash`,
      {
        headers: this.headers,
        method: 'POST',
        body: JSON.stringify(body),
      },
    );
  }
}

const iClient = new ICrossChainClient();

export { iClient };
