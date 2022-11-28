import { Ticker } from 'app/types';
import Logger from '../../util/Logger';
import { useCallback, useState, useEffect } from 'react';
import { client } from '../../services/apis';
import useErrorHandler from './useErrorHandler.hook';

interface TickersValues {
  isGetList: boolean;
  tickers: Ticker[];
  hasMore: boolean;
}

export function useGetTickers(tickerSymbols: string): TickersValues {
  const [isGetList, setGetList] = useState<boolean>(false);
  const [tickers, setTicker] = useState<Ticker[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const errorHandler = useErrorHandler();

  const getListTickers = useCallback(async () => {
    try {
      setGetList(true);
      const res = await client.getCoindeskTickers(tickerSymbols);
      Logger.log('getListTickers', JSON.stringify(res));
      const items:
        | ((prevState: Ticker[]) => Ticker[])
        | {
          iso: any;
          name: any;
          slug: any;
          url: string;
          changePercent: any;
          changeValue: any;
          timestamp: any;
          priceO: any;
          priceH: any;
          priceL: any;
          priceC: any;
          circulatingSupply: any;
          marketCap: any;
        }[] = [];
      items.push({
        iso: res.data.BTC.iso,
        name: res.data.BTC.name,
        slug: res.data.BTC.slug,
        url: 'https://www.coindesk.com/price/bitcoin/',
        changePercent: res.data.BTC.change.percent,
        changeValue: res.data.BTC.change.value,
        timestamp: res.data.BTC.timestamp,
        priceO: res.data.BTC.ohlc.o,
        priceH: res.data.BTC.ohlc.h,
        priceL: res.data.BTC.ohlc.l,
        priceC: res.data.BTC.ohlc.c,
        circulatingSupply: res.data.BTC.ohlc.circulatingSupply,
        marketCap: res.data.BTC.ohlc.marketCap,
      });

      items.push({
        iso: res.data.ETH.iso,
        name: res.data.ETH.name,
        slug: res.data.ETH.slug,
        url: 'https://www.coindesk.com/price/ethereum/',
        changePercent: res.data.ETH.change.percent,
        changeValue: res.data.ETH.change.value,
        timestamp: res.data.ETH.timestamp,
        priceO: res.data.ETH.ohlc.o,
        priceH: res.data.ETH.ohlc.h,
        priceL: res.data.ETH.ohlc.l,
        priceC: res.data.ETH.ohlc.c,
        circulatingSupply: res.data.ETH.ohlc.circulatingSupply,
        marketCap: res.data.ETH.ohlc.marketCap,
      });

      items.push({
        iso: res.data.BNB.iso,
        name: res.data.BNB.name,
        slug: res.data.BNB.slug,
        url: 'https://www.coindesk.com/price/binance-coin/',
        changePercent: res.data.BNB.change.percent,
        changeValue: res.data.BNB.change.value,
        timestamp: res.data.BNB.timestamp,
        priceO: res.data.BNB.ohlc.o,
        priceH: res.data.BNB.ohlc.h,
        priceL: res.data.BNB.ohlc.l,
        priceC: res.data.BNB.ohlc.c,
        circulatingSupply: res.data.BNB.ohlc.circulatingSupply,
        marketCap: res.data.BNB.ohlc.marketCap,
      });

      items.push({
        iso: res.data.XRP.iso,
        name: res.data.XRP.name,
        slug: res.data.XRP.slug,
        url: 'https://www.coindesk.com/price/xrp/',
        changePercent: res.data.XRP.change.percent,
        changeValue: res.data.XRP.change.value,
        timestamp: res.data.XRP.timestamp,
        priceO: res.data.XRP.ohlc.o,
        priceH: res.data.XRP.ohlc.h,
        priceL: res.data.XRP.ohlc.l,
        priceC: res.data.XRP.ohlc.c,
        circulatingSupply: res.data.XRP.ohlc.circulatingSupply,
        marketCap: res.data.XRP.ohlc.marketCap,
      });

      // if (res?.data.length > 0) {
      //   // eslint-disable-next-line @typescript-eslint/no-shadow
      //   res?.data.forEach((element: any) => {
      //     newsData.push({
      //       iso: element.iso,
      //       name: element.name,
      //       slug: element.slug,
      //       url: '',
      //       changePercent: element.change.percent,
      //       changeValue: element.change.value,
      //       timestamp: element.ts,
      //       priceO: element.ohlc.o,
      //       priceH: element.ohlc.h,
      //       priceL: element.ohlc.l,
      //       priceC: element.ohlc.c,
      //       circulatingSupply: element.circulatingSupply,
      //       marketCap: element.marketCap,
      //     });
      //   });
      //   items.push({
      //     iso: res.data.BTC.iso,
      //     name: res.data.BTC.name,
      //     slug: res.data.BTC.slug,
      //     url: '',
      //     changePercent: res.data.BTC.change.percent,
      //     changeValue: res.data.BTC.change.value,
      //     timestamp: res.data.BTC.ts,
      //     priceO: res.data.BTC.ohlc.o,
      //     priceH: res.data.BTC.ohlc.h,
      //     priceL: res.data.BTC.ohlc.l,
      //     priceC: res.data.BTC.ohlc.c,
      //     circulatingSupply: res.data.BTC.circulatingSupply,
      //     marketCap: res.data.BTC.marketCap,
      //   });
      //   setTicker(items);
      // } else {
      //   setHasMore(true);
      // }
      setTicker(items);
    } catch (error) {
      await errorHandler(error);
    } finally {
      setGetList(false);
    }
  }, [errorHandler, tickerSymbols]);

  useEffect(() => {
    getListTickers().then();
  }, [getListTickers]);

  return { isGetList, tickers, hasMore };
}
