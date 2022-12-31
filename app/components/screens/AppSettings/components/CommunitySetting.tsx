import React, { memo } from 'react';
import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { icons } from '../../../../assets';
import { useTheme } from '../../../..//util/theme';

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
    },

    containerOption: {
      backgroundColor: colors.background.default,
      width: '100%',
      marginTop: 20,
    },
    logoContainer: {
      marginTop: 20,
      marginHorizontal: 50,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    joinTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text.default,
      justifyContent: 'center',
      textAlign: 'center',
      marginTop: 12,
    },
    imageLogo: {
      width: 44,
      height: 44,
    },
  });

export const CommunitySetting = function CommunitySetting() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const openUrl = (url: string) => {
    Linking.openURL(url);
  };
  return (
    <View style={styles.container}>
      <View style={styles.containerOption}>
        <Text style={styles.joinTitle}>{'JOIN OUR COMMUNITY'}</Text>
        <View style={styles.logoContainer}>
          <TouchableOpacity
            onPress={() => {
              openUrl('https://facebook.com');
            }}
          >
            <Image style={styles.imageLogo} source={icons.logoFacebook} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              openUrl('https://twitter.com');
            }}
          >
            <Image style={styles.imageLogo} source={icons.logoTwitter} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              openUrl('https://discord.com');
            }}
          >
            <Image style={styles.imageLogo} source={icons.logoDiscord} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default memo(CommunitySetting);
