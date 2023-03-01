import React, { memo, PropsWithChildren } from 'react';
import { Animated, StyleSheet, View, ViewStyle } from 'react-native';
import { useDeviceOrientation } from '@react-native-community/hooks';
import { useTheme } from '../../../util/theme';

interface OwnProps {
  containerStyle?: ViewStyle;
  fullScreen?: boolean;
}

type Props = OwnProps;

const createStyles = (colors: any) =>
  StyleSheet.create({
    portrait: {
      width: '100%',
    },
    landscape: {
      width: '100%',
    },
    fullScreen: {
      width: '100%',
      height: '100%',
      maxHeight: '100%',
    },
    container: {
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      width: '100%',
      overflow: 'hidden',
      backgroundColor: colors.background.default,
      paddingBottom: 32,
    },
  });

const ContainerAnimated = Animated.createAnimatedComponent(View);

export const BottomMenuContainer = memo(
  ({ children, containerStyle, fullScreen }: PropsWithChildren<Props>) => {
    const orientation = useDeviceOrientation();
    const { colors } = useTheme();
    const styles = createStyles(colors);
    return (
      <ContainerAnimated
        style={[
          orientation.portrait ? styles.portrait : styles.landscape,
          fullScreen ? styles.fullScreen : {},
          containerStyle,
          styles.container,
        ]}
      >
        {children}
      </ContainerAnimated>
    );
  },
);
