import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  Alert,
  Image,
  InteractionManager,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { connect } from 'react-redux';
import {
  logIn,
  passwordSet,
  passwordUnset,
  seedphraseNotBackedUp,
} from '../../../actions/user';
import { setLockTime } from '../../../actions/settings';
import StyledButton from '../../UI/StyledButton';
import Engine from '../../../core/Engine';
import Device from '../../../util/device';
import { fontStyles } from '../../../styles/common';
import { strings } from '../../../../locales/i18n';
import { getOnboardingNavbarOptions } from '../../UI/Navbar';
import SecureKeychain from '../../../core/SecureKeychain';
import AppConstants from '../../../core/AppConstants';
import zxcvbn from 'zxcvbn';
import Logger from '../../../util/Logger';
import { ONBOARDING, PREVIOUS_SCREEN } from '../../../constants/navigation';
import {
  BIOMETRY_CHOICE_DISABLED,
  EXISTING_USER,
  NEXT_MAKER_REMINDER,
  SEED_PHRASE_HINTS,
  TRUE,
} from '../../../constants/storage';
import {
  getPasswordStrengthWord,
  passwordRequirementsMet,
} from '../../../util/password';
import AnalyticsV2 from '../../../util/analyticsV2';
import { mockTheme, ThemeContext } from '../../../util/theme';
import AnimatedFox from 'react-native-animated-fox';

import {
  CONFIRM_CHANGE_PASSWORD_INPUT_BOX_ID,
  CREATE_PASSWORD_CONTAINER_ID,
} from '../../../constants/test-ids';
import { LoginOptionsSwitch } from '../../UI/LoginOptionsSwitch';
import { DynamicHeader } from '../../Base/DynamicHeader';

const createStyles = (colors) =>
  StyleSheet.create({
    scrollableWrapper: {
      flex: 1,
    },
    keyboardScrollableWrapper: {
      flexGrow: 1,
    },
    loadingWrapper: {
      paddingHorizontal: 40,
      paddingBottom: 30,
      alignItems: 'center',
      flex: 1,
    },
    foxWrapper: {
      width: Device.isIos() ? 90 : 80,
      height: Device.isIos() ? 90 : 80,
      marginTop: 30,
      marginBottom: 30,
    },
    image: {
      alignSelf: 'center',
      width: 80,
      height: 80,
    },

    subtitle: {
      fontSize: 16,
      lineHeight: 23,
      color: colors.text.default,
      textAlign: 'center',
      ...fontStyles.normal,
    },

    checkboxContainer: {
      marginTop: 10,
      marginHorizontal: 10,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    },
    checkbox: {
      width: 18,
      height: 18,
      margin: 10,
      marginTop: -5,
    },

    learnMore: {
      color: colors.primary.default,
      textDecorationLine: 'underline',
      textDecorationColor: colors.primary.default,
    },
    field: {
      marginVertical: 5,
      position: 'relative',
    },

    ctaWrapper: {
      flex: 1,
      marginTop: 20,
      paddingHorizontal: 10,
    },
    errorMsg: {
      color: colors.error.default,
      ...fontStyles.normal,
    },
    biometrics: {
      position: 'relative',
      marginTop: 20,
      marginBottom: 30,
    },
    biometryLabel: {
      flex: 1,
      fontSize: 16,
      color: colors.text.default,
      ...fontStyles.normal,
    },
    biometrySwitch: {
      position: 'absolute',
      top: 0,
      right: 0,
    },
    hintLabel: {
      color: colors.text.default,
      fontSize: 16,
      marginBottom: 12,
      ...fontStyles.normal,
    },
    passwordStrengthLabel: {
      height: 20,
      marginTop: 10,
      fontSize: 15,
      color: colors.text.default,
      ...fontStyles.normal,
    },
    showPassword: {
      position: 'absolute',
      top: 0,
      right: 0,
    },
    // eslint-disable-next-line react-native/no-unused-styles
    strength_weak: {
      color: colors.error.default,
    },
    // eslint-disable-next-line react-native/no-unused-styles
    strength_good: {
      color: colors.primary.default,
    },
    // eslint-disable-next-line react-native/no-unused-styles
    strength_strong: {
      color: colors.success.default,
    },
    showMatchingPasswords: {
      position: 'absolute',
      top: 52,
      right: 17,
      alignSelf: 'flex-end',
    },

    mainWrapper: {
      backgroundColor: colors.background.default,
      flex: 1,
    },
    wrapper: {
      flex: 1,
    },
    onBoardingWrapper: {
      paddingHorizontal: 20,
    },
    loader: {
      backgroundColor: colors.background.default,
      flex: 1,
      minHeight: 300,
      justifyContent: 'center',
      alignItems: 'center',
    },
    action: {
      fontSize: 24,
      color: '#060A1D',
      marginBottom: 16,
      justifyContent: 'center',
      textAlign: 'center',
      ...fontStyles.bold,
    },
    infoWrapper: {
      marginBottom: 16,
      justifyContent: 'center',
    },
    info: {
      fontSize: 14,
      color: '#1B2537',
      ...fontStyles.normal,
    },
    seedPhraseConcealerContainer: {
      flex: 1,
      borderRadius: 8,
    },
    seedPhraseConcealer: {
      backgroundColor: colors.overlay.alternative,
      alignItems: 'center',
      borderRadius: 8,
      paddingHorizontal: 24,
      paddingVertical: 45,
    },
    blurView: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      borderRadius: 8,
    },
    icon: {
      width: 24,
      height: 24,
      color: colors.overlay.inverse,
      textAlign: 'center',
      marginBottom: 32,
    },
    reveal: {
      fontSize: Device.isMediumDevice() ? 13 : 16,
      ...fontStyles.bold,
      color: colors.overlay.inverse,
      lineHeight: 22,
      marginBottom: 8,
      textAlign: 'center',
    },
    watching: {
      fontSize: Device.isMediumDevice() ? 10 : 12,
      color: colors.overlay.inverse,
      lineHeight: 17,
      marginBottom: 32,
      textAlign: 'center',
    },
    viewButtonContainer: {
      width: 155,
      padding: 12,
    },
    seedPhraseWrapper: {
      backgroundColor: colors.background.default,
      borderRadius: 8,
      flexDirection: 'row',
      borderColor: colors.border.default,
      borderWidth: 1,
      marginBottom: 64,
      minHeight: 275,
    },
    wordColumn: {
      flex: 1,
      alignItems: 'center',
      paddingHorizontal: Device.isMediumDevice() ? 18 : 24,
      paddingVertical: 18,
      justifyContent: 'space-between',
    },
    wordWrapper: {
      flexDirection: 'row',
    },
    word: {
      paddingHorizontal: 8,
      paddingVertical: 6,
      fontSize: 14,
      color: colors.text.default,
      backgroundColor: colors.background.default,
      borderColor: colors.primary.default,
      borderWidth: 1,
      borderRadius: 13,
      textAlign: 'center',
      textAlignVertical: 'center',
      lineHeight: 14,
      flex: 1,
    },
    confirmPasswordWrapper: {
      flex: 1,
      padding: 16,
      paddingTop: 0,
    },
    passwordRequiredContent: {
      marginBottom: 20,
    },
    content: {
      alignItems: 'flex-start',
    },
    title: {
      fontSize: 24,
      marginBottom: 12,
      color: colors.text.default,
      justifyContent: 'center',
      width: '100%',
      ...fontStyles.bold,
    },
    text: {
      marginBottom: 32,
      justifyContent: 'center',
    },
    label: {
      fontSize: 16,
      lineHeight: 23,
      color: colors.text.default,
      textAlign: 'left',
      ...fontStyles.normal,
    },
    buttonWrapper: {
      flex: 1,
      marginTop: 20,
      justifyContent: 'flex-end',
    },
    input: {
      borderWidth: 1,
      borderRadius: 8,
      width: '100%',
      borderColor: colors.border.default,
      padding: 16,
      height: 48,
      color: colors.text.default,
    },
    warningMessageText: {
      paddingVertical: 10,
      color: colors.error.default,
      ...fontStyles.normal,
    },
    keyboardAvoidingView: {
      flex: 1,
      flexDirection: 'row',
      alignSelf: 'center',
    },
    button: {
      backgroundColor: '#060A1D',
    },
    titlePrivacy: {
      fontSize: 12,
      fontWeight: '400',
      color: '#64748B',
      marginBottom: 16,
    },
    subTitlePrivacy: {
      fontSize: 12,
      fontWeight: '500',
      color: '#060A1D',
      textDecorationLine: 'underline',
    },
    wrapperContent: {
      marginVertical: 6,
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconContent: {
      width: 20,
      height: 20,
      marginRight: 16,
    },
  });

const PASSCODE_NOT_SET_ERROR = 'Error: Passcode not set.';
const IOS_DENY_BIOMETRIC_ERROR =
  'The user name or passphrase you entered is not correct.';

/**
 * View where users can set their password for the first time
 */
class ChoosePassword extends PureComponent {
  static propTypes = {
    /**
     * The navigator object
     */
    navigation: PropTypes.object,
    /**
     * The action to update the password set flag
     * in the redux store
     */
    passwordSet: PropTypes.func,
    /**
     * The action to update the password set flag
     * in the redux store to false
     */
    passwordUnset: PropTypes.func,
    /**
     * The action to update the lock time
     * in the redux store
     */
    setLockTime: PropTypes.func,
    /**
     * A string representing the selected address => account
     */
    selectedAddress: PropTypes.string,
    /**
     * Action to reset the flag seedphraseBackedUp in redux
     */
    seedphraseNotBackedUp: PropTypes.func,
    /**
     * Object that represents the current route info like params passed to it
     */
    route: PropTypes.object,
    logIn: PropTypes.func,
  };

  state = {
    isSelected: false,
    password: '',
    confirmPassword: '',
    secureTextEntry: true,
    biometryType: null,
    biometryChoice: false,
    rememberMe: false,
    loading: false,
    error: null,
    inputWidth: { width: '99%' },
  };

  mounted = true;

  confirmPasswordInput = React.createRef();
  // Flag to know if password in keyring was set or not
  keyringControllerPasswordSet = false;

  updateNavBar = () => {
    const { route, navigation } = this.props;
    const colors = this.context.colors || mockTheme.colors;
    navigation.setOptions(getOnboardingNavbarOptions(route, {}, colors));
  };

  async componentDidMount() {
    this.updateNavBar();
    const biometryType = await SecureKeychain.getSupportedBiometryType();
    if (biometryType) {
      this.setState({
        biometryType: Device.isAndroid() ? 'biometrics' : biometryType,
        biometryChoice: true,
      });
    }
    setTimeout(() => {
      this.setState({
        inputWidth: { width: '100%' },
      });
    }, 100);
  }

  componentDidUpdate(prevProps, prevState) {
    this.updateNavBar();
    const prevLoading = prevState.loading;
    const { loading } = this.state;
    const { navigation } = this.props;
    if (!prevLoading && loading) {
      // update navigationOptions
      navigation.setParams({
        headerLeft: () => <View />,
      });
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  setSelection = () => {
    const { isSelected } = this.state;
    this.setState(() => ({ isSelected: !isSelected }));
  };

  createNewVaultAndKeychain = async (password) => {
    const { KeyringController } = Engine.context;
    await Engine.resetState();
    await KeyringController.createNewVaultAndKeychain(password);
    this.keyringControllerPasswordSet = true;
  };

  onPressCreate = async () => {
    const { loading, isSelected, password, confirmPassword } = this.state;

    if (loading) return;
    if (!passwordRequirementsMet(password)) {
      Alert.alert('Error', strings('choose_password.password_length_error'));
      return;
    }

    InteractionManager.runAfterInteractions(() => {
      AnalyticsV2.trackEvent(
        AnalyticsV2.ANALYTICS_EVENTS.WALLET_CREATION_ATTEMPTED,
      );
    });

    try {
      this.setState({ loading: true });
      const previous_screen = this.props.route.params?.[PREVIOUS_SCREEN];

      if (previous_screen === ONBOARDING) {
        await this.createNewVaultAndKeychain(password);
        this.props.seedphraseNotBackedUp();
        await AsyncStorage.removeItem(NEXT_MAKER_REMINDER);
        await AsyncStorage.setItem(EXISTING_USER, TRUE);
        await AsyncStorage.removeItem(SEED_PHRASE_HINTS);
      } else {
        await this.recreateVault(password);
      }

      // Set state in app as it was with password
      await SecureKeychain.resetGenericPassword();
      if (this.state.biometryType && this.state.biometryChoice) {
        try {
          await SecureKeychain.setGenericPassword(
            password,
            SecureKeychain.TYPES.BIOMETRICS,
          );
        } catch (error) {
          if (Device.isIos) await this.handleRejectedOsBiometricPrompt(error);
          throw error;
        }
      } else if (this.state.rememberMe) {
        await SecureKeychain.setGenericPassword(
          password,
          SecureKeychain.TYPES.REMEMBER_ME,
        );
      } else {
        await SecureKeychain.resetGenericPassword();
      }
      await AsyncStorage.setItem(EXISTING_USER, TRUE);
      await AsyncStorage.removeItem(SEED_PHRASE_HINTS);
      this.props.passwordSet();
      this.props.logIn();
      this.props.setLockTime(AppConstants.DEFAULT_LOCK_TIMEOUT);
      this.setState({ loading: false });
      this.props.navigation.replace('ManualBackupStep1', {
        password,
      });
      InteractionManager.runAfterInteractions(() => {
        AnalyticsV2.trackEvent(AnalyticsV2.ANALYTICS_EVENTS.WALLET_CREATED, {
          biometrics_enabled: Boolean(this.state.biometryType),
        });
        AnalyticsV2.trackEvent(
          AnalyticsV2.ANALYTICS_EVENTS.WALLET_SETUP_COMPLETED,
          {
            wallet_setup_type: 'new',
            new_wallet: true,
          },
        );
      });
    } catch (error) {
      await this.recreateVault('');
      // Set state in app as it was with no password
      await SecureKeychain.resetGenericPassword();
      await AsyncStorage.removeItem(NEXT_MAKER_REMINDER);
      await AsyncStorage.setItem(EXISTING_USER, TRUE);
      await AsyncStorage.removeItem(SEED_PHRASE_HINTS);
      this.props.passwordUnset();
      this.props.setLockTime(-1);
      // Should we force people to enable passcode / biometrics?
      if (error.toString() === PASSCODE_NOT_SET_ERROR) {
        Alert.alert(
          strings('choose_password.security_alert_title'),
          strings('choose_password.security_alert_message'),
        );
        this.setState({ loading: false });
      } else {
        this.setState({ loading: false, error: error.toString() });
      }
      InteractionManager.runAfterInteractions(() => {
        AnalyticsV2.trackEvent(
          AnalyticsV2.ANALYTICS_EVENTS.WALLET_SETUP_FAILURE,
          {
            wallet_setup_type: 'new',
            error_type: error.toString(),
          },
        );
      });
    }
  };

  /**
   * This function handles the case when the user rejects the OS prompt for allowing use of biometrics.
   * It resets the state and and prompts the user to both set the "Remember Me" state and to try again.
   * @param {*} error - error provide from try catch wrapping the biometric set password attempt
   */
  handleRejectedOsBiometricPrompt = async (error) => {
    const biometryType = await SecureKeychain.getSupportedBiometryType();
    if (error.toString().includes(IOS_DENY_BIOMETRIC_ERROR) && !biometryType) {
      this.setState({
        biometryType,
        biometryChoice: true,
      });
      this.updateBiometryChoice();
      throw Error(strings('choose_password.disable_biometric_error'));
    }
  };

  /**
   * Recreates a vault
   *
   * @param password - Password to recreate and set the vault with
   */
  recreateVault = async (password) => {
    const { KeyringController, PreferencesController } = Engine.context;
    const seedPhrase = await this.getSeedPhrase();

    let importedAccounts = [];
    try {
      const keychainPassword = this.keyringControllerPasswordSet
        ? this.state.password
        : '';
      // Get imported accounts
      const simpleKeyrings = KeyringController.state.keyrings.filter(
        (keyring) => keyring.type === 'Simple Key Pair',
      );
      for (let i = 0; i < simpleKeyrings.length; i++) {
        const simpleKeyring = simpleKeyrings[i];
        const simpleKeyringAccounts = await Promise.all(
          simpleKeyring.accounts.map((account) =>
            KeyringController.exportAccount(keychainPassword, account),
          ),
        );
        importedAccounts = [...importedAccounts, ...simpleKeyringAccounts];
      }
    } catch (e) {
      Logger.error(
        e,
        'error while trying to get imported accounts on recreate vault',
      );
    }

    // Recreate keyring with password given to this method
    await KeyringController.createNewVaultAndRestore(password, seedPhrase);
    // Keyring is set with empty password or not
    this.keyringControllerPasswordSet = password !== '';

    // Get props to restore vault
    const hdKeyring = KeyringController.state.keyrings[0];
    const existingAccountCount = hdKeyring.accounts.length;
    const selectedAddress = this.props.selectedAddress;
    let preferencesControllerState = PreferencesController.state;

    // Create previous accounts again
    for (let i = 0; i < existingAccountCount - 1; i++) {
      await KeyringController.addNewAccount();
    }

    try {
      // Import imported accounts again
      for (let i = 0; i < importedAccounts.length; i++) {
        await KeyringController.importAccountWithStrategy('privateKey', [
          importedAccounts[i],
        ]);
      }
    } catch (e) {
      Logger.error(
        e,
        'error while trying to import accounts on recreate vault',
      );
    }

    // Reset preferencesControllerState
    preferencesControllerState = PreferencesController.state;

    // Set preferencesControllerState again
    await PreferencesController.update(preferencesControllerState);
    // Reselect previous selected account if still available
    if (hdKeyring.accounts.includes(selectedAddress)) {
      PreferencesController.setSelectedAddress(selectedAddress);
    } else {
      PreferencesController.setSelectedAddress(hdKeyring.accounts[0]);
    }
  };

  /**
   * Returns current vault seed phrase
   * It does it using an empty password or a password set by the user
   * depending on the state the app is currently in
   */
  getSeedPhrase = async () => {
    const { KeyringController } = Engine.context;
    const { password } = this.state;
    const keychainPassword = this.keyringControllerPasswordSet ? password : '';
    const mnemonic = await KeyringController.exportSeedPhrase(
      keychainPassword,
    ).toString();
    return JSON.stringify(mnemonic).replace(/"/g, '');
  };

  jumpToConfirmPassword = () => {
    const { current } = this.confirmPasswordInput;
    current && current.focus();
  };

  updateBiometryChoice = async (biometryChoice) => {
    if (!biometryChoice) {
      await AsyncStorage.setItem(BIOMETRY_CHOICE_DISABLED, TRUE);
    } else {
      await AsyncStorage.removeItem(BIOMETRY_CHOICE_DISABLED);
    }
    this.setState({ biometryChoice });
  };

  renderSwitch = () => {
    const { biometryType, biometryChoice } = this.state;
    const handleUpdateRememberMe = (rememberMe) => {
      this.setState({ rememberMe });
    };
    return (
      <LoginOptionsSwitch
        shouldRenderBiometricOption={biometryType}
        biometryChoiceState={biometryChoice}
        onUpdateBiometryChoice={this.updateBiometryChoice}
        onUpdateRememberMe={handleUpdateRememberMe}
      />
    );
  };

  onPasswordChange = (val) => {
    const passInfo = zxcvbn(val);

    this.setState({ password: val, passwordStrength: passInfo.score });
  };

  toggleShowHide = () => {
    this.setState((state) => ({ secureTextEntry: !state.secureTextEntry }));
  };

  learnMore = () => {
    this.props.navigation.push('Webview', {
      screen: 'SimpleWebview',
      params: {
        url: 'https://metamask.zendesk.com/hc/en-us/articles/360039616872-How-can-I-reset-my-password-',
        title: 'metamask.zendesk.com',
      },
    });
  };

  setConfirmPassword = (val) => this.setState({ confirmPassword: val });

  render() {
    const {
      isSelected,
      inputWidth,
      password,
      passwordStrength,
      confirmPassword,
      secureTextEntry,
      error,
      loading,
    } = this.state;
    const passwordsMatch = password !== '' && password === confirmPassword;
    const canSubmit = passwordsMatch && isSelected;
    const previousScreen = this.props.route.params?.[PREVIOUS_SCREEN];
    const passwordStrengthWord = getPasswordStrengthWord(passwordStrength);
    const colors = this.context.colors || mockTheme.colors;
    const themeAppearance = this.context.themeAppearance || 'light';
    const styles = createStyles(colors);

    return (
      <SafeAreaView style={styles.mainWrapper}>
        {loading ? (
          <View style={styles.loadingWrapper}>
            <View style={styles.foxWrapper}>
              {Device.isAndroid() ? (
                <Image
                  source={require('../../../images/fox.png')}
                  style={styles.image}
                  resizeMethod={'auto'}
                />
              ) : (
                <AnimatedFox bgColor={colors.background.default} />
              )}
            </View>
            <ActivityIndicator size="large" color={colors.text.default} />
            <Text style={styles.title}>
              {strings(
                previousScreen === ONBOARDING
                  ? 'create_wallet.title'
                  : 'secure_your_wallet.creating_password',
              )}
            </Text>
            <Text style={styles.subtitle}>
              {strings('create_wallet.subtitle')}
            </Text>
          </View>
        ) : (
          <View style={styles.wrapper} testID={'choose-password-screen'}>
            <DynamicHeader title={'Security Password'} isHiddenBackground />
            <KeyboardAwareScrollView
              style={styles.scrollableWrapper}
              contentContainerStyle={styles.keyboardScrollableWrapper}
              resetScrollToCoords={{ x: 0, y: 0 }}
            >
              <View
                testID={CREATE_PASSWORD_CONTAINER_ID}
                style={styles.wrapper}
              >
                <View style={[styles.confirmPasswordWrapper]}>
                  <View
                    style={(styles.content, styles.passwordRequiredContent)}
                  >
                    <Text style={styles.title}>
                      {'First, let set your Security Password'}
                    </Text>
                    <View style={styles.text}>
                      <Text style={styles.label}>
                        {
                          'It is used to unlock wallet, aprrove transactions and access Secret Recovery Phrase'
                        }
                      </Text>
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder={'Enter security password'}
                      placeholderTextColor={colors.text.muted}
                      onChangeText={this.onPasswordChange}
                      secureTextEntry
                      onSubmitEditing={this.tryUnlock}
                      testID={CONFIRM_CHANGE_PASSWORD_INPUT_BOX_ID}
                      keyboardAppearance={themeAppearance}
                    />
                  </View>
                  <View style={styles.buttonWrapper}>
                    <Text style={styles.titlePrivacy}>
                      {'By continuing, you agree to the'}
                      <Text style={styles.subTitlePrivacy}>
                        {
                          ' iCrosschain User  Account Agreement  and Privacy Policy'
                        }
                      </Text>
                    </Text>
                    <StyledButton
                      containerStyle={styles.button}
                      type={'confirm'}
                      onPress={this.onPressCreate}
                      testID={'submit-button'}
                    >
                      {'Continue'}
                    </StyledButton>
                  </View>
                </View>
                {!!error && <Text style={styles.errorMsg}>{error}</Text>}
              </View>
            </KeyboardAwareScrollView>
          </View>
        )}
      </SafeAreaView>
    );
  }
}

ChoosePassword.contextType = ThemeContext;

const mapStateToProps = (state) => ({
  selectedAddress:
    state.engine.backgroundState.PreferencesController.selectedAddress,
});

const mapDispatchToProps = (dispatch) => ({
  passwordSet: () => dispatch(passwordSet()),
  passwordUnset: () => dispatch(passwordUnset()),
  setLockTime: (time) => dispatch(setLockTime(time)),
  seedphraseNotBackedUp: () => dispatch(seedphraseNotBackedUp()),
  logIn: () => dispatch(logIn()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChoosePassword);
