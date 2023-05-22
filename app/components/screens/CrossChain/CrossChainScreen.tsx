import { Web3Provider } from '@ethersproject/providers';
import { Contract, Signer, ethers, utils } from 'ethers';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
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
import {
  generateApproveData,
  getNormalizedTxState,
} from '../../../util/transactions';
import { UINT256_BN_MAX_VALUE } from '../../../constants/transaction';
import { WalletDevice } from '@metamask/controllers';
import { setTransactionObject } from '../../../actions/transaction';
import { scale } from '../../../util/scale';

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
    titleApprove: {
      fontWeight: 'bold',
      fontSize: 14,
      color: colors.text.default,
    },
    approve: {
      marginTop: scale(12),
    },
    titleBalance: {
      alignSelf: 'flex-end',
      fontWeight: 'bold',
      color: colors.text.default,
      marginBottom: 12,
    },
  });

export interface ParamsTokenInterface {
  token: string;
  destination_chain?: string;
  source_amount: string;
  destination_amount: string;
  balance_default?: string;
}

export const CrossChainScreen = memo(() => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const styles = createStyles(colors);
  const allCrossChain = getAllCrossChain();
  const allTokenByChain = getAllTokenByChain();
  const [paramsToken, setParamsToken] = useState<ParamsTokenInterface>({
    token: allTokenByChain[0]?.value || '',
    source_amount: '',
    destination_amount: '0',
    destination_chain: allTokenByChain[0]?.value || '',
  });

  const [warning, setWarning] = useState<string>('');

  const sourceToken = useTokenByChain(paramsToken.token);

  const desChain = useMemo(() => {
    return Object.keys(sourceToken?.destChains || {}).map((item) => item) || [];
  }, [sourceToken?.destChains]);

  const destChainsByToken = getDestChainsByToken(desChain);

  useEffect(() => {
    setParamsToken((state) => ({
      ...state,
      destination_chain: desChain[0] || '',
    }));
  }, [desChain]);

  const optionDestToken = useMemo(() => {
    return (
      allTokenByChain.filter(
        (item: { value: string }) => item.value === paramsToken.token,
      ) || []
    );
  }, [allTokenByChain, paramsToken.token]);

  const { chains } = useGetChain();
  const { NetworkController, CurrencyRateController, TransactionController } =
    Engine.context;

  const provider = useSelector(
    (state: any) => state.engine.backgroundState.NetworkController.provider,
  );

  const web3Provider = useMemo(() => {
    return new Web3Provider(NetworkController.provider);
  }, [NetworkController.provider]);
  // eslint-disable-next-line react-hooks/exhaustive-deps

  const { call, value, error } = useAsyncEffect(async () => {
    const contract = new Contract(
      sourceToken?.address || '',
      Abi,
      web3Provider,
    );
    const data = await contract?.balanceOf(
      '0x6b7a87899490ece95443e979ca9485cbe7e71522',
    );
    setParamsToken((state) => ({
      ...state,
      balance_default: parseFloat(data.toString()).toLocaleString('en', {
        maximumFractionDigits: 3,
        minimumFractionDigits: 2,
      }),
    }));
  }, [sourceToken]);

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
    const approvalData = generateApproveData({
      spender: '0xf9736ec3926703e85c843fc972bd89a7f8e827c0',
      value: UINT256_BN_MAX_VALUE.toString(16),
    });

    const txParams = {
      to: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
      from: '0x70dd37802c647b8df0c2fef3f405effb14386f04',
      gas: '0xbece',
      data: approvalData,
    };

    // await TransactionController.addTransaction(
    //   {
    //     chainId: '56',
    //     deviceConfirmedOn: 'metamask_mobile',
    //     networkID: '56',
    //     status: 'unapproved',
    //     transaction: {
    //       data: '0x095ea7b3000000000000000000000000f9736ec3926703e85c843fc972bd89a7f8e827c0ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
    //       from: '0x70dd37802c647b8df0c2fef3f405effb14386f04',
    //       gas: '0xbece',
    //       to: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
    //     },
    //     verifiedOnBlockchain: false,
    //   },
    //   'app.multichain.org',
    //   WalletDevice.MM_MOBILE,
    // );

    dispatch(
      setTransactionObject({
        chainId: '56',
        deviceConfirmedOn: 'metamask_mobile',
        networkID: '56',
        origin: 'app.multichain.org',
        status: 'unapproved',
        transaction: {
          data: '0x095ea7b3000000000000000000000000f9736ec3926703e85c843fc972bd89a7f8e827c0ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
          from: '0x70dd37802c647b8df0c2fef3f405effb14386f04',
          gas: '0xbece',
          to: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
        },
        verifiedOnBlockchain: false,
      }),
    );

    // const hash = await (
    //   await TransactionController.addTransaction(
    //     payload.params[0],
    //     payload.origin,
    //     WalletDevice.MM_MOBILE,
    //   )
    // ).result;
  }, [TransactionController]);
  //
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
          if (
            parseFloat(paramsToken.balance_default || '0') <
            parseFloat(value.toString())
          ) {
            setWarning('Insufficient liquidity.');
          } else {
            setWarning('');
          }
          setParamsToken((State) => ({
            ...State,
            source_amount: value.toString(),
            destination_amount:
              value === ''
                ? '0'
                : (parseInt(value.toString()) - fee).toLocaleString('en'),
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
        <Text style={styles.titleBalance}>{`Balance: ${
          paramsToken.balance_default || '--'
        }`}</Text>
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
        {warning !== '' ? (
          <WarningMessage
            style={styles.warningContainer}
            warningMessage={warning}
          />
        ) : (
          <View style={{ marginTop: 12 }} />
        )}
        <Button onPress={onApprove} style={styles.approve}>
          <Text style={styles.titleApprove}>{'Swap'}</Text>
        </Button>
      </KeyboardAwareScrollView>
      <Approve modalVisible toggleApproveModal={() => {}} />
    </View>
  );
});
