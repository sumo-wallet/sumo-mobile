/* eslint-disable import/prefer-default-export */
import { fontStyles } from '../../../styles/common';
import { StyleSheet } from 'react-native';
import Device from '../../../util/device';

export const createStyles = (colors: any) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background.default,
    },
    urlModal: {
      justifyContent: 'flex-start',
      margin: 0,
    },
    urlModalContent: {
      flexDirection: 'row',
      paddingTop: Device.isAndroid() ? 10 : Device.isIphoneX() ? 50 : 27,
      paddingHorizontal: 10,
      height: Device.isAndroid() ? 59 : Device.isIphoneX() ? 87 : 65,
      backgroundColor: colors.background.default,
    },
    clearButton: { paddingHorizontal: 12, justifyContent: 'center' },
    urlInput: {
      ...fontStyles.normal,
      fontSize: Device.isAndroid() ? 16 : 14,
      paddingLeft: 15,
      flex: 1,
      color: colors.text.default,
    } as any,
    cancelButton: {
      marginLeft: 10,
      justifyContent: 'center',
    },
    cancelButtonText: {
      fontSize: 14,
      color: colors.primary.default,
      ...fontStyles.normal,
    } as any,
    searchWrapper: {
      flexDirection: 'row',
      borderRadius: 5,
      backgroundColor: colors.background.alternative,
      height: Device.isAndroid() ? 50 : 40,
      flex: 1,
    },
    searchSuggestion: {
      flexDirection: 'column',
      flex: 1,
      height: 500,
    },
    popularSearchArea: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      flex: 1,
    },
    popularSearch: {
      height: 80,
      flexDirection: 'row',
      justifyContent: 'center',
      flex: 1,
    },
    popularSearchItem: {
      flexDirection: 'row',
      borderRadius: 30,
      backgroundColor: colors.background.alternative,
      height: Device.isAndroid() ? 40 : 30,
      width: 100,
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'center',
    },
    searchHistoryText: {
      marginVertical: 10,
      marginHorizontal: 10,
      fontSize: 18,
      color: colors.primary.default,
      ...fontStyles.normal,

    } as any,
    searchHistoryTitle: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    searchHistory: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      flex: 2,
    },
    clearHistoryButton: { paddingHorizontal: 10, justifyContent: 'center' },
    history: {
      flex: 1,
      width: '100%',
    },
    historyItem: {
      width: '100%',
      height: 54,
      paddingLeft: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    historyItemBody: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
    },
    historyItemTitle: {
      fontSize: 18,
      color: colors.primary.default,
      ...fontStyles.normal,
    },
    historyItemUrl: {
      fontSize: 13,
      color: colors.primary.default,
      ...fontStyles.normal,
    },
  });
