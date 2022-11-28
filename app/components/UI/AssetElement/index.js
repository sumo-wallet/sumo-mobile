import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { mockTheme, ThemeContext } from '../../../util/theme';

const createStyles = (colors) =>
  StyleSheet.create({
    itemWrapper: {
      flex: 1,
      flexDirection: 'row',
      paddingHorizontal: 16,
      paddingVertical: 16,
      backgroundColor: colors.box.default,
    },
    arrow: {
      flex: 1,
      alignSelf: 'flex-end',
    },
    arrowIcon: {
      marginTop: 16,
    },
  });

/**
 * Customizable view to render assets in lists
 */
export default class AssetElement extends PureComponent {
  static propTypes = {
    /**
     * Content to display in the list element
     */
    children: PropTypes.node,
    /**
     * Object being rendered
     */
    asset: PropTypes.object,
    /**
     * Callback triggered on long press
     */
    onPress: PropTypes.func,
    /**
     * Callback triggered on long press
     */
    onLongPress: PropTypes.func,
  };

  handleOnPress = () => {
    const { onPress, asset } = this.props;
    onPress && onPress(asset);
  };

  handleOnLongPress = () => {
    const { onLongPress, asset } = this.props;
    onLongPress && onLongPress(asset);
  };

  render = () => {
    const { children } = this.props;
    const colors = this.context.colors || mockTheme.colors;
    const styles = createStyles(colors);

    return (
      <TouchableOpacity
        onPress={this.handleOnPress}
        onLongPress={this.handleOnLongPress}
        style={styles.itemWrapper}
      >
        {children}
      </TouchableOpacity>
    );
  };
}

AssetElement.contextType = ThemeContext;
