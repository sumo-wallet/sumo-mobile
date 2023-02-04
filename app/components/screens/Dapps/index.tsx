/* eslint-disable @typescript-eslint/prefer-optional-chain */
import React, { useState } from 'react';
import { View } from 'react-native';
import { useDisclosure } from '@dwarvesf/react-hooks';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import PagerView from 'react-native-pager-view';

import { useNavigator } from './../../hooks';
import { Style } from './../../../styles';
import { SearchBar } from './SearchBar';
import { DappListByCategory } from './DappListByCategory';
import { SecurityWarningModal } from './SecurityWarningModal';
import { ModelDApp, ModelCategory } from './../../../types';
import { CategoryHeader } from './CategoryHeader';

import { ROUTES } from './../../../navigation/routes';
import { openDapp } from './../../../actions/browser';
import { useTheme } from './../../../util/theme';
import { useFetchDappHome } from './../../../services/dapp/useFetchDappHome';
import { useFetchDappRecent } from './../../../services/dapp/useFetchDappRecent';
import { AllDappList } from './AllDappList';
import { showDappWarningAlert } from './../../../actions/dapp';
import Routes from '../../../constants/navigation/Routes';
import { useGetDappHome } from '../../hooks/DApp/useGetDappHome';

export const DappsScreen = React.memo(() => {
  const nav = useNavigator();
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const securityWarningModal = useDisclosure();
  const [curDapp, setDapp] = React.useState<ModelDApp>();
  const mounted = React.useRef<boolean>(false);
  const [pageIndex, setPageIndex] = React.useState(0);
  const pagerViewRef = React.useRef<PagerView>();
  const [searchText, setSearchText] = useState('');
  const showWarningAlert = useSelector(
    (state: any) => state.dapp.showWarningAlert,
  );

  React.useEffect(() => {
    console.log('showWarningAlert: ', showWarningAlert);
  }, [showWarningAlert]);

  const {
    hotDapp,
    homeList,
    category = [],
    categoryTab = [],
    isLoading: isFirstLoading,
  } = useGetDappHome();

  const { recent, mutate: mutateRecent } = useFetchDappRecent();

  // const handleRefreshData = React.useCallback(() => {
  //   mutateRecent();
  //   mutateDappHome();
  // }, [mutateDappHome, mutateRecent]);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     if (mounted?.current) {
  //       handleRefreshData();
  //     }
  //     mounted.current = true;
  //   }, [mounted, handleRefreshData]),
  // );

  const handleConfirmWarning = React.useCallback(() => {
    if (curDapp && curDapp?.website) {
      dispatch(showDappWarningAlert());
      dispatch(openDapp({ dapp: curDapp }));
      nav.navigate(Routes.BROWSER_TAB_HOME, {
        screen: Routes.BROWSER_VIEW,
        params: {
          newTabUrl: curDapp.website,
          timestamp: Date.now(),
        },
      });
    }
    securityWarningModal.onClose();
  }, [curDapp, dispatch, nav, securityWarningModal]);

  const onTabChanged = (newIndex: number) => {
    setPageIndex(newIndex);
    if (pagerViewRef) {
      pagerViewRef.current?.setPage(newIndex);
    }
  };

  const onSeeMoreCategory = React.useCallback(
    (item: ModelCategory) => {
      const matchedIndex = categoryTab.findIndex((cat) => cat.id === item?.id);
      if (matchedIndex > 0) {
        setPageIndex(matchedIndex);
        if (pagerViewRef) {
          pagerViewRef.current?.setPage(matchedIndex);
        }
      }
    },
    [category],
  );

  const onSubmitSearch = (text: string) => {
    if (text.startsWith('http')) {
      nav.navigate(Routes.BROWSER_TAB_HOME, {
        screen: Routes.BROWSER_VIEW,
        params: {
          newTabUrl: text,
          timestamp: Date.now(),
        },
      });
    } else {
      nav.navigate(ROUTES.DappSearch, { searchText: text });
    }
  };

  return (
    <SafeAreaView
      edges={['top']}
      style={Style.s({ flex: 1, bg: colors.background.default })}
    >
      <View style={{ flex: 1, zIndex: 999 }}>
        <SearchBar
          placeholder="Search DApp or enter a link"
          value={searchText}
          onInputSubmit={(value) => {
            setSearchText(value);
          }}
          onPressEnter={() => {
            onSubmitSearch(searchText);
          }}
        />
        <CategoryHeader
          pageIndex={pageIndex}
          categories={categoryTab}
          setPageIndex={onTabChanged}
        />
        {/* {isFirstLoading ? (
          <ActivityIndicator
            size="large"
            color={colors.primary.default}
            style={Style.s({ self: 'center' })}
          />
        ) : null} */}
        <PagerView
          ref={pagerViewRef as any}
          onPageSelected={(event) => {
            setPageIndex(event.nativeEvent.position);
          }}
          style={Style.s({ flex: 1 })}
        >
          <AllDappList
            dappByCate={homeList?.slice(1)}
            hotDapp={hotDapp}
            recent={recent}
            onSelect={(dapp: ModelDApp) => {
              setDapp(dapp);
              if (!showWarningAlert) {
                securityWarningModal.onOpen();
              } else {
                handleConfirmWarning();
              }
            }}
            onSeeMoreCategory={onSeeMoreCategory}
          />
          {categoryTab.slice(1).map((cate) => {
            return (
              <DappListByCategory
                key={`DappListByCategory.${cate.id}`}
                category={cate}
              />
            );
          })}
        </PagerView>

        <SecurityWarningModal
          isOpen={securityWarningModal.isOpen}
          onClose={securityWarningModal.onClose}
          onConfirm={handleConfirmWarning}
          onCancel={securityWarningModal.onClose}
        />
      </View>
    </SafeAreaView>
  );
});
