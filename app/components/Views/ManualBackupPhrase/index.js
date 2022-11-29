import React, { PureComponent } from 'react';
import {
  ActivityIndicator,
  FlatList,
  InteractionManager,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fontStyles } from '../../../styles/common';
import StyledButton from '../../UI/StyledButton';
import Device from '../../../util/device';
import Engine from '../../../core/Engine';
import PreventScreenshot from '../../../core/PreventScreenshot';
import SecureKeychain from '../../../core/SecureKeychain';
import { getOnboardingNavbarOptions } from '../../UI/Navbar';
import {
  CONFIRM_PASSWORD,
  MANUAL_BACKUP_STEPS,
  SEED_PHRASE,
} from '../../../constants/onboarding';
import { mockTheme, ThemeContext } from '../../../util/theme';
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
      marginBottom: 12,
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
      color: colors.text.default,
      ...fontStyles.normal,
    },

    icon: {
      width: 24,
      height: 24,
      color: colors.overlay.inverse,
      textAlign: 'center',
      marginBottom: 32,
    },

    seedPhraseWrapper: {
      backgroundColor: colors.background.default,
      marginBottom: 64,
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
      height: 40,
      marginVertical: 6,
      backgroundColor: colors.background.default,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderWidth: 1,
      borderRadius: 8,
      alignItems: 'center',
      borderColor: '#E2E8F0',
      width: 110,
    },
    word: {
      fontSize: 14,
      color: colors.text.default,
      textAlign: 'center',
      textAlignVertical: 'center',
      lineHeight: 14,
    },
    number: {
      color: '#8E9BAE',
      fontSize: 12,
      fontWeight: '500',
      textAlign: 'center',
      textAlignVertical: 'center',
      lineHeight: 14,
      marginRight: 8,
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

    input: {
      borderWidth: 1,
      borderRadius: 8,
      width: '100%',
      borderColor: colors.border.default,
      padding: 16,
      height: 48,
      color: colors.text.default,
    },

    button: {
      backgroundColor: '#060A1D',
    },
    subWordWrapper: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
  });

/**
 * View that's shown during the second step of
 * the backup seed phrase flow
 */
class ManualBackupPharse extends PureComponent {
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
          this.setState({ view: CONFIRM_PASSWORD });
        }
      } catch (e) {
        this.setState({ view: CONFIRM_PASSWORD });
      }
    }

    this.setState({ ready: true });
    InteractionManager.runAfterInteractions(() => PreventScreenshot.forbid());
  }

  componentDidUpdate = () => {
    this.updateNavBar();
  };

  goNext = () => {
    this.props.navigation.navigate('ManualBackupStep2', {
      words: this.words,
      steps: this.steps,
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

  renderLoader = () => {
    const colors = this.context.colors || mockTheme.colors;
    const styles = createStyles(colors);

    return (
      <View style={styles.loader}>
        <ActivityIndicator size="small" />
      </View>
    );
  };

  renderItem = ({ item, index }) => {
    const colors = this.context.colors || mockTheme.colors;
    const styles = createStyles(colors);

    return (
      <View style={styles.wordWrapper}>
        <Text style={styles.number}>{`${index + 1} `}</Text>
        <Text style={styles.word}>{`${item}`}</Text>
      </View>
    );
  };

  renderSeedphraseView = () => {
    const colors = this.context.colors || mockTheme.colors;
    const styles = createStyles(colors);

    return (
      <View style={styles.wrapper}>
        <DynamicHeader title={'Security Password'} isHiddenBackground />
        <View style={styles.mainWrapper} testID={'manual_backup_step_1-screen'}>
          <Text style={styles.action}>{'Secret Recovery Phrase'}</Text>
          <View style={styles.infoWrapper}>
            <Text style={styles.info}>
              {
                'Write down the Secret Recovery Phrase in order. Do not screen shot or send the phrase to anyone'
              }
            </Text>
          </View>
          <FlatList
            numColumns={3}
            scrollEnabled={false}
            data={this.words}
            renderItem={this.renderItem}
            containerStyle={styles.seedPhraseWrapper}
            columnWrapperStyle={{
              justifyContent: 'space-around',
            }}
          />
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
    const { ready } = this.state;
    const colors = this.context.colors || mockTheme.colors;
    const styles = createStyles(colors);

    if (!ready) return this.renderLoader();
    return (
      <SafeAreaView style={styles.mainWrapper}>
        <View style={styles.onBoardingWrapper} />
        {this.renderSeedphraseView()}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => ({
  appTheme: state.user.appTheme,
});

ManualBackupPharse.contextType = ThemeContext;

export default connect(mapStateToProps)(ManualBackupPharse);
