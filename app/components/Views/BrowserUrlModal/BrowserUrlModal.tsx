import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  InteractionManager,
  FlatList,
  // StyleSheet,
  SafeAreaView,
} from 'react-native';
import ReusableModal, { ReusableModalRef } from '../../UI/ReusableModal';
import Icon from 'react-native-vector-icons/FontAwesome';
import { strings } from '../../../../locales/i18n';
import { createStyles } from './styles';
import { useTheme } from '../../../util/theme';
import UrlAutocomplete from '../../UI/UrlAutocomplete';
import { BROWSER_URL_MODAL_ID } from '../../../constants/test-ids';
import {
  createNavigationDetails,
  useParams,
} from '../../../util/navigation/navUtils';
import Routes from '../../../constants/navigation/Routes';
import Device from '../../../util/device';
// import ListItem from '../../Base/ListItem';

export interface BrowserUrlParams {
  onUrlInputSubmit: (inputValue: string | undefined) => void;
  onClearHistory: () => void;
  url: string | undefined;
  history: any;
}

export const createBrowserUrlModalNavDetails =
  createNavigationDetails<BrowserUrlParams>(Routes.BROWSER_URL_MODAL);

const BrowserUrlModal = () => {
  const { onUrlInputSubmit, onClearHistory, url, history } =
    useParams<BrowserUrlParams>();
  const modalRef = useRef<ReusableModalRef | null>(null);
  const { colors, themeAppearance } = useTheme();
  const styles = createStyles(colors);
  const [autocompleteValue, setAutocompleteValue] = useState<
    string | undefined
  >(url);
  const inputRef = useRef<TextInput | null>(null);
  const dismissModal = useCallback(
    (callback?: () => void) => modalRef?.current?.dismissModal(callback),
    [],
  );

  /** Clear search input and focus */
  const clearSearchInput = useCallback(() => {
    setAutocompleteValue(undefined);
    inputRef.current?.focus?.();
  }, []);

  InteractionManager.runAfterInteractions(() => {
    // Needed to focus the input after modal renders on Android
    inputRef.current?.focus?.();
    // Needed to manually selectTextOnFocus on iOS
    // https://github.com/facebook/react-native/issues/30585
    if (Device.isIos()) {
      if (inputRef.current && autocompleteValue) {
        inputRef.current.setNativeProps({
          selection: { start: 0, end: autocompleteValue.length },
        });
      }
    }
  });

  const triggerClose = useCallback(() => dismissModal(), [dismissModal]);
  const triggerOnSubmit = useCallback(
    (val: string) => dismissModal(() => onUrlInputSubmit(val)),
    [dismissModal, onUrlInputSubmit],
  );

  const renderContent = () => (
    <>
      <View style={styles.urlModalContent} testID={BROWSER_URL_MODAL_ID}>
        <View style={styles.searchWrapper}>
          <TextInput
            keyboardType="web-search"
            ref={inputRef}
            autoCapitalize="none"
            autoCorrect={false}
            testID={'url-input'}
            onChangeText={setAutocompleteValue}
            onSubmitEditing={() => triggerOnSubmit(autocompleteValue || '')}
            placeholder={strings('autocomplete.placeholder')}
            placeholderTextColor={colors.text.muted}
            returnKeyType="go"
            style={styles.urlInput}
            value={autocompleteValue}
            selectTextOnFocus
            keyboardAppearance={themeAppearance}
            autoFocus
          />
          {autocompleteValue ? (
            <TouchableOpacity
              onPress={clearSearchInput}
              style={styles.clearButton}
            >
              <Icon name="times-circle" size={18} color={colors.icon.default} />
            </TouchableOpacity>
          ) : null}
        </View>
        <TouchableOpacity
          style={styles.cancelButton}
          testID={'cancel-url-button'}
          onPress={triggerClose}
        >
          <Text style={styles.cancelButtonText}>
            {strings('browser.cancel')}
          </Text>
        </TouchableOpacity>
      </View>
      {!autocompleteValue && (
        <SafeAreaView style={styles.searchSuggestion}>
          <View style={styles.popularSearchArea}>
            <Text style={styles.searchHistoryText}>{'Popular search'}</Text>
            <View style={styles.popularSearch}>
              <View style={styles.popularSearchItem}>
                <Text>{'Pancake'}</Text>
              </View>
            </View>
          </View>

          <View style={styles.searchHistory}>
            <View style={styles.searchHistoryTitle}>
              <Text style={styles.searchHistoryText}>{'Search History'}</Text>
              <TouchableOpacity
                onPress={() => onClearHistory()}
                style={styles.clearHistoryButton}
              >
                <Icon name="trash" size={24} color={colors.icon.default} />
              </TouchableOpacity>
            </View>
            <FlatList
              style={styles.history}
              data={history}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    triggerOnSubmit(item.url);
                  }}
                >
                  <View style={styles.historyItem}>
                    <View style={styles.historyItemBody}>
                      <Text style={styles.historyItemTitle}>{item.name}</Text>
                      <Text style={styles.historyItemUrl}>{item.url}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={clearSearchInput}
                      style={styles.clearButton}
                    >
                      <Icon
                        name="times"
                        size={18}
                        color={colors.icon.default}
                      />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.name}
            />
          </View>
        </SafeAreaView>
      )}
      {autocompleteValue ? (
        <UrlAutocomplete
          onSubmit={triggerOnSubmit}
          input={autocompleteValue}
          onDismiss={triggerClose}
        />
      ) : null}
    </>
  );

  return (
    <ReusableModal ref={modalRef} style={styles.screen}>
      {renderContent()}
    </ReusableModal>
  );
};

export default React.memo(BrowserUrlModal);
