import React, {
  memo,
  ReactElement,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  InteractionManager,
  KeyboardType,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import { scale } from '../../../../util/scale';
import { useTheme } from '../../../../util/theme';
import { BottomMenuSelectorMultiOption } from './BottomMenuSelectorMultiOption';
import { SelectorOption } from '../../../common/BottomMenu';
import { useSelector } from 'react-redux';
import useBoolean from '../../../Base/useBoolean';
import { fontStyles } from '../../../../styles/common';
import { CustomChainModal } from './CustomChainModal';

interface Props {
  containerStyle?: ViewStyle;
  value: string;
  valueBottomRight: string;
  valueBottomLeft: string;
  onSelectOptionRight: (inputName: string, value: string | number) => void;
  onSelectOptionLeft: (inputName: string, value: string | number) => void;
  keyName: string;
  placeHolder: string;
  multiline?: boolean;
  onTextChange: (keyName: string, value: string) => void;
  disabled?: boolean;
  rightComponent?: ReactElement;
  keyboardType?: KeyboardType;
  required?: boolean;
  secureTextEntry?: boolean;
  optionsBottomRight: SelectorOption[];
  optionsBottomLeft: SelectorOption[];
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      minHeight: 50,
      borderWidth: 1,
      borderColor: colors.border.default,
      borderRadius: 20,
      backgroundColor: colors.background.default,
      paddingHorizontal: 8,
    },
    contentContainer: {
      paddingBottom: Platform.OS === 'android' ? 8 : 32,
    },
    valueView: {
      top: scale(14),
      left: 0,
      paddingLeft: 12,
      paddingRight: 12,
    },
    label: {
      fontSize: 14,
      paddingVertical: 12,
      color: colors.text.default,
      ...fontStyles.bold,
    },
    textInputLabel: {
      paddingLeft: 0,
      paddingTop: Platform.OS === 'android' ? 8 : 2,
      fontSize: 15,
      lineHeight: 18,
      textAlignVertical: 'top',
    },
    textInput: {
      paddingLeft: 0,
      paddingTop: Platform.OS === 'android' ? 8 : 4,
      fontSize: 14,
      lineHeight: 18,
      textAlignVertical: 'top',
      fontWeight: '500',
    },
    textRequired: {
      fontSize: 14,
    },
    containerBottom: {
      flexDirection: 'row',
      marginBottom: 12,
      justifyContent: 'space-around',
      borderTopWidth: 1,
      borderColor: colors.border.default,
      paddingTop: 12,
    },
    containerParticularBottom: {
      width: '50%',
    },
    containerTouchBottomRight: { height: scale(48), marginRight: 0 },
  });

export const InputBorderWithBottomSelector = memo((props: Props) => {
  const {
    placeHolder,
    value,
    valueBottomRight,
    onSelectOptionRight,
    onSelectOptionLeft,
    keyName,
    onTextChange,
    disabled,
    containerStyle,
    rightComponent,
    multiline,
    keyboardType,
    required,
    secureTextEntry,
    optionsBottomRight,
    optionsBottomLeft,
    valueBottomLeft,
  } = props;
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const inputRef = useRef<TextInput>(null);
  const focusedAnim = useRef(new Animated.Value(value ? 1 : 0)).current;
  const [isVisible, show, hide] = useBoolean(false);
  const [chainId, setChainId] = useState<string>('');
  const [isVisibleModal, showModal, hideModal] = useBoolean(false);

  const toggle = useCallback(
    (isActive: boolean) => {
      Animated.timing(focusedAnim, {
        toValue: isActive ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    },
    [focusedAnim],
  );

  const focus = useCallback(() => {
    inputRef.current?.focus();
  }, [inputRef]);

  const onChange = useCallback(
    (_value: string) => {
      onTextChange(keyName, _value);
    },
    [onTextChange, keyName],
  );
  const onFocus = useCallback(() => {
    if (disabled) {
      return;
    }
    toggle(true);
  }, [disabled, toggle]);

  const onBlur = useCallback(() => {
    toggle(false);
  }, [toggle]);

  const setRequired = useMemo(() => {
    return required ? ' *' : '';
  }, [required]);

  const frequentRpcList = useSelector(
    (state: any) =>
      state.engine.backgroundState.PreferencesController.frequentRpcList,
  );

  const onBottomRight = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-shadow
    (inputName: string, value: number | string) => {
      if (
        frequentRpcList.some(
          (item: { chainId: string | number }) => item.chainId === value,
        ) ||
        value === '1'
      ) {
        onSelectOptionRight(inputName, value);
        return;
      }
      setChainId(value.toString());
      hideModal();
      InteractionManager.runAfterInteractions(() => {
        show();
      });
      return;
    },
    [frequentRpcList, hideModal, onSelectOptionRight, show],
  );

  const onCloseCustom = useCallback(() => {
    hide();
    InteractionManager.runAfterInteractions(() => {
      showModal();
    });
  }, [hide, showModal]);

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.contentContainer}>
        <TouchableWithoutFeedback onPress={focus}>
          <Animated.View
            style={{
              position: 'absolute',
              left: 10,
              top: focusedAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [18, -8],
              }),
            }}
          >
            <Animated.Text
              numberOfLines={1}
              style={[
                styles.label,
                {
                  fontSize: focusedAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [14, 12],
                  }),
                  color: colors.text.muted,
                  textShadowColor: colors.background.default,
                  backgroundColor: colors.background.default,
                },
              ]}
            >
              {placeHolder}
              <Text style={styles.textRequired}>{setRequired}</Text>
            </Animated.Text>
          </Animated.View>
        </TouchableWithoutFeedback>
        <View style={styles.valueView}>
          {disabled ? (
            <Text
              numberOfLines={Platform.OS === 'ios' ? 10 : 1}
              style={styles.textInputLabel}
            >
              {value}
            </Text>
          ) : (
            <TextInput
              multiline={multiline}
              autoCapitalize={'none'}
              ref={inputRef}
              style={styles.textInput}
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              onFocus={onFocus}
              underlineColorAndroid={'transparent'}
              keyboardType={keyboardType}
              secureTextEntry={secureTextEntry}
            />
          )}
        </View>
        {rightComponent && rightComponent}
      </View>
      <View style={styles.containerBottom}>
        <BottomMenuSelectorMultiOption
          label={'Select a token'}
          options={optionsBottomLeft}
          inputName={'source_token'}
          placeholder={'Select token'}
          onSelectOption={onSelectOptionLeft}
          selectedValue={valueBottomLeft}
          containerStyle={styles.containerParticularBottom}
          containerTouch={{ height: scale(48) }}
        />
        <BottomMenuSelectorMultiOption
          label={'Select network'}
          options={optionsBottomRight}
          inputName={'price_change_percentage'}
          placeholder={'Select network'}
          onSelectOption={onBottomRight}
          selectedValue={valueBottomRight}
          containerStyle={styles.containerParticularBottom}
          containerTouch={styles.containerTouchBottomRight}
          visibleModal={isVisibleModal}
        />
      </View>
      <CustomChainModal
        isVisible={isVisible}
        onClose={hide}
        onCloseCustom={onCloseCustom}
        chainId={chainId}
      />
    </View>
  );
});
