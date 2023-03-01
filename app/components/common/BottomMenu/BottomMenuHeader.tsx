import React, { memo, PropsWithChildren } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../../util/theme';

interface OwnProps {
  title: string;
  onClose?: () => void;
  noDivider?: boolean;
  containerStyle?: ViewStyle;
  onSave?: () => void;
}

type Props = OwnProps & PropsWithChildren<any>;

const createStyles = (colors: any) =>
  StyleSheet.create({
    wrapper: { width: '100%', alignItems: 'center', marginVertical: 16 },
    title: {
      fontSize: 14,
      color: colors.text.muted,
      fontWeight: '600',
      marginRight: 4,
    },
  });

export const BottomMenuHeader = memo(
  ({ title, onClose, noDivider, containerStyle, onSave, children }: Props) => {
    const { colors } = useTheme();
    const styles = createStyles(colors);
    return (
      <View style={[containerStyle, styles.wrapper]}>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
          {title}
        </Text>
        {onSave && (
          <TouchableOpacity onPress={onSave}>
            <Text>{'Done'}</Text>
          </TouchableOpacity>
        )}
        {children}
      </View>
    );
  },
);
