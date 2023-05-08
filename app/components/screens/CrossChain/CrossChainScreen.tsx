import { Web3Provider } from '@ethersproject/providers';
import { Contract, Signer, ethers, utils } from 'ethers';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSelector } from 'react-redux';
import { icons } from '../../../assets';
import { MAINNET } from '../../../constants/network';
import Engine from '../../../core/Engine';
import { getMultiChain } from '../../../reducers/crossChain/functions';
import {
  getAllCrossChain,
  getDestChainsByToken,
} from '../../../reducers/crossChain/slice';
import { getTokenByChain } from '../../../reducers/tokenByChain/functions';
import {
  getAllTokenByChain,
  useTokenByChain,
} from '../../../reducers/tokenByChain/slice';
import { ModelChain } from '../../../types';
import Networks, { getAllNetworks } from '../../../util/networks';
import { useTheme } from '../../../util/theme';
import { DynamicHeader } from '../../Base/DynamicHeader';
import Button from '../../UI/Button';
import WarningMessage from '../../Views/SendFlow/WarningMessage';
import { useAsyncEffect } from '../../hooks/useAsyncEffect';
import { useGetChain } from '../../hooks/useGetChain';
import Abi from '../CrossChain/ERC20.json';
import { InputBorderWithBottomSelector } from './components/InputBorderWithBottomSelector';
import Approve from '../../../components/Views/ApproveView/Approve';
import { parse } from 'eth-url-parser';
import { getNormalizedTxState } from '../../../util/transactions';

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
    warningContainer: {
      marginTop: 32,
    },
  });

export interface ParamsTokenInterface {
  token: string;
  destination_chain?: string;
  source_amount: string;
  destination_amount: string;
}

export const CrossChainScreen = memo(() => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const allCrossChain = getAllCrossChain();
  const allTokenByChain = getAllTokenByChain();
  const [paramsToken, setParamsToken] = useState<ParamsTokenInterface>({
    token: allTokenByChain[0]?.value || '',
    source_amount: '',
    destination_amount: '0',
  });
  const [warning, setWarning] = useState<string>('');

  const sourceToken = useTokenByChain(paramsToken.token);

  const desChain = useMemo(() => {
    return Object.keys(sourceToken?.destChains || {}).map((item) => item) || [];
  }, [sourceToken?.destChains]);

  const optionDestToken = useMemo(() => {
    return (
      allTokenByChain.filter(
        (item: { value: string }) => item.value === paramsToken.token,
      ) || []
    );
  }, [allTokenByChain, paramsToken.token]);

  const destChainsByToken = getDestChainsByToken(desChain);
  const transaction = useSelector((state) => getNormalizedTxState(state));
  console.log('check transaction = ', transaction);
  const { chains } = useGetChain();
  const { NetworkController, CurrencyRateController, TransactionController } =
    Engine.context;

  const provider = useSelector(
    (state: any) => state.engine.backgroundState.NetworkController.provider,
  );

  const web3Provider = useMemo(() => {
    return new Web3Provider(NetworkController.provider);
  }, [NetworkController.provider]);

  const signer = useMemo((): Signer => {
    return web3Provider.getSigner();
  }, [web3Provider]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const contract = new Contract(
    '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
    Abi,
    signer,
  );

  useEffect(() => {
    // console.log('check into');
    TransactionController.hub.on(
      'unapprovedTransaction',
      (transactionMeta: any) => {
        console.log('check into');
        console.log('check transaction = ', transactionMeta);
      },
    );
    return () => {
      TransactionController.hub.removeListener(
        'unapprovedTransaction',
        (transactionMeta: any) => {
          console.log('check transaction = ', transactionMeta);
        },
      );
    };
  }, []);

  const { call, value, error } = useAsyncEffect(async () => {
    // const data = await contract?.approve(
    //   '0x6b7a87899490ece95443e979ca9485cbe7e71522',
    //   utils.parseEther(`${5}`),
    // );
    // console.log('cehck dta =', data.toString());
  }, []);

  console.log('check approval =', TransactionController);

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

  const {} = useAsyncEffect(async () => {
    await getMultiChain();
    await getTokenByChain(provider.chainId);
  }, [provider.chainId]);

  const onApprove = useCallback(async () => {
    console.log('check into');
    const amount = ethers.utils.parseUnits('5', 18); // Convert 100 DAI to wei

    const uint256Number = Number(amount);

    if (Number.isNaN(uint256Number))
      throw new Error('The parameter uint256 should be a number');
    if (!Number.isInteger(uint256Number))
      throw new Error('The parameter uint256 should be an integer');

    const value = uint256Number.toString(16);
    const url = parse('https://app.multichain.org');
    console.log('check url = ', url);
    // const txParams = {
    //   to: target_address.toString(),
    //   from: PreferencesController.state.selectedAddress.toString(),
    //   value: '0x0',
    //   data: generateApproveData({ spender: address, value }),
    // };
  }, [sourceToken?.address]);

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

  const onChangeParams = useCallback(
    (inputName: string, value: string | number) => {
      if (inputName === 'source_amount') {
        if (sourceToken?.destChains[paramsToken?.destination_chain || '0']) {
          const dataFee = Object.values(
            sourceToken.destChains[paramsToken?.destination_chain || '0'],
          );
          const bridgeFee =
            (parseInt(value.toString()) * dataFee[0].SwapFeeRatePerMillion) /
            100;
          const fee =
            bridgeFee < dataFee[0].MinimumSwapFee
              ? dataFee[0].MinimumSwapFee
              : bridgeFee > dataFee[0].MaximumSwapFee
              ? dataFee[0].MaximumSwapFee
              : bridgeFee;

          if (parseInt(value.toString()) < dataFee[0].MinimumSwap) {
            setWarning(
              'The crosschain amount must be greater than ' +
                dataFee[0].MinimumSwap +
                sourceToken.symbol,
            );
            setParamsToken((State) => ({
              ...State,
              source_amount: value.toString(),
            }));
            return;
          }
          setWarning('');
          setParamsToken((State) => ({
            ...State,
            source_amount: value.toString(),
            destination_amount: (
              parseInt(value.toString()) - fee
            ).toLocaleString('en'),
          }));
          return;
        }
        return;
      }
      setParamsToken((state) => ({ ...state, [inputName]: value }));
      return;
    },
    [paramsToken?.destination_chain, sourceToken],
  );

  return (
    <View style={styles.wrapper}>
      <DynamicHeader title={'CrossChain'} hideGoBack />
      <KeyboardAwareScrollView style={{ flex: 1, paddingVertical: 12 }}>
        <InputBorderWithBottomSelector
          value={paramsToken.source_amount}
          valueBottomRight={getNetworkId}
          valueBottomLeft={paramsToken.token}
          keyName={'source_amount'}
          placeHolder={'From'}
          onTextChange={onChangeParams}
          keyNameBottomLeft={'token'}
          keyNameBottomRight={''}
          optionsBottomRight={allCrossChain}
          optionsBottomLeft={allTokenByChain}
          onSelectOptionRight={onChangeMainNet}
          onSelectOptionLeft={onChangeParams}
          keyboardType={'numeric'}
        />
        <Image source={icons.iconSwap2} style={styles.icon} />
        <InputBorderWithBottomSelector
          value={paramsToken.destination_amount}
          valueBottomRight={paramsToken.destination_chain || ''}
          valueBottomLeft={paramsToken.token}
          keyName={''}
          placeHolder={'To'}
          disabled
          keyNameBottomLeft={'token'}
          keyNameBottomRight={'destination_chain'}
          onTextChange={() => {}}
          optionsBottomRight={destChainsByToken}
          optionsBottomLeft={optionDestToken}
          onSelectOptionRight={onChangeParams}
          onSelectOptionLeft={onChangeParams}
        />
        <Button onPress={onApprove} />
        {warning !== '' && (
          <WarningMessage
            style={styles.warningContainer}
            warningMessage={warning}
          />
        )}
      </KeyboardAwareScrollView>
      <Approve modalVisible toggleApproveModal={() => {}} />
    </View>
  );
});
