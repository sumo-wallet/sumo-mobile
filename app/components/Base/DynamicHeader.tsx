import React, { memo, ReactElement, useCallback, useEffect } from 'react';
import {
  View,
  Platform,
  StatusBar,
  ViewProps,
  TextStyle,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { icons } from '../../assets';
import Identicon from '../UI/Identicon';
import { useTheme } from '../../util/theme';
interface DynamicHeaderProps extends ViewProps {
  title: string;
  titleStyle?: TextStyle;
  children?: ReactElement | ReactElement[] | null;
  hideGoBack?: boolean;
  onGoBack?: () => void;
  isHiddenTitle?: boolean;
  centerComponent?: ReactElement | ReactElement[];
  isHiddenSafeArea?: boolean;
  isHiddenBackground?: boolean;
  isShowAvatar?: boolean;
  isShowNetwork?: boolean;
  address?: string;
  networkName?: string;
  backgroundColor?: string;
  onPressNetwork?: () => void;
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    title: {
      fontSize: 16,
      fontWeight: '600',
      paddingHorizontal: 16,
      textAlign: 'center',
    },
    wrapper: {
      paddingHorizontal: 16,
      justifyContent: 'space-around',
    },
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      height: 48,
      alignItems: 'center',
    },
    leftAction: {},
    headerIconWrapper: {
      minWidth: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    icon: {
      width: 20,
      height: 20,
      tintColor: colors.text.default,
    },
    rightAction: {},
    networkContainer: {
      justifyContent: 'flex-start',
      flexDirection: 'column',
    },
    networkTitleContainer: {
      justifyContent: 'flex-start',
      alignItems: 'center',
      flexDirection: 'row',
    },
    titleNetwork: {
      color: colors.text.muted,
      fontSize: 13,
    },
    titleNetworkValue: {
      color: colors.text.default,
      fontSize: 16,
    },
    iconDropdown: {
      width: 15,
      height: 15,
      margin: 2,
      tintColor: colors.text.default,
    },
  });

export const StatusBarViewIos = () => {
  return <SafeAreaView />;
};

export const StatusBarViewAndroid = () => {
  return <StatusBar backgroundColor="transparent" />;
};

export const StatusBarView = Platform.select({
  ios: StatusBarViewIos as unknown as typeof View,
  default: StatusBarViewAndroid as unknown as typeof View,
});

export const EmptyHeader = memo(
  ({
    children,
    hideGoBack,
    onGoBack,
    isHiddenBackground,
    isShowAvatar,
    isShowNetwork,
    address,
    networkName,
    onPressNetwork,
    backgroundColor,
    ...props
  }: Omit<DynamicHeaderProps, 'title'>) => {
    const { canGoBack, goBack, navigate } = useNavigation();
    const { colors } = useTheme();
    const styles = createStyles(colors);

    const onClose = useCallback(() => {
      onGoBack?.();
      goBack();
    }, [goBack, onGoBack]);

    return (
      <View
        {...props}
        style={[
          styles.wrapper,
          {
            backgroundColor: isHiddenBackground
              ? 'transparent'
              : backgroundColor ? backgroundColor : colors.background.default,
          },
        ]}
      >
        <StatusBarView />
        <View style={styles.container}>
          <View style={styles.leftAction}>
            {canGoBack() ? (
              hideGoBack ? (
                isShowAvatar ? (
                  <TouchableOpacity
                    style={styles.headerIconWrapper}
                    onPress={() => {
                      navigate('SettingsView');
                    }}
                  >
                    <Identicon address={address || ''} diameter={36} />
                  </TouchableOpacity>
                ) : (
                  <></>
                )
              ) : (
                <TouchableOpacity
                  style={styles.headerIconWrapper}
                  onPress={onClose}
                >
                  <Image source={icons.iconArrowLeft} style={styles.icon} />
                </TouchableOpacity>
              )
            ) : null}

            {isShowNetwork && (
              <View style={styles.networkContainer}>
                <Text style={styles.titleNetwork}>{'Network'}</Text>
                <TouchableOpacity
                  style={styles.networkTitleContainer}
                  onPress={onPressNetwork}
                >
                  <Text style={styles.titleNetworkValue}>{networkName}</Text>
                  <Image
                    source={icons.iconChevronDown}
                    style={styles.iconDropdown}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
          {children}
        </View>
      </View>
    );
  },
);

// eslint-disable-next-line react/display-name
export const DynamicHeader = memo(
  ({
    title,
    children,
    onGoBack,
    isHiddenTitle,
    isHiddenBackground,
    centerComponent,
    titleStyle,
    ...props
  }: DynamicHeaderProps) => {
    const { canGoBack } = useNavigation();
    const { colors } = useTheme();
    const styles = createStyles(colors);
    return (
      <EmptyHeader onGoBack={onGoBack} {...props}>
        {!isHiddenTitle ? (
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          <Text
            style={[
              titleStyle,
              styles.title,
              {
                color: isHiddenBackground
                  ? colors.text.default
                  : colors.text.alternative,
              },
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
        ) : (
          <></>
        )}
        {centerComponent ? <View>{centerComponent}</View> : <></>}
        <View style={styles.rightAction}>
          {!children && canGoBack() ? (
            <View style={styles.headerIconWrapper} />
          ) : null}
          {children}
        </View>
      </EmptyHeader>
    );
  },
);
