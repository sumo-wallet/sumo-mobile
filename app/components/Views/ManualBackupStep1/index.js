import React, { PureComponent } from 'react';
import {
  ActivityIndicator,
  Appearance,
  Image,
  InteractionManager,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { baseStyles, fontStyles } from '../../../styles/common';
import StyledButton from '../../UI/StyledButton';
import { strings } from '../../../../locales/i18n';
import FeatherIcons from 'react-native-vector-icons/Feather';
import { BlurView } from '@react-native-community/blur';
import Device from '../../../util/device';
import Engine from '../../../core/Engine';
import PreventScreenshot from '../../../core/PreventScreenshot';
import SecureKeychain from '../../../core/SecureKeychain';
import { getOnboardingNavbarOptions } from '../../UI/Navbar';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  MANUAL_BACKUP_STEPS,
  SEED_PHRASE,
  WRONG_PASSWORD_ERROR,
} from '../../../constants/onboarding';

import { CONFIRM_CHANGE_PASSWORD_INPUT_BOX_ID } from '../../../constants/test-ids';

import AnalyticsV2 from '../../../util/analyticsV2';
import { mockTheme, ThemeContext } from '../../../util/theme';
import { IC_ARROW_ROTATE, IC_CROSS_CIRCLE } from 'images/index';
import { DynamicHeader } from '../../Base/DynamicHeader';

const createStyles = (colors) =>
  StyleSheet.create({
    mainWrapper: {
      backgroundColor: colors.background.default,
      flex: 1,
    },
    wrapper: {
      flex: 1,
      paddingHorizontal: 16,
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

/**
 * View that's shown during the second step of
 * the backup seed phrase flow
 */
class ManualBackupStep1 extends PureComponent {
  static propTypes = {
    /**
    /* navigation object required to push and pop other views
    */
    navigation: PropTypes.object,
    /**
     * Object that represents the current route info like params passed to it
     */
    route: PropTypes.object,
    /**
     * Theme that app is set to
     */
    appTheme: PropTypes.string,
  };

  steps = MANUAL_BACKUP_STEPS;

  state = {
    seedPhraseHidden: true,
    currentStep: 1,
    password: undefined,
    warningIncorrectPassword: undefined,
    ready: false,
    view: SEED_PHRASE,
  };

  updateNavBar = () => {
    const { route, navigation } = this.props;
    const colors = this.context.colors || mockTheme.colors;
    navigation.setOptions(getOnboardingNavbarOptions(route, {}, colors));
  };

  async componentDidMount() {
    this.updateNavBar();
    this.words = this.props.route.params?.words ?? [];
    if (!this.words.length) {
      try {
        const credentials = await SecureKeychain.getGenericPassword();
        if (credentials) {
          this.words = await this.tryExportSeedPhrase(credentials.password);
        } else {
          this.words = this.tryUnlockWithPassword(
            this.props.route.params?.password,
          );
        }
      } catch (e) {}
    }
    this.setState({ ready: true });
    InteractionManager.runAfterInteractions(() => PreventScreenshot.forbid());
  }

  componentDidUpdate = () => {
    this.updateNavBar();
  };

  onPasswordChange = (password) => {
    this.setState({ password });
  };

  goNext = () => {
    this.props.navigation.navigate('ManualBackupPhrase', {
      words: this.words,
    });
  };

  revealSeedPhrase = () => {
    this.setState({ seedPhraseHidden: false });
    InteractionManager.runAfterInteractions(() => {
      AnalyticsV2.trackEvent(
        AnalyticsV2.ANALYTICS_EVENTS.WALLET_SECURITY_PHRASE_REVEALED,
      );
    });
  };

  tryExportSeedPhrase = async (password) => {
    const { KeyringController } = Engine.context;
    const mnemonic = await KeyringController.exportSeedPhrase(
      password,
    ).toString();
    const seed = JSON.stringify(mnemonic).replace(/"/g, '').split(' ');
    return seed;
  };

  tryUnlockWithPassword = async (password) => {
    this.setState({ ready: false });
    try {
      this.words = await this.tryExportSeedPhrase(password);
      this.setState({ view: SEED_PHRASE, ready: true });
    } catch (e) {
      let msg = strings('reveal_credential.warning_incorrect_password');
      if (e.toString().toLowerCase() !== WRONG_PASSWORD_ERROR.toLowerCase()) {
        msg = strings('reveal_credential.unknown_error');
      }
      this.setState({
        warningIncorrectPassword: msg,
        ready: true,
      });
    }
  };

  tryUnlock = () => {
    const { password } = this.state;
    this.tryUnlockWithPassword(password);
  };

  renderLoader = () => {
    const colors = this.context.colors || mockTheme.colors;
    const styles = createStyles(colors);

    return (
      <View style={styles.loader}>
        <ActivityIndicator size="small" />
      </View>
    );
  };

  getBlurType = () => {
    const { appTheme } = this.props;
    let blurType = 'light';
    switch (appTheme) {
      case 'light':
        blurType = 'light';
        break;
      case 'dark':
        blurType = 'dark';
        break;
      case 'os':
        blurType = Appearance.getColorScheme();
        break;
      default:
        blurType = 'light';
    }
    return blurType;
  };

  renderSeedPhraseConcealer = () => {
    const colors = this.context.colors || mockTheme.colors;
    const styles = createStyles(colors);
    const blurType = this.getBlurType();

    return (
      <View style={styles.seedPhraseConcealerContainer}>
        <BlurView blurType={blurType} blurAmount={5} style={styles.blurView} />
        <View style={styles.seedPhraseConcealer}>
          <FeatherIcons name="eye-off" size={24} style={styles.icon} />
          <Text style={styles.reveal}>
            {strings('manual_backup_step_1.reveal')}
          </Text>
          <Text style={styles.watching}>
            {strings('manual_backup_step_1.watching')}
          </Text>
          <View style={styles.viewButtonWrapper}>
            <StyledButton
              type={'onOverlay'}
              testID={'view-button'}
              onPress={this.revealSeedPhrase}
              containerStyle={styles.viewButtonContainer}
            >
              {strings('manual_backup_step_1.view')}
            </StyledButton>
          </View>
        </View>
      </View>
    );
  };

  renderConfirmPassword() {
    const { warningIncorrectPassword } = this.state;
    const colors = this.context.colors || mockTheme.colors;
    const themeAppearance = this.context.themeAppearance || 'light';
    const styles = createStyles(colors);

    return (
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={'padding'}
      >
        <KeyboardAwareScrollView
          enableOnAndroid
          contentContainerStyle={baseStyles.flexGrow}
        >
          <View style={[styles.confirmPasswordWrapper]}>
            <View style={(styles.content, styles.passwordRequiredContent)}>
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
              {warningIncorrectPassword && (
                <Text style={styles.warningMessageText}>
                  {warningIncorrectPassword}
                </Text>
              )}
            </View>
            <View style={styles.buttonWrapper}>
              <Text style={styles.titlePrivacy}>
                {'By continuing, you agree to the'}
                <Text style={styles.subTitlePrivacy}>
                  {' iCrosschain User  Account Agreement  and Privacy Policy'}
                </Text>
              </Text>
              <StyledButton
                containerStyle={styles.button}
                type={'confirm'}
                onPress={this.tryUnlock}
                testID={'submit-button'}
              >
                {'Continue'}
              </StyledButton>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>
    );
  }

  renderSeedphraseView = () => {
    const words = this.words || [];
    const wordLength = words.length;
    const half = wordLength / 2 || 6;
    const colors = this.context.colors || mockTheme.colors;
    const styles = createStyles(colors);

    return (
      <View style={styles.wrapper}>
        <DynamicHeader title={'Security Password'} isHiddenBackground />
        <View style={styles.mainWrapper} testID={'manual_backup_step_1-screen'}>
          <Text style={styles.action}>{'Generate Secret Recovery Phrase'}</Text>
          <View style={styles.infoWrapper}>
            <Text style={styles.info}>
              {'It is the master key to your wallet:'}
            </Text>
            <View style={styles.wrapperContent}>
              <Image style={styles.iconContent} source={IC_ARROW_ROTATE} />
              <Text
                style={[styles.info, baseStyles.flexGrow]}
                numberOfLines={3}
              >
                {
                  'It can be used to recover your wallet on any compatible device. Those who hold it can take full control of the wallet. '
                }
              </Text>
            </View>
            <View style={styles.wrapperContent}>
              <Image style={styles.iconContent} source={IC_CROSS_CIRCLE} />
              <Text
                style={[styles.info, baseStyles.flexGrow]}
                numberOfLines={3}
              >
                {
                  'iCrosschain will never access, store or ask for your Secret Recovery Phrase, hence we cannot retrieve it once it is lost. '
                }
              </Text>
            </View>
            <Text style={styles.info}>{'So:'}</Text>
            <View style={styles.wrapperContent}>
              <Image style={styles.iconContent} source={IC_CROSS_CIRCLE} />
              <Text
                style={[styles.info, baseStyles.flexGrow]}
                numberOfLines={3}
              >
                {
                  'Please keep it secure and offline. Do not screenshot or copy it to the clipboard.'
                }
              </Text>
            </View>
            <View style={styles.wrapperContent}>
              <Image style={styles.iconContent} source={IC_CROSS_CIRCLE} />
              <Text
                style={[styles.info, baseStyles.flexGrow]}
                numberOfLines={3}
              >
                {'Do not give it to anyone.'}
              </Text>
            </View>
          </View>
        </View>
        <StyledButton
          containerStyle={styles.button}
          type={'confirm'}
          onPress={this.goNext}
          testID={'submit-button'}
        >
          {'Continue'}
        </StyledButton>
      </View>
    );
  };

  render() {
    const { ready, view } = this.state;
    const colors = this.context.colors || mockTheme.colors;
    const styles = createStyles(colors);

    if (!ready) return this.renderLoader();
    return (
      <SafeAreaView style={styles.mainWrapper}>
        <View style={styles.onBoardingWrapper} />
        {/*{view === SEED_PHRASE*/}
        {/*  ? this.renderSeedphraseView()*/}
        {/*  : this.renderConfirmPassword()}*/}
        {this.renderSeedphraseView()}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => ({
  appTheme: state.user.appTheme,
});

ManualBackupStep1.contextType = ThemeContext;

export default connect(mapStateToProps)(ManualBackupStep1);
