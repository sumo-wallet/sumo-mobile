/* eslint-disable @typescript-eslint/prefer-optional-chain */
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { useDisclosure } from '@dwarvesf/react-hooks';
import { useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

import { useNavigator } from './../../hooks';
import { Style } from './../../../styles';
import { SearchBar } from './SearchBar';
import { NowTrending } from './NowTrending';
import { AppGroupPager } from './AppGroupPager';
import { SearchRecent } from './SearchRecent';
import { SecurityWarningModal } from './SecurityWarningModal';
import { ModelDApp } from './../../../types';
import { CategoryHeader } from './CategoryHeader';

import { ROUTES } from './../../../navigation/routes';
import { createNewTab, openDapp } from './../../../actions/browser';
import { useTheme } from './../../../util/theme';
import { useFetchDappHome } from './../../../services/dapp/useFetchDappHome';
import { useFetchDappRecent } from './../../../services/dapp/useFetchDappRecent';

export const DappsScreen = React.memo(() => {
  const nav = useNavigator();
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const securityWarningModal = useDisclosure();
  const [curDapp, setDapp] = React.useState<ModelDApp>();
  const mounted = React.useRef<boolean>(false);

  const {
    hotDapp,
    homeList,
    category,
    mutate: mutateDappHome,
    isLoading,
    isFirstLoading,
    isValidating,
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

  const handleOpenTrending = React.useCallback(
    (dapp: ModelDApp) => {
      if (dapp.website) {
        dispatch(createNewTab(dapp?.website));
        dispatch(openDapp({ dapp }));
        nav.navigate(ROUTES.BrowserTabHome, { dapp });
      }
    },
    [nav, dispatch],
  );
  return (
    <SafeAreaView style={Style.s({ flex: 1, bg: colors.background.default })}>
      <StatusBar barStyle="light-content" />
      <SearchBar placeholder="Search DApp or enter a link" />
      <ScrollView
        refreshControl={
          <RefreshControl
            colors={[colors.primary.default, colors.primary.default]}
            tintColor={colors.primary.default}
            refreshing={isLoading || isFirstLoading || isValidating}
            onRefresh={handleRefreshData}
          />
        }
        stickyHeaderIndices={[2]}
        style={Style.s({ flex: 1 })}
        contentContainerStyle={Style.s({ px: 0 })}
      >
        <SearchRecent
          title="Recent"
          data={recent}
          style={Style.s({ mx: 16 })}
          onSelect={(dapp: ModelDApp) => {
            setDapp(dapp);
            securityWarningModal.onOpen();
          }}
        />
        <NowTrending
          style={Style.s({ mx: 16 })}
          onSelect={handleOpenTrending}
          hotDapps={hotDapp}
        />
        <CategoryHeader categories={category} />
        <AppGroupPager dappByCate={homeList} />
      </ScrollView>
      <SecurityWarningModal
        isOpen={securityWarningModal.isOpen}
        onClose={securityWarningModal.onClose}
        onConfirm={handleConfirmWarning}
        onCancel={securityWarningModal.onClose}
      />
    </SafeAreaView>
  );
});
