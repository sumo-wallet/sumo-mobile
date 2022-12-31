import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  View,
  Text,
  Image,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../util/theme';
import Device from '../../../util/device';
import { fontStyles } from '../../../styles/common';
import { strings } from '../../../../locales/i18n';
import { icons } from '../../../assets';

export interface SelectModalProps {
  isVisible: PropTypes.bool;
  dismiss: PropTypes.func;
  title: PropTypes.string;
  defaultValue: PropTypes.string;
  selectedValue: PropTypes.string;
  options: array;
  onValueChange: PropTypes.func;
  onValueTitleChange: PropTypes.func;
  onToggleModal: PropTypes.func;
}
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
    emptyList: {
      marginVertical: 10,
      marginHorizontal: 30,
    },
    closeButton: {
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 100,
    },
    headerContainer: {
      paddingHorizontal: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    itemContainer: {
      paddingHorizontal: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 10,
    },
    itemTitle: {
      color: colors.text.default,
      fontSize: 20,
      fontWeight: '700',
    },
    icon: {
      width: 24,
      height: 24,
      tintColor: colors.primary.default,
    },
  });

export const SelectModal = ({
  isVisible,
  dismiss,
  title,
  options,
  onValueChange,
  onValueTitleChange,
  onToggleModal,
  selectedValue,
  defaultValue,
}: SelectModalProps) => {
  const [searchString, setSearchString] = useState('');
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <TouchableOpacity
          style={styles.itemContainer}
          onPress={() => {
            !!onValueChange && onValueChange(item.value);
            !!onValueTitleChange && onValueTitleChange(item.label);
            !!onToggleModal && onToggleModal();
          }}
        >
          <Text style={styles.itemTitle}>{item.label}</Text>
          {selectedValue === item.value ? (
            <Image source={icons.iconChecked} style={styles.icon} />
          ) : null}
        </TouchableOpacity>
      );
    },
    [onValueChange, styles],
  );

  const renderEmptyList = useMemo(
    () => (
      <View style={styles.emptyList}>
        <Text style={styles.itemTitle}>
          {strings('swaps.no_tokens_result', { searchString })}
        </Text>
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
          data={options}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={renderEmptyList}
        />
      </SafeAreaView>
    </Modal>
  );
};
