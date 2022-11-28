/* eslint-disable @typescript-eslint/prefer-optional-chain */
import React from 'react';
import { SafeAreaView, ScrollView, StatusBar } from 'react-native';
import { useDisclosure } from '@dwarvesf/react-hooks';

import { useNavigator, useNavigatorParams } from './../../hooks';
import { Style, Colors } from './../../../styles';
import { SearchBar } from './SearchBar';
import { NowTrending } from './NowTrending';
import { AppGroupPager } from './AppGroupPager';
import { SearchRecent, dummyDataRecent } from './SearchRecent';
import { SecurityWarningModal } from './SecurityWarningModal';
import { Dapp } from './../../../types';

import { ROUTES } from './../../../navigation/routes';
import { useDispatch } from 'react-redux';
import { createNewTab, openDapp } from './../../../actions/browser';

export const DappsScreen = React.memo(() => {
  const nav = useNavigator();
  const dispatch = useDispatch();
  const securityWarningModal = useDisclosure();
  const [curDapp, setDapp] = React.useState<Dapp>();

  const handleConfirmWarning = React.useCallback(() => {
    if (curDapp && curDapp?.website) {
      dispatch(createNewTab(curDapp?.website));
      dispatch(openDapp({ dapp: curDapp }));
      nav.navigate(ROUTES.BrowserTabHome, { dapp: curDapp });
    }

    securityWarningModal.onClose();
  }, [curDapp, dispatch, nav, securityWarningModal]);

  const handleOpenTrending = React.useCallback(
    (dapp: Dapp) => {
      if (dapp.website) {
        dispatch(createNewTab(dapp?.website));
        nav.navigate(ROUTES.DappDetails, { dapp });
      }
    },
    [nav, dispatch],
  );
  return (
    <SafeAreaView style={Style.s({ flex: 1, bg: Colors.grayscale[100] })}>
      <StatusBar barStyle="light-content" />
      <SearchBar placeholder="Search DApp or enter a link" />
      <ScrollView
        style={Style.s({ flex: 1 })}
        contentContainerStyle={Style.s({ px: 0 })}
      >
        <SearchRecent
          title="Recent"
          data={dummyDataRecent}
          style={Style.s({ mx: 16 })}
          onSelect={(dapp: Dapp) => {
            setDapp(dapp);
            securityWarningModal.onOpen();
          }}
        />
        <NowTrending
          style={Style.s({ mx: 16 })}
          onSelect={handleOpenTrending}
        />
        <AppGroupPager />
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
