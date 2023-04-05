import React, { memo, PropsWithChildren, useEffect } from 'react';
import Modal, { ModalProps } from 'react-native-modal';
import { StatusBar, StyleSheet } from 'react-native';

interface OwnProps extends Partial<ModalProps> {
  isVisible: boolean;
  onClose?: () => void;
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden',
  },
});

type Props = OwnProps;

export const BottomMenuModal = memo(
  ({ onClose, children, ...rest }: PropsWithChildren<Props>) => {
    useEffect(() => {
      const stack = rest.isVisible
        ? StatusBar.pushStackEntry({
            translucent: true,
            showHideTransition: 'fade',
            networkActivityIndicatorVisible: true,
            animated: true,
            backgroundColor: 'rgba(0,0,0,0.4)',
            hidden: false,
            barStyle: 'light-content',
          })
        : null;
      return () => {
        stack && StatusBar.popStackEntry(stack);
      };
    }, [rest.isVisible]);

    return (
      <Modal
        style={styles.modal}
        onBackButtonPress={onClose}
        onBackdropPress={onClose}
        backdropTransitionOutTiming={0}
        backdropOpacity={0.4}
        propagateSwipe
        {...rest}
      >
        {children}
      </Modal>
    );
  },
);
