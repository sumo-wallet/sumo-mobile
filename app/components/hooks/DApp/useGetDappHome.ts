import { ModelBanner, ModelCategory, ModelDApp, ModelDApps } from 'app/types';
import { useCallback, useState, useEffect } from 'react';
import { client } from '../../../services/apis';
import useErrorHandler from '../useErrorHandler.hook';

interface DappHomeConfig {
  isLoading: boolean;
  banner?: ModelBanner[];
  category?: ModelCategory[];
  categoryTab?: ModelCategory[];
  homeList?: ModelDApps[];
  hotDapp?: ModelDApp[];
  getDAppHome: () => void;
}

export function useGetDappHome(): DappHomeConfig {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [banner, setBanner] = useState<ModelBanner[]>();
  const [category, setCategory] = useState<ModelCategory[]>();
  const [categoryTab, setCategoryTab] = useState<ModelCategory[]>();
  const [homeList, setHomeList] = useState<ModelDApps[]>();
  const [hotDapp, setHotDapp] = useState<ModelDApp[]>();
  const errorHandler = useErrorHandler();

  const getDAppHome = useCallback(async () => {
    try {
      setLoading(true);
      const res = await client.getDappHome();
      if (res != null) {
        setBanner(res?.banner);

        if (res?.category) {
          // Add tab favorite to dapp category
          const serverCategory = res?.category;
          const catFavorites: ModelCategory = {
            name: 'Favorites',
            id: 1000000,
            order: 2,
            status: 'active',
          };
          const localCategory = [
            serverCategory[0],
            catFavorites,
            ...serverCategory.slice(1),
          ];

          setCategoryTab(localCategory);
        }
        setCategory(res?.category?.slice(1));
        setHomeList(res?.home_list);
        setHotDapp(res?.hot_dapp);
      }
    } catch (error) {
      await errorHandler(error);
    } finally {
      setLoading(false);
    }
  }, [errorHandler]);

  useEffect(() => {
    getDAppHome().then();
  }, [getDAppHome]);

  return {
    isLoading,
    banner,
    category,
    categoryTab,
    homeList,
    hotDapp,
    getDAppHome,
  };
}
