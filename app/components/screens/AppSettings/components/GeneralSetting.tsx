import React, { memo, useCallback, useEffect, useState } from 'react';
import {
  FlatList,
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
import { useDispatch, useSelector } from 'react-redux';
import { useNavigator } from '../../../../components/hooks';
import { AppThemeKey } from '../../../../util/theme/models';
import { SelectModal } from '../../../../components/UI/SelectModal';
import Engine from '../../../../core/Engine';
import infuraCurrencies from '../../../../util/infura-conversion.json';
export interface RawHot24hInterface {
  data: Ticker[];
  onSelected?: (item: Ticker) => void;
}

const sortedCurrencies = infuraCurrencies.objects.sort((a, b) =>
  a.quote.code
    .toLocaleLowerCase()
    .localeCompare(b.quote.code.toLocaleLowerCase()),
);

const infuraCurrencyOptions = sortedCurrencies.map(
  ({ quote: { code, name } }) => ({
    label: `${code.toUpperCase()} - ${name}`,
    key: code,
    value: code,
  }),
);
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

export const GeneralSetting = function GeneralSetting() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const navigation = useNavigator();
  const [languageOptions, setLanguageOptions] = useState([]);
  const [isShowLanguageModal, setShowLanguageModal] = useState(false);
  const [isShowCurrencyModal, setShowCurrencyModal] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(
    I18n.locale.substr(0, 2),
  );
  const [currentLanguageTitle, setCurrentLanguageTitle] = useState('');
  const [currentCurrencyTitle, setCurrentCurrencyTitle] = useState('');

  const currentCurrency: number = useSelector(
    (state) =>
      state.engine.backgroundState.CurrencyRateController.currentCurrency,
  );
  const appTheme: number = useSelector((state) => state.user.appTheme);

  useEffect(() => {
    const languages = getLanguages();
    const vlanguageOptions = Object.keys(languages).map((key) => ({
      value: key,
      label: languages[key],
      key,
    }));
    setLanguageOptions(vlanguageOptions);
    setCurrentLanguageTitle(languages[currentLanguage]);
    setCurrentCurrencyTitle(infuraCurrencyOptions.find((item) => item.value === currentCurrency).label);

  }, []);

  const selectLanguage = (language) => {
    if (language === currentLanguage) return;
    setLocale(language);
    setCurrentLanguage(language);
    setTimeout(() => navigation.navigate('Home'), 100);
  };

  const selectCurrency = async (currency) => {
    const { CurrencyRateController } = Engine.context;
    CurrencyRateController.setCurrentCurrency(currency);
  };

  const toggleLanguageTimeModal = () => {
    setShowLanguageModal(!isShowLanguageModal);
  };
  const toggleCurrencyModal = () => {
    setShowCurrencyModal(!isShowCurrencyModal);
  };

  const renderLanguage = () => {
    return (
      <TouchableOpacity
        style={[styles.containerItem, { borderBottomWidth: 0.4 }]}
        onPress={toggleLanguageTimeModal}
      >
        <Text style={styles.settingTitle}>
          {strings('app_settings.current_language')}
        </Text>
        <View style={styles.containerValue}>
          <Text style={styles.settingSubTitle}>{currentLanguageTitle}</Text>
          <Image source={icons.iconArrowRight} style={styles.icon} />
          {languageOptions && (
            <SelectModal
              isVisible={isShowLanguageModal}
              selectedValue={currentLanguage}
              onValueChange={selectLanguage}
              title={strings('app_settings.current_language')}
              options={languageOptions}
              onToggleModal={toggleLanguageTimeModal}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };
  const renderCurrency = () => {
    return (
      <>
        <TouchableOpacity
          style={[styles.containerItem, { borderBottomWidth: 0.4 }]}
          onPress={toggleCurrencyModal}
        >
          <Text style={styles.settingTitle}>
            {strings('app_settings.conversion_title')}
          </Text>
          <View style={styles.containerValue}>
            <Text style={styles.settingSubTitle}>{currentCurrency}</Text>
            <Image source={icons.iconArrowRight} style={styles.icon} />
            {languageOptions && (
              <SelectModal
                isVisible={isShowCurrencyModal}
                selectedValue={currentCurrency}
                onValueChange={selectCurrency}
                title={strings('app_settings.conversion_title')}
                options={infuraCurrencyOptions}
                onToggleModal={toggleCurrencyModal}
              />
            )}
          </View>
        </TouchableOpacity>
      </>
    );
  };
  const renderTheme = () => {
    return (
      <TouchableOpacity
        style={[styles.containerItem, { borderBottomWidth: 0.4 }]}
        onPress={() => {
          navigation.navigate('ThemeSettings');
        }}
      >
        <Text style={styles.settingTitle}>{'Theme'}</Text>
        <View style={styles.containerValue}>
          <Text style={styles.settingSubTitle}>
            {strings(`app_settings.theme_${AppThemeKey[appTheme]}`)}
          </Text>
          <Image source={icons.iconArrowRight} style={styles.icon} />
        </View>
      </TouchableOpacity>
    );
  };
  const renderAdvance = () => {
    return (
      <TouchableOpacity
        style={styles.containerItem}
        onPress={() => {
          navigation.navigate('GeneralSettings');
        }}
      >
        <Text style={styles.settingTitle}>{'More'}</Text>
        <View style={styles.containerValue}>
          <Image source={icons.iconArrowRight} style={styles.icon} />
        </View>
      </TouchableOpacity>
    );
  };
  const renderContact = () => {
    return (
      <TouchableOpacity
        style={[styles.containerItem, { borderBottomWidth: 0.4 }]}
        onPress={() => {
          navigation.navigate('ContactsSettings');
        }}
      >
        <Text style={styles.settingTitle}>
          {strings(`app_settings.contacts_title`)}
        </Text>
        <View style={styles.containerValue}>
          <Image source={icons.iconArrowRight} style={styles.icon} />
        </View>
      </TouchableOpacity>
    );
  };
  const renderNetworks = () => {
    return (
      <TouchableOpacity
        style={[styles.containerItem, { borderBottomWidth: 0.4 }]}
        onPress={() => {
          navigation.navigate('NetworksSettings');
        }}
      >
        <Text style={styles.settingTitle}>
          {strings(`app_settings.networks_title`)}
        </Text>
        <View style={styles.containerValue}>
          <Image source={icons.iconArrowRight} style={styles.icon} />
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.containerHeader}>
        <Text style={styles.title}>{'GENERAL'}</Text>
      </View>
      <View style={styles.containerBox}>
        {renderContact()}
        {renderNetworks()}
        {renderCurrency()}
        {renderLanguage()}
        {renderTheme()}
        {renderAdvance()}
      </View>
    </View>
  );
};

export default memo(GeneralSetting);
