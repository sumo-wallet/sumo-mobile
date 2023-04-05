import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useTheme } from '../../../util/theme';
import { Image, StyleSheet, View } from 'react-native';
import { DynamicHeader } from '../../Base/DynamicHeader';
import { InputBorderWithBottomSelector } from './components/InputBorderWithBottomSelector';
import { icons } from '../../../assets';
import { useAsyncEffect } from '../../hooks/useAsyncEffect';
import { getMultiChain } from '../../../reducers/crossChain/functions';
import { getAllCrossChain } from '../../../reducers/crossChain/slice';
import { useGetChain } from '../../hooks/useGetChain';
import { useSelector } from 'react-redux';
import { ModelChain } from '../../../types';
import Engine from '../../../core/Engine';
import { MAINNET } from '../../../constants/network';
import Networks, { getAllNetworks } from '../../../util/networks';
import { getTokenByChain } from '../../../reducers/tokenByChain/functions';
import { getAllTokenByChain } from '../../../reducers/tokenByChain/slice';
import { useFocusEffect } from '@react-navigation/native';

const createStyles = (colors: any) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: colors.background.default,
      marginHorizontal: 16,
    },
    icon: {
      width: 32,
      height: 32,
      tintColor: colors.text.default,
      alignSelf: 'center',
      marginVertical: 32,
    },
    containerRight: {
      flexDirection: 'row',
    },
  });

export interface ParamsTokenInterface {
  source_token: string;
  destination_token: string;
}

export const CrossChainScreen = memo(() => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const allCrossChain = getAllCrossChain();
  const allTokenByChain = getAllTokenByChain();
  const [paramsToken, setParamsToken] = useState<ParamsTokenInterface>({
    source_token: allTokenByChain[0]?.value || '',
    destination_token: '',
  });
  console.log('check =', paramsToken);

  const { chains } = useGetChain();
  const { NetworkController, CurrencyRateController } = Engine.context;

  const provider = useSelector(
    (state: any) => state.engine.backgroundState.NetworkController.provider,
  );

  const frequentRpcList = useSelector(
    (state: any) =>
      state.engine.backgroundState.PreferencesController.frequentRpcList,
  );

  const thirdPartyApiMode = useSelector(
    (state: any) => state.privacy.thirdPartyApiMode,
  );

  const getNetworkId = useMemo(() => {
    const currentChain = chains.find(
      (chain: ModelChain) => chain.id?.toString() === provider.chainId,
    );
    if (currentChain) return (currentChain?.id || '').toString();
    return provider.chainId;
  }, [chains, provider.chainId]);

  const getOtherNetworks = useMemo(() => getAllNetworks().slice(1), []);

  const { error, loading, call } = useAsyncEffect(async () => {
    await getMultiChain();
    await getTokenByChain(provider.chainId);
  }, []);

  const onChangeMainNet = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (inputName: string, value: string | number) => {
      if (value === '1') {
        CurrencyRateController.setNativeCurrency('ETH');
        NetworkController.setProviderType(MAINNET);
        thirdPartyApiMode &&
          setTimeout(() => {
            Engine.refreshTransactionHistory();
          }, 1000);
        return;
      }
      if (
        frequentRpcList.some(
          (item: { chainId: string | number }) => item.chainId === value,
        )
      ) {
        const rpc = frequentRpcList.find(
          (item: { chainId: string | number }) => item.chainId === value,
        );
        CurrencyRateController.setNativeCurrency(rpc.ticker);
        NetworkController.setRpcTarget(
          rpc.rpcUrl,
          rpc.chainId,
          rpc.ticker,
          rpc.nickname,
        );
        return;
      }
      if (getOtherNetworks.some((item) => Networks[item].chainId === value)) {
        const network = getOtherNetworks.find(
          (item) => Networks[item].chainId === value,
        );
        CurrencyRateController.setNativeCurrency('ETH');
        NetworkController.setProviderType(network);
      }
    },
    [
      CurrencyRateController,
      NetworkController,
      frequentRpcList,
      getOtherNetworks,
      thirdPartyApiMode,
    ],
  );

  const onChangeTokenSource = useCallback(
    (inputName: string, value: string | number) => {
      setParamsToken((state) => ({ ...state, [inputName]: value }));
    },
    [],
  );

  return (
    <View style={styles.wrapper}>
      <DynamicHeader title={'CrossChain'} hideGoBack />
      <InputBorderWithBottomSelector
        value={''}
        valueBottomRight={getNetworkId}
        valueBottomLeft={paramsToken.source_token}
        keyName={''}
        placeHolder={'From'}
        onTextChange={() => {}}
        optionsBottomRight={allCrossChain}
        optionsBottomLeft={allTokenByChain}
        onSelectOptionRight={onChangeMainNet}
        onSelectOptionLeft={onChangeTokenSource}
      />
      <Image source={icons.iconSwap2} style={styles.icon} />
      {/*<InputBorderWithBottomSelector*/}
      {/*  value={getNetworkId}*/}
      {/*  valueBottomRight={getNetworkId}*/}
      {/*  keyName={''}*/}
      {/*  placeHolder={'To'}*/}
      {/*  onTextChange={() => {}}*/}
      {/*  options={allCrossChain}*/}
      {/*/>*/}
    </View>
  );
});
