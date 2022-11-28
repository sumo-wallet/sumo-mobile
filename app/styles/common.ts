/**
 * Common styles and variables
 */

import { TextStyle, ViewStyle } from 'react-native';

/**
 * Map of color names to HEX values
 */
export const colors = {
  black: '#24292E',
  blackTransparent: 'rgba(0, 0, 0, 0.5)',
  white: '#FFFFFF',
  whiteTransparent: 'rgba(255, 255, 255, 0.7)',
  yellow: '#FFD33D',
  transparent: 'transparent',
  shadow: '#6a737d',
  black1: '#060A1D',
  green1: '#22C36B',
  green2: '#91FE39',
  gray5: '#F6F6F6',
  gray3: '#10192D',
  gray4: '#8E9BAE',
  red0: '#F65556',
};

/**
 * Map of reusable base styles
 */
export const baseStyles: Record<string, ViewStyle> = {
  flexGrow: {
    flex: 1,
  },
  flexStatic: {
    flex: 0,
  },
  flexDirection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
};

/**
 * Map of reusable fonts
 */
export const fontStyles: Record<string, TextStyle> = {
  normal: {
    fontFamily: 'EuclidCircularB-Regular',
    fontWeight: '400',
  },
  light: {
    fontFamily: 'EuclidCircularB-Regular',
    fontWeight: '300',
  },
  thin: {
    fontFamily: 'EuclidCircularB-Regular',
    fontWeight: '100',
  },
  bold: {
    fontFamily: 'EuclidCircularB-Bold',
    fontWeight: '600',
  },
};
