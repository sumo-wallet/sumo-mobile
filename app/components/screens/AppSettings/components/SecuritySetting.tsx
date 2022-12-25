import React, { memo, useCallback } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { baseStyles, fontStyles } from '../../../../styles/common';
import { icons } from '../../../../assets';
import { useTheme } from '../../../..//util/theme';
import { Ticker } from 'app/types';
import { strings } from '../../../../../locales/i18n';
import SelectComponent from '../../../../components/UI/SelectComponent';
import { useDispatch, useSelector } from 'react-redux';
import { setLockTime } from '../../../../actions/settings';
import { useNavigator } from '../../../../components/hooks';

const autolockOptions = [
  {
    value: '0',
    label: strings('app_settings.autolock_immediately'),
    key: '0',
  },
  {
    value: '5000',
    label: strings('app_settings.autolock_after', { time: 5 }),
    key: '5000',
  },
  {
    value: '15000',
    label: strings('app_settings.autolock_after', { time: 15 }),
    key: '15000',
  },
  {
    value: '30000',
    label: strings('app_settings.autolock_after', { time: 30 }),
    key: '30000',
  },
  {
    value: '60000',
    label: strings('app_settings.autolock_after', { time: 60 }),
    key: '60000',
  },
  {
    value: '300000',
    label: strings('app_settings.autolock_after_minutes', { time: 5 }),
    key: '300000',
  },
  {
    value: '600000',
    label: strings('app_settings.autolock_after_minutes', { time: 10 }),
    key: '600000',
  },
  {
    value: '-1',
    label: strings('app_settings.autolock_never'),
    key: '-1',
  },
];

export interface RawHot24hInterface {
  data: Ticker[];
  onSelected?: (item: Ticker) => void;
}

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
      width: 24,
      height: 24,
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

export const SecuritySetting = function SecuritySetting({
  data,
  onSelected,
}: RawHot24hInterface) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const dispatch = useDispatch();
  const navigation = useNavigator();

  const lockTime: number = useSelector((state) => state.settings.lockTime);
  const selectLockTime = (lockTime) => {
    dispatch(setLockTime(parseInt(lockTime, 10)));
  };
  const renderFaceID = () => {
    return (
      <TouchableOpacity style={[styles.containerItem, { borderBottomWidth: 0.4 }]}>
        <Text style={styles.settingTitle}>{'Face ID'}</Text>
        <View style={styles.containerValue}>
          <Text style={styles.settingSubTitle}>{'On'}</Text>
          <Image source={icons.iconArrowRight} style={styles.icon} />
        </View>
      </TouchableOpacity>
    );
  };
  const renderAutoLock = () => {
    return (
      <>
        <View style={[styles.containerItem, { borderBottomWidth: 0.4 }]}>
          <Text style={styles.settingTitle}>
            {strings('app_settings.auto_lock')}
          </Text>
          <View style={{ width: 150, height: 44, alignItems: 'stretch' }}>
            {autolockOptions && (
              <SelectComponent
                selectedValue={lockTime.toString()}
                onValueChange={selectLockTime}
                label={strings('app_settings.auto_lock')}
                options={autolockOptions}
              />
            )}
          </View>
        </View>
      </>
    );
  };
  const renderChangePassword = () => {
    return (
      <TouchableOpacity style={[styles.containerItem, { borderBottomWidth: 0.4 }]}>
        <Text style={styles.settingTitle}>{strings('password_reset.change_password')}</Text>
        <View style={styles.containerValue}>
          <Image source={icons.iconArrowRight} style={styles.icon} />
        </View>
      </TouchableOpacity>
    );
  };
  const renderAdvance = () => {
    return (
      <TouchableOpacity style={styles.containerItem} onPress={() => {
      }}>
        <Text style={styles.settingTitle}>{'Advance Security'}</Text>
        <View style={styles.containerValue}>
          <Image source={icons.iconArrowRight} style={styles.icon} />
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.containerHeader}>
        <Text style={styles.title}>{'SECURITY'}</Text>
      </View>
      <View style={styles.containerBox}>
        {renderFaceID()}
        {renderAutoLock()}
        {renderChangePassword()}
        {renderAdvance()}
      </View>
      {/* <FlatList
        data={data}
        renderItem={renderItem}
        horizontal
        style={styles.containerFlatList}
        showsHorizontalScrollIndicator={false}
      /> */}
    </View>
  );
};

export default memo(SecuritySetting);
