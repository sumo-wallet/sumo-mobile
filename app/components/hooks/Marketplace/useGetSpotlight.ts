import { ModelMarketItemData } from 'app/types';
import { useCallback, useState, useEffect } from 'react';
import { client } from '../../../services/apis';
import useErrorHandler from '../useErrorHandler.hook';

interface SpotlightNFT {
  isLoadingAuction: boolean;
  datas: ModelMarketItemData[];
  hasMore: boolean;
}
const auctionDemo = [
  {
    chainId: 1,
    description: 'DigiDaigaku Dragon Eggs',
    id: '6045',
    name: 'DigiDaigaku Dragon Eggs #6045',
    nftAddress: '0xaabc3aef1ce0d23eeaabfc7c6cd9043fcebf7400',
    owner_address: 'string',
    paymentAssets: 'string',
    paymentSymbol: 'ETH',
    price: 0.259,
    product_type: 1,
    slug: 'digidaigakudragoneggs',
    status: 'active',
    token_id: '6045',
    type: '1',
    imageUrl: 'https://i.seadn.io/gcs/files/78658828d9114fa802f5c9920a8fa895.gif?auto=format&w=1000'
  },
  {
    chainId: 1,
    description: 'Behind Their Eyes',
    id: 'Angel',
    name: 'Angel',
    nftAddress: '0xaabc3aef1ce0d23eeaabfc7c6cd9043fcebf7400',
    owner_address: 'string',
    paymentAssets: 'string',
    paymentSymbol: 'ETH',
    price: 0.125,
    product_type: 1,
    slug: 'behindtheireyes',
    status: 'active',
    token_id: '1',
    type: '1',
    imageUrl: 'https://i.seadn.io/gae/Sh3mVLRkI9f44CRhVTrW93Fh6NBW-LhZ69kLHf6SNwS8Qd_4vyDkz5yWB6_jFUpbIJgGm3TakhQyfyYsn5PFaBt5NTVpgR7M6Yfd?auto=format&w=1000'
  },
  {
    chainId: 1,
    description: 'Castaways - Genesis',
    id: '941',
    name: 'Castaway #941',
    nftAddress: '0xde721b3c38cbfabcdfcc29f0bc320efeb5c245ef',
    owner_address: 'string',
    paymentAssets: 'string',
    paymentSymbol: 'ETH',
    price: 2.3,
    product_type: 1,
    slug: 'castaways-genesis',
    status: 'active',
    token_id: '1',
    type: '1',
    imageUrl: 'https://i.seadn.io/gcs/files/cb6d00a993695763d8c7710d0bfb0a76.jpg?auto=format&w=1000'
  },
];

export function useGetSpotlight(): SpotlightNFT {
  const [isLoadingAuction, setLoadingAuction] = useState<boolean>(false);
  const [datas, setDatas] = useState<ModelMarketItemData[]>(auctionDemo);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const errorHandler = useErrorHandler();

  const getListCategory = useCallback(async () => {
    try {
      setLoadingAuction(true);
      const res = await client.getHotAuction();
      if (res.data && res.data?.length > 0) {
        setDatas(res.data);
      } else {
        setHasMore(true);
      }
    } catch (error) {
      await errorHandler(error);
    } finally {
      setLoadingAuction(false);
    }
  }, [errorHandler]);

  // useEffect(() => {
  //   getListCategory().then();
  // }, [getListCategory]);

  return { isLoadingAuction, datas, hasMore };
}
