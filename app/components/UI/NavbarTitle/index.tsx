/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable @typescript-eslint/no-shadow */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import { fontStyles, colors as importedColors } from '../../../styles/common';
import Networks from '../../../util/networks';
import { toggleNetworkModal } from '../../../actions/modals';
import { strings } from '../../../../locales/i18n';
import Device from '../../../util/device';
import { ThemeContext, mockTheme, useTheme } from '../../../util/theme';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../../../navigation/routes';
import { ThemeColors } from '@thanhpn1990/design-tokens/dist/js/themes/types';
import { Colors } from './../../../styles';

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    wrapper: {
      alignItems: 'center',
      flex: 1,
    },
    network: {
      flexDirection: 'row',
    },
    networkName: {
      fontSize: 11,
      color: colors.text.alternative,
      ...fontStyles.normal,
    },
    networkIcon: {
      width: 5,
      height: 5,
      borderRadius: 100,
      marginRight: 5,
      marginTop: Device.isIos() ? 4 : 5,
    },
    title: {
      fontSize: 18,
      ...fontStyles.normal,
      // color: colors.text.default,
      color: Colors.white[2],
    },
    otherNetworkIcon: {
      backgroundColor: importedColors.transparent,
      borderColor: colors.border.default,
      borderWidth: 1,
    },
  });

export interface NavbarTitleProps {
  title?: string;
  translate?: boolean;
  disableNetwork?: boolean;
}

/**
 * UI PureComponent that renders inside the navbar
 * showing the view title and the selected network
 */
const NavbarTitle = ({
  title,
  translate = true,
  disableNetwork,
}: NavbarTitleProps) => {
  const dispatch = useDispatch();
  const nav = useNavigation();

  const dispatchToggleNetworkModal = () => dispatch(toggleNetworkModal());

  const { NetworkController: network }: { NetworkController: any } =
    useSelector((state: any) => state?.engine?.backgroundState);

  let animating = false;
  const useNetworksModal = false;

  const openNetworkList = () => {
    if (!disableNetwork) {
      if (!animating) {
        animating = true;
        if (useNetworksModal) {
          dispatchToggleNetworkModal();
        } else {
          nav.navigate(ROUTES.ChangeNetwork);
        }
        setTimeout(() => {
          animating = false;
        }, 500);
      }
    }
  };

  let name = null;
  const color =
    (Networks[network.provider.type] &&
      Networks[network.provider.type].color) ||
    null;
  const { colors: themeColors } = useTheme();
  const colors = themeColors || mockTheme.colors;
  const styles = createStyles(colors);

  if (network.provider.nickname) {
    name = network.provider.nickname;
  } else {
    name =
      (Networks[network?.provider.type] &&
        Networks[network?.provider.type].name) ||
      { ...Networks.rpc, color: null }.name;
  }

  const realTitle = translate ? strings(title) : title;

  return (
    <TouchableOpacity
      onPress={openNetworkList}
      style={styles.wrapper}
      activeOpacity={disableNetwork ? 1 : 0.2}
      testID={'open-networks-button'}
    >
      {title ? (
        <Text numberOfLines={1} style={styles.title}>
          {realTitle}
        </Text>
      ) : null}
      <View style={styles.network}>
        <View
          style={[
            styles.networkIcon,
            color ? { backgroundColor: color } : styles.otherNetworkIcon,
          ]}
        />
        <Text
          numberOfLines={1}
          style={styles.networkName}
          testID={'navbar-title-network'}
        >
          {name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

NavbarTitle.contextType = ThemeContext;

export default NavbarTitle;
