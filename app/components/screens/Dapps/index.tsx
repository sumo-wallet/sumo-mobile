/* eslint-disable @typescript-eslint/prefer-optional-chain */
import React from 'react';
import { StatusBar, ActivityIndicator } from 'react-native';
import { useDisclosure } from '@dwarvesf/react-hooks';
import { useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PagerView from 'react-native-pager-view';

import { useNavigator } from './../../hooks';
import { Style } from './../../../styles';
import { SearchBar } from './SearchBar';
import { DappListByCategory } from './DappListByCategory';
import { SecurityWarningModal } from './SecurityWarningModal';
import { ModelDApp } from './../../../types';
import { CategoryHeader } from './CategoryHeader';

import { ROUTES } from './../../../navigation/routes';
import { createNewTab, openDapp } from './../../../actions/browser';
import { useTheme } from './../../../util/theme';
import { useFetchDappHome } from './../../../services/dapp/useFetchDappHome';
import { useFetchDappRecent } from './../../../services/dapp/useFetchDappRecent';
import { AllDappList } from './AllDappList';

export const DappsScreen = React.memo(() => {
  const nav = useNavigator();
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const securityWarningModal = useDisclosure();
  const [curDapp, setDapp] = React.useState<ModelDApp>();
  const mounted = React.useRef<boolean>(false);
  const [pageIndex, setPageIndex] = React.useState(0);
  const pagerViewRef = React.useRef<PagerView>();

  const {
    hotDapp,
    homeList,
    category = [],
    mutate: mutateDappHome,
    // isLoading,
    // isValidating,
    isFirstLoading,
  } = useFetchDappHome();
  const { recent, mutate: mutateRecent } = useFetchDappRecent();

  const handleRefreshData = React.useCallback(() => {
    mutateRecent();
    mutateDappHome();
  }, [mutateDappHome, mutateRecent]);

  useFocusEffect(
    React.useCallback(() => {
      if (mounted?.current) {
        handleRefreshData();
      }
      mounted.current = true;
    }, [mounted, handleRefreshData]),
  );

  const handleConfirmWarning = React.useCallback(() => {
    if (curDapp && curDapp?.website) {
      dispatch(createNewTab(curDapp?.website));
      dispatch(openDapp({ dapp: curDapp }));
      nav.navigate(ROUTES.BrowserTabHome, { dapp: curDapp });
    }
    securityWarningModal.onClose();
  }, [curDapp, dispatch, nav, securityWarningModal]);

  const onTabChanged = (newIndex: number) => {
    setPageIndex(newIndex);
    if (pagerViewRef) {
      pagerViewRef.current?.setPage(newIndex);
    }
  };

  return (
    <SafeAreaView
      edges={['top']}
      style={Style.s({ flex: 1, bg: colors.background.default })}
    >
      <StatusBar barStyle="light-content" />
      <SearchBar placeholder="Search DApp or enter a link" />
      <CategoryHeader
        pageIndex={pageIndex}
        categories={category}
        setPageIndex={onTabChanged}
      />
      {isFirstLoading ? (
        <ActivityIndicator
          size="large"
          color={colors.primary.default}
          style={Style.s({ self: 'center' })}
        />
      ) : null}
      <PagerView
        ref={pagerViewRef as any}
        onPageSelected={(event) => {
          setPageIndex(event.nativeEvent.position);
        }}
        style={Style.s({ flex: 1 })}
      >
        <AllDappList
          dappByCate={homeList}
          hotDapp={hotDapp}
          recent={recent}
          onSelect={(dapp: ModelDApp) => {
            setDapp(dapp);
            securityWarningModal.onOpen();
          }}
        />
        {category.map((cate) => {
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
    </SafeAreaView>
  );
});
