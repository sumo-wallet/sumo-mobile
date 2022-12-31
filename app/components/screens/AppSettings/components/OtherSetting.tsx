import React, { memo } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { fontStyles } from '../../../../styles/common';
import { icons } from '../../../../assets';
import { useTheme } from '../../../..//util/theme';
import { Ticker } from 'app/types';
import I18n, {
  setLocale,
  getLanguages,
  strings,
} from '../../../../../locales/i18n';
import { useDispatch } from 'react-redux';
import { useNavigator } from '../../../../components/hooks';

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
    },
    containerHeader: {
      flex: 1,
      justifyContent: 'flex-start',
    },
    title: {
      fontSize: 14,
      fontWeight: '500',
      textAlign: 'left',
      color: colors.text.muted,
      ...fontStyles.bold,
    },
    containerBox: {
      backgroundColor: colors.box.default,
      borderRadius: 8,
      justifyContent: 'space-around',
      paddingHorizontal: 16,
      marginVertical: 16,
    },
    containerItem: {
      backgroundColor: colors.box.default,
      justifyContent: 'space-between',
      flexDirection: 'row',
      borderBottomColor: colors.text.muted,
    },
    containerValue: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
    },
    containerFlatList: {
      marginTop: 16,
      marginBottom: 24,
    },
    icon: {
      width: 22,
      height: 22,
      tintColor: colors.text.muted,
    },
    settingTitle: {
      fontSize: 16,
      fontWeight: '500',
      paddingVertical: 16,
      color: colors.text.default,
    },
    settingSubTitle: {
      fontSize: 14,
      fontWeight: '400',
      color: colors.text.muted,
    },
    titlePercent: {
      fontSize: 18,
      fontWeight: '500',
    },
    titleAmount: {
      fontSize: 12,
      fontWeight: '500',
      opacity: 0.7,
      marginTop: 2,
      color: colors.text.alternative,
    },
    containerPercent: {
      marginTop: 22,
    },
    picker: {
      borderColor: colors.border.default,
      borderRadius: 5,
      borderWidth: 2,
      marginTop: 16,
    },
  });

export const OtherSetting = function OtherSetting() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const dispatch = useDispatch();
  const navigation = useNavigator();

  const renderTermService = () => {
    return (
      <TouchableOpacity
        style={styles.containerItem}
        onPress={() => {
          navigation.navigate('GeneralSettings');
        }}
      >
        <Text style={styles.settingTitle}>{'Terms of Service'}</Text>
        <View style={styles.containerValue}>
          <Image source={icons.iconArrowRight} style={styles.icon} />
        </View>
      </TouchableOpacity>
    );
  };
  const renderHelpCenter = () => {
    return (
      <TouchableOpacity
        style={[styles.containerItem, { borderBottomWidth: 0.4 }]}
        onPress={() => {
          navigation.navigate('ContactsSettings');
        }}
      >
        <Text style={styles.settingTitle}>{'Help'}</Text>
        <View style={styles.containerValue}>
          <Image source={icons.iconArrowRight} style={styles.icon} />
        </View>
      </TouchableOpacity>
    );
  };
  const renderAbout = () => {
    return (
      <TouchableOpacity
        style={styles.containerItem}
        onPress={() => {
          navigation.navigate('GeneralSettings');
        }}
      >
        <Text style={styles.settingTitle}>{'About'}</Text>
        <View style={styles.containerValue}>
          <Image source={icons.iconArrowRight} style={styles.icon} />
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.containerHeader}>
        <Text style={styles.title}>{'OTHERS'}</Text>
      </View>
      <View style={styles.containerBox}>
        {renderHelpCenter()}
        {renderTermService()}
        {renderAbout()}
      </View>
    </View>
  );
};

export default memo(OtherSetting);
