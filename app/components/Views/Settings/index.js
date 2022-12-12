import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import {
  StyleSheet,
  ScrollView,
  InteractionManager,
  Alert,
} from 'react-native';
import SettingsDrawer from '../../UI/SettingsDrawer';
import { getClosableNavigationOptions } from '../../UI/Navbar';
import { strings } from '../../../../locales/i18n';
import Analytics from '../../../core/Analytics/Analytics';
import { ANALYTICS_EVENT_OPTS } from '../../../util/analytics';
import { connect } from 'react-redux';
import { ThemeContext, mockTheme } from '../../../util/theme';
import Routes from '../../../constants/navigation/Routes';
import { logOut } from '../../../actions/user';

const createStyles = (colors) =>
  StyleSheet.create({
    wrapper: {
      backgroundColor: colors.background.default,
      flex: 1,
      paddingHorizontal: 18,
      zIndex: 99999999999999,
    },
  });

/**
 * Main view for app configurations
 */
class Settings extends PureComponent {
  static propTypes = {
    /**
    /* navigation object required to push new views
    */
    navigation: PropTypes.object,
    /**
     * redux flag that indicates if the user
     * completed the seed phrase backup flow
     */
    seedphraseBackedUp: PropTypes.bool,
  };

  updateNavBar = () => {
    const { navigation } = this.props;
    const colors = this.context.colors || mockTheme.colors;
    navigation.setOptions(
      getClosableNavigationOptions(
        strings('app_settings.title'),
        strings('navigation.close'),
        navigation,
        colors,
      ),
    );
  };

  componentDidMount = () => {
    this.updateNavBar();
  };

  componentDidUpdate = () => {
    this.updateNavBar();
  };

  onPressGeneral = () => {
    InteractionManager.runAfterInteractions(() =>
      Analytics.trackEvent(ANALYTICS_EVENT_OPTS.SETTINGS_GENERAL),
    );
    this.props.navigation.navigate('GeneralSettings');
  };

  onPressAdvanced = () => {
    InteractionManager.runAfterInteractions(() =>
      Analytics.trackEvent(ANALYTICS_EVENT_OPTS.SETTINGS_ADVANCED),
    );
    this.props.navigation.navigate('AdvancedSettings');
  };

  onPressSecurity = () => {
    InteractionManager.runAfterInteractions(() =>
      Analytics.trackEvent(ANALYTICS_EVENT_OPTS.SETTINGS_SECURITY_AND_PRIVACY),
    );
    this.props.navigation.navigate('SecuritySettings');
  };

  onPressNetworks = () => {
    this.props.navigation.navigate('NetworksSettings');
  };

  onPressExperimental = () => {
    InteractionManager.runAfterInteractions(() =>
      Analytics.trackEvent(ANALYTICS_EVENT_OPTS.SETTINGS_EXPERIMENTAL),
    );
    this.props.navigation.navigate('ExperimentalSettings');
  };
  logout = () => {
    Alert.alert(
      strings('drawer.lock_title'),
      '',
      [
        {
          text: strings('drawer.lock_cancel'),
          onPress: () => null,
          style: 'cancel',
        },
        {
          text: strings('drawer.lock_ok'),
          onPress: () => this.onPressLogout(),
        },
      ],
      { cancelable: false },
    );
  };
  onPressLogout = () => {
    this.props.navigation.navigate(Routes.ONBOARDING.LOGIN);
    this.props.logOut();
  };

  onPressInfo = () => {
    InteractionManager.runAfterInteractions(() =>
      Analytics.trackEvent(ANALYTICS_EVENT_OPTS.SETTINGS_ABOUT),
    );
    this.props.navigation.navigate('CompanySettings');
  };

  onPressContacts = () => {
    this.props.navigation.navigate('ContactsSettings');
  };

  render = () => {
    const { seedphraseBackedUp } = this.props;
    const colors = this.context.colors || mockTheme.colors;
    const styles = createStyles(colors);

    return (
      <ScrollView style={styles.wrapper}>
        <SettingsDrawer
          description={strings('app_settings.general_desc')}
          onPress={this.onPressGeneral}
          title={strings('app_settings.general_title')}
<<<<<<< HEAD
<<<<<<< HEAD
          icon={'gears'}
        />
=======
          icon={"gears"}
        /> */}
>>>>>>> 42b434a3... fix style button and setting, hide settings
=======
          icon={'gears'}
        />
>>>>>>> 508174d3... update setting
        <SettingsDrawer
          description={strings('app_settings.security_desc')}
          onPress={this.onPressSecurity}
          title={strings('app_settings.security_title')}
          warning={!seedphraseBackedUp}
          icon={'user-secret'}
        />
        {/* <SettingsDrawer
          description={strings('app_settings.advanced_desc')}
          onPress={this.onPressAdvanced}
          title={strings('app_settings.advanced_title')}
          icon={"magic"}
        />
        <SettingsDrawer
          description={strings('app_settings.contacts_desc')}
          onPress={this.onPressContacts}
          title={strings('app_settings.contacts_title')}
          icon={"address-book-o"}
        />
        <SettingsDrawer
          title={strings('app_settings.networks_title')}
          description={strings('app_settings.networks_desc')}
          onPress={this.onPressNetworks}
          icon={"wifi"}
        />
        <SettingsDrawer
          title={strings('app_settings.experimental_title')}
          description={strings('app_settings.experimental_desc')}
          onPress={this.onPressExperimental}
          icon={"plug"}
        /> */}
        {/* <SettingsDrawer
          title={strings('app_settings.info_title')}
          onPress={this.onPressInfo}
        /> */}
        <SettingsDrawer
          title={strings('app_settings.logout')}
          onPress={this.logout}
          icon={'logout'}
        />
      </ScrollView>
    );
  };
}

Settings.contextType = ThemeContext;

const mapStateToProps = (state) => ({
  seedphraseBackedUp: state.user.seedphraseBackedUp,
});

const mapDispatchToProps = (dispatch) => ({
  logOut: () => dispatch(logOut()),
});
export default connect(mapStateToProps, mapDispatchToProps)(Settings);
