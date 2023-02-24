/* eslint-disable import/no-named-as-default-member */
// destructuring env keys might not work in old node versions
import qs from 'query-string';
import fetcher from './fetcher';
import { Client } from './apis';
import {
  ChainBalanceRequest,
  ChainBalanceResponse,
  TokenTxRequest,
  TokenTxResponse,
} from 'app/types/safepal/schema';

class SafepalClient extends Client {
  safepalBaseUrl = 'https://ap.isafepal.com/wallet/v1';

  //https://ap.isafepal.com/wallet/v1/fantom/tokentx?address=0xd6ea62e0c8b29478717bbedeaeb27e2541636359&sort=desc&startblock=0&page=1&offset=50&contractaddress=0x049d68029688eabf473097a2fc38ef61633a3c7a&symbol=fUSDT
  public getTokenTx(chain: string, request: TokenTxRequest) {
    return fetcher<TokenTxResponse>(
      `${this.safepalBaseUrl}/${chain}/tokentx?${qs.stringify(request)}`,
      {
        headers: this.headers,
      },
    );
  }
  //https://ap.isafepal.com/wallet/v1/eth/balances
  public getChainBalance(chain: string, body: ChainBalanceRequest) {
    return fetcher<ChainBalanceResponse>(
      `${this.safepalBaseUrl}/${chain}/balances`,
      {
        headers: this.headers,
        method: 'POST',
        body: JSON.stringify(body),
      },
    );
  }
}

const safepalClient = new SafepalClient();

export { safepalClient };
