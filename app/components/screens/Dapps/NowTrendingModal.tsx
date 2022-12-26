import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../util/theme';
import Device from '../../../util/device';
import { fontStyles } from '../../../styles/common';
import { strings } from '../../../../locales/i18n';
import { DappCell } from './DappCell';

export interface NowTrendingProps {
  isVisible: PropTypes.bool;
  dismiss: PropTypes.func;
  title: PropTypes.string;
  dapps: array;
  onItemPress: PropTypes.func;
  onToggleModal: PropTypes.func;
}
const createStyles = (colors) =>
  StyleSheet.create({
    modal: {
      flex: 1,
      margin: 0,
      justifyContent: 'flex-end',
    },
    modalView: {
      flex: 1,
      backgroundColor: colors.background.default,
      opacity: 0.85,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    },
    closeIcon: {
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
      color: colors.text.default,
      fontSize: 20,
      fontWeight: '700',
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
    closeButton: {
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 100,
    },
    importButtonText: {
      color: colors.primary.inverse,
    },
    headerContainer: {
      paddingHorizontal: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  });

export const NowTrendingModal = ({
  isVisible,
  dismiss,
  title,
  dapps,
  onItemPress,
  onToggleModal,
}: NowTrendingProps) => {
  const [searchString, setSearchString] = useState('');
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const renderItem = useCallback(
    ({ item }) => {
      return <DappCell key={item.id} dapp={item} onPress={onItemPress} />;
    },
    [onItemPress, styles],
  );

  const renderEmptyList = useMemo(
    () => (
      <View style={styles.emptyList}>
        <Text>{strings('swaps.no_tokens_result', { searchString })}</Text>
      </View>
    ),
    [searchString, styles],
  );

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
      // backdropColor={colors.overlay.default}
      backdropOpacity={0.5}
    >
      <SafeAreaView style={styles.modalView}>
        <View style={styles.headerContainer}>
          <Text style={styles.modalTitle}>{title}</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onToggleModal}>
            <Icon name="ios-close" size={30} style={styles.closeIcon} />
          </TouchableOpacity>
        </View>
        <FlatList
          style={styles.resultsView}
          keyboardDismissMode="none"
          keyboardShouldPersistTaps="always"
          data={dapps}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={renderEmptyList}
        />
      </SafeAreaView>
    </Modal>
  );
};
