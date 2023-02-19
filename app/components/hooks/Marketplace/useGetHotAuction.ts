import { ModelMarketItemData } from 'app/types';
import { useCallback, useState, useEffect } from 'react';
import { client } from '../../../services/apis';
import useErrorHandler from '../useErrorHandler.hook';

interface HotAuctions {
  isLoadingAuction: boolean;
  auctions: ModelMarketItemData[];
  hasMore: boolean;
}
const auctionDemo = [
  {
    chainId: 1,
    description: 'Auction 1',
    id: '111111',
    name: 'Macas #12',
    nftAddress: 'string',
    owner_address: 'string',
    paymentAssets: 'string',
    paymentSymbol: 'ETH',
    price: 10.01,
    product_type: 1,
    slug: 'macas12',
    status: 'active',
    token_id: '12',
    type: '1',
  },
];

export function useGetHotAuction(): HotAuctions {
  const [isLoadingAuction, setLoadingAuction] = useState<boolean>(false);
  const [auctions, setAuctions] = useState<ModelMarketItemData[]>(auctionDemo);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const errorHandler = useErrorHandler();

  const getListCategory = useCallback(async () => {
    try {
      setLoadingAuction(true);
      const res = await client.getHotAuction();
      if (res.data && res.data?.length > 0) {
        setAuctions(res.data);
      } else {
        setHasMore(true);
      }
    } catch (error) {
      await errorHandler(error);
    } finally {
      setLoadingAuction(false);
    }
  }, [errorHandler]);

  useEffect(() => {
    getListCategory().then();
  }, [getListCategory]);

  return { isLoadingAuction, auctions, hasMore };
}
