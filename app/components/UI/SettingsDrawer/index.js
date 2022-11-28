import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { fontStyles } from '../../../styles/common';
import Icon from 'react-native-vector-icons/FontAwesome';
import SettingsNotification from '../SettingsNotification';
import { strings } from '../../../../locales/i18n';
import { useTheme } from '../../../util/theme';

const createStyles = (colors) =>
  StyleSheet.create({
    root: {
      backgroundColor: colors.background.alternative,
      borderBottomWidth: 1,
      flexDirection: 'row',
      minHeight: 100,
      paddingVertical: 18,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 6,
      borderRadius: 10,
    },
    content: {
      flex: 1,
    },
    title: {
      ...fontStyles.normal,
      color: colors.text.default,
      fontSize: 20,
      marginBottom: 8,
    },
    description: {
      ...fontStyles.normal,
      color: colors.text.alternative,
      fontSize: 14,
      lineHeight: 20,
      paddingRight: 8,
    },
    action: {
      flex: 0,
      paddingHorizontal: 16,
      opacity: 0.5,
    },
    logoView: {
      width: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logo: {
      color: colors.icon.alternative,
      right: 4,
    },
    icon: {
      bottom: 8,
      color: colors.icon.alternative,
      left: 4,
      position: 'relative',
    },
    noBorder: {
      borderBottomWidth: 0,
    },
    warning: {
      alignSelf: 'flex-start',
      marginTop: 20,
    },
    menuItemWarningText: {
      color: colors.text.default,
      fontSize: 12,
      ...fontStyles.normal,
    },
  });

const propTypes = {
  title: PropTypes.string,
  /**
   * Additional descriptive text about this option
   */
  description: PropTypes.string,
  /**
   * Disable bottom border
   */
  noBorder: PropTypes.bool,
  /**
   * Handler called when this drawer is pressed
   */
  onPress: PropTypes.func,
  /**
   * Display SettingsNotification
   */
  warning: PropTypes.bool,

  icon: PropTypes.string,
};

const defaultProps = {
  onPress: undefined,
};

const SettingsDrawer = ({ icon, title, description, noBorder, onPress, warning }) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={noBorder ? [styles.root, styles.noBorder] : styles.root}>
        <View style={styles.logoView}>
          <Icon name={icon || ""} size={18} style={styles.logo} />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          <View>
            {warning ? (
              <SettingsNotification
                style={styles.warning}
                isWarning
                isNotification
              >
                <Text style={styles.menuItemWarningText}>
                  {strings('drawer.settings_warning')}
                </Text>
              </SettingsNotification>
            ) : null}
          </View>
        </View>
        <View style={styles.action}>
          <Icon name="angle-right" size={20} style={styles.icon} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

SettingsDrawer.propTypes = propTypes;
SettingsDrawer.defaultProps = defaultProps;

export default SettingsDrawer;
