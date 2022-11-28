import React, { PureComponent } from 'react';
import Engine from '../../../core/Engine';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  InteractionManager,
  StyleSheet,
  View,
  SafeAreaView,
} from 'react-native';
import { strings } from '../../../../locales/i18n';
import Logger from '../../../util/Logger';
import Analytics from '../../../core/Analytics/Analytics';
import AnalyticsV2 from '../../../util/analyticsV2';
import { ANALYTICS_EVENT_OPTS } from '../../../util/analytics';
import { connect } from 'react-redux';
import { ThemeContext, mockTheme } from '../../../util/theme';
import { Colors } from '../../../styles';
import { SButton } from '../../common/SButton';
import { showAlert } from '../../../actions/alert';
import { toggleAddAccountsModal } from '../../../actions/modals';
import { protectWalletModalVisible } from '../../../actions/user';
import NotificationManager from '../../../../app/core/NotificationManager';

const createStyles = (colors: any) =>
  StyleSheet.create({
    wrapper: {
      backgroundColor: Colors.divider[1],
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      minHeight: 350,
    },
    titleWrapper: {
      width: '100%',
      height: 33,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dragger: {
      width: 48,
      height: 5,
      borderRadius: 4,
      backgroundColor: Colors.white[1],
    },

    containerBtn: {
      backgroundColor: Colors.white[3],
      marginTop: 20,
      marginHorizontal: 16,
    },
  });

/**
 * View that contains the list of all the available accounts
 */
class AccountListOption extends PureComponent {
  static propTypes = {
    /**
     * An object containing each identity in the format address => account
     */
    identities: PropTypes.object,
    /**
     * A string representing the selected address => account
     */
    selectedAddress: PropTypes.string,
    /**
     * function to be called when switching accounts
     */
    onAccountChange: PropTypes.func,
    /**
     * function to be called when importing an account
     */
    onImportAccount: PropTypes.func,
    /**
     * function to be called when connect to a QR hardware
     */
    onConnectHardware: PropTypes.func,
    /**
     * Whether it will show options to create or import accounts
     */
    enableAccountsAddition: PropTypes.bool,
    /**
     * ID of the current network
     */
    showAlert: PropTypes.func,
    protectWalletModalVisible: PropTypes.func,
    toggleAddAccountsModal: PropTypes.func,
    navigation: PropTypes.object,
  };

  state = {
    loading: false,
  };

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount = () => {
    this.mounted = false;
  };

  importAccount = () => {
    this.props.onImportAccount();
    this.props.toggleAddAccountsModal();
    InteractionManager.runAfterInteractions(() => {
      Analytics.trackEvent(ANALYTICS_EVENT_OPTS.ACCOUNTS_IMPORTED_NEW_ACCOUNT);
    });
  };

  connectHardware = () => {
    this.props.onConnectHardware();
    this.props.toggleAddAccountsModal();
    AnalyticsV2.trackEvent(
      AnalyticsV2.ANALYTICS_EVENTS.CONNECT_HARDWARE_WALLET,
    );
  };

  addAccount = async () => {
    if (this.state.loading) return;
    this.mounted && this.setState({ loading: true });
    const { KeyringController } = Engine.context;
    this.props.toggleAddAccountsModal();

    requestAnimationFrame(async () => {
      try {
        await KeyringController.addNewAccount();
        const { PreferencesController } = Engine.context;
        const newIndex = Object.keys(this.props.identities).length - 1;
        PreferencesController.setSelectedAddress(
          Object.keys(this.props.identities)[newIndex],
        );
        setTimeout(() => {
          this.mounted && this.setState({ loading: false });
          // this.props.navigation && this.props.navigation.goBack();
          // TODO: open new account detail screen
          NotificationManager.showSimpleNotification({
            status: `simple_notification`,
            duration: 5000,
            title: strings('import_private_key_success.title'),
            description: strings('import_private_key_success.description_one', {
              tokenSymbol: '',
            }),
          });
        }, 500);
        // const orderedAccounts = this.getAccounts();
        // this.mounted && this.setState({ orderedAccounts });
      } catch (e) {
        // Restore to the previous index in case anything goes wrong
        Logger.error(e, 'error while trying to add a new account'); // eslint-disable-line
        this.mounted && this.setState({ loading: false });
      }
    });
    InteractionManager.runAfterInteractions(() => {
      Analytics.trackEvent(ANALYTICS_EVENT_OPTS.ACCOUNTS_ADDED_NEW_ACCOUNT);
    });
  };

  render() {
    // const { orderedAccounts, accountsENS } = this.state;
    const { enableAccountsAddition } = this.props;
    const colors = this.context.colors || mockTheme.colors;
    const styles = createStyles(colors);

    return (
      <SafeAreaView style={styles.wrapper} testID={'account-list'}>
        <View style={styles.titleWrapper}>
          <View style={styles.dragger} testID={'account-list-dragger'} />
        </View>
        {enableAccountsAddition && (
          <View>
            <SButton
              style={styles.containerBtn}
              type={'primary'}
              title={strings('accounts.create_new_account')}
              onPress={this.addAccount}
            >
              {this.state.loading ? (
                <ActivityIndicator
                  size="small"
                  color={colors.primary.default}
                />
              ) : (
                <View />
              )}
            </SButton>
            <SButton
              style={styles.containerBtn}
              testID={'import-account-button'}
              type={'primary'}
              title={strings('accounts.import_account')}
              onPress={this.importAccount}
            />
            <SButton
              style={styles.containerBtn}
              testID={'import-account-button'}
              type={'primary'}
              title={strings('accounts.connect_hardware')}
              onPress={this.connectHardware}
            />
          </View>
        )}
      </SafeAreaView>
    );
  }
}

AccountListOption.contextType = ThemeContext;

const mapStateToProps = (state) => ({
  address: state.engine.backgroundState.PreferencesController.selectedAddress,
});

const mapDispatchToProps = (dispatch) => ({
  showAlert: (config) => dispatch(showAlert(config)),
  protectWalletModalVisible: () => dispatch(protectWalletModalVisible()),
  toggleAddAccountsModal: () => dispatch(toggleAddAccountsModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AccountListOption);
