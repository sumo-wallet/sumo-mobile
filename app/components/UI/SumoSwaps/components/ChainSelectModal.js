import React, { useCallback, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Ionicons';
import Fuse from 'fuse.js';
import { connect } from 'react-redux';
import Device from '../../../../util/device';
import { strings } from '../../../../../locales/i18n';
import { fontStyles } from '../../../../styles/common';
import Text from '../../../Base/Text';
import ListItem from '../../../Base/ListItem';
import ModalDragger from '../../../Base/ModalDragger';
import TokenIcon from './TokenIcon';
import { useTheme } from '../../../../util/theme';

const createStyles = (colors) =>
  StyleSheet.create({
    modal: {
      margin: 0,
      justifyContent: 'flex-end',
    },
    modalView: {
      backgroundColor: colors.background.default,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 30,
      marginVertical: 10,
      paddingVertical: Device.isAndroid() ? 0 : 10,
      paddingHorizontal: 5,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: colors.border.default,
    },
    searchIcon: {
      marginHorizontal: 8,
      color: colors.icon.alternative,
    },
    input: {
      ...fontStyles.normal,
      flex: 1,
      color: colors.text.default,
    },
    modalTitle: {
      marginTop: Device.isIphone5() ? 10 : 15,
      marginBottom: Device.isIphone5() ? 5 : 5,
    },
    resultsView: {
      height: Device.isSmallDevice() ? 200 : 280,
      marginTop: 10,
    },
    resultRow: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border.muted,
    },
    emptyList: {
      marginVertical: 10,
      marginHorizontal: 30,
    },
    importButton: {
      paddingVertical: 6,
      paddingHorizontal: 10,
      backgroundColor: colors.primary.default,
      borderRadius: 100,
    },
    importButtonText: {
      color: colors.primary.inverse,
    },
    loadingIndicator: {
      margin: 10,
    },
    loadingTokenView: {
      marginVertical: 10,
      marginHorizontal: 30,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    footer: {
      padding: 30,
    },
    footerIcon: {
      paddingTop: 4,
      paddingRight: 8,
    },
  });

const MAX_TOKENS_RESULTS = 20;
function ChainSelectModal({
  isVisible,
  dismiss,
  title,
  chains,
  initialTokens,
  onItemPress,
  excludeChains = [],
  chainId,
}) {
  const searchInput = useRef(null);
  const list = useRef();
  const [searchString, setSearchString] = useState('');
  const { colors, themeAppearance } = useTheme();
  const styles = createStyles(colors);

  const excludedChains = useMemo(
    () => excludeChains.filter(Boolean).map((id) => id),
    [excludeChains],
  );

  const filteredTokens = useMemo(
    () => chains?.filter((chain) => !excludedChains.includes(chain.id)),
    [chains, excludedChains],
  );
  const filteredInitialTokens = useMemo(
    () =>
      initialTokens?.length > 0
        ? initialTokens.filter(
          (token) =>
            !excludedChains.includes(token.address?.toLowerCase()),
        )
        : filteredTokens,
    [excludedChains, filteredTokens, initialTokens],
  );
  const tokenFuse = useMemo(
    () =>
      new Fuse(filteredTokens, {
        shouldSort: true,
        threshold: 0.45,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: ['symbol', 'address', 'name'],
      }),
    [filteredTokens],
  );
  const tokenSearchResults = useMemo(
    () =>
      searchString.length > 0
        ? tokenFuse.search(searchString)?.slice(0, MAX_TOKENS_RESULTS)
        : filteredInitialTokens,
    [searchString, tokenFuse, filteredInitialTokens],
  );

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <TouchableOpacity
          style={styles.resultRow}
          onPress={() => onItemPress(item)}
        >
          <ListItem>
            <ListItem.Content>
              <ListItem.Icon>
                <TokenIcon medium icon={item.iconUrl} symbol={item.symbol} />
              </ListItem.Icon>
              <ListItem.Body>
                <ListItem.Title>{item.symbol}</ListItem.Title>
                {item.name && <Text>{item.name}</Text>}
              </ListItem.Body>
            </ListItem.Content>
          </ListItem>
        </TouchableOpacity>
      );
    },
    [onItemPress, styles],
  );

  const handleSearchPress = () => searchInput?.current?.focus();

  const renderEmptyList = useMemo(
    () => (
      <View style={styles.emptyList}>
        <Text>{strings('swaps.no_tokens_result', { searchString })}</Text>
      </View>
    ),
    [searchString, styles],
  );

  const handleSearchTextChange = useCallback((text) => {
    setSearchString(text);
    if (list.current) list.current.scrollToOffset({ animated: false, y: 0 });
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchString('');
    searchInput?.current?.focus();
  }, [setSearchString]);

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={dismiss}
      onBackButtonPress={dismiss}
      onSwipeComplete={dismiss}
      swipeDirection="down"
      propagateSwipe
      avoidKeyboard
      onModalHide={() => setSearchString('')}
      style={styles.modal}
      backdropColor={colors.overlay.default}
      backdropOpacity={1}
    >
      <SafeAreaView style={styles.modalView}>
        <ModalDragger />
        <Text bold centered primary style={styles.modalTitle}>
          {title}
        </Text>
        <TouchableWithoutFeedback onPress={handleSearchPress}>
          <View style={styles.inputWrapper}>
            <Icon name="ios-search" size={20} style={styles.searchIcon} />
            <TextInput
              ref={searchInput}
              style={styles.input}
              placeholder={strings('swaps.search_token')}
              placeholderTextColor={colors.text.muted}
              value={searchString}
              onChangeText={handleSearchTextChange}
              keyboardAppearance={themeAppearance}
            />
            {searchString.length > 0 && (
              <TouchableOpacity onPress={handleClearSearch}>
                <Icon
                  name="ios-close-circle"
                  size={20}
                  style={styles.searchIcon}
                />
              </TouchableOpacity>
            )}
          </View>
        </TouchableWithoutFeedback>
        <FlatList
          ref={list}
          style={styles.resultsView}
          keyboardDismissMode="none"
          keyboardShouldPersistTaps="always"
          data={tokenSearchResults}
          renderItem={renderItem}
          keyExtractor={(item) => item.address}
          ListEmptyComponent={renderEmptyList}
        />
      </SafeAreaView>
    </Modal>
  );
}

ChainSelectModal.propTypes = {
  isVisible: PropTypes.bool,
  dismiss: PropTypes.func,
  title: PropTypes.string,
  chains: PropTypes.arrayOf(PropTypes.object),
  initialTokens: PropTypes.arrayOf(PropTypes.object),
  onItemPress: PropTypes.func,
  excludeChains: PropTypes.arrayOf(PropTypes.string),
  /**
   * Currency code of the currently-active currency
   */
  currentCurrency: PropTypes.string,
  /**
   * An object containing token balances for current account and network in the format address => balance
   */
  balances: PropTypes.object,
  /**
   * An object containing token exchange rates in the format address => exchangeRate
   */
  tokenExchangeRates: PropTypes.object,
  /**
   * Chain Id
   */
  chainId: PropTypes.string,
  /**
   * Current Network provider
   */
  provider: PropTypes.object,
  /**
   * Frequent RPC list from PreferencesController
   */
  frequentRpcList: PropTypes.array,
};

const mapStateToProps = (state) => ({
  currentCurrency:
    state.engine.backgroundState.CurrencyRateController.currentCurrency,
  balances:
    state.engine.backgroundState.TokenBalancesController.contractBalances,
  tokenExchangeRates:
    state.engine.backgroundState.TokenRatesController.contractExchangeRates,
  chainId: state.engine.backgroundState.NetworkController.provider.chainId,
  provider: state.engine.backgroundState.NetworkController.provider,
  frequentRpcList:
    state.engine.backgroundState.PreferencesController.frequentRpcList,
});

export default connect(mapStateToProps)(ChainSelectModal);
