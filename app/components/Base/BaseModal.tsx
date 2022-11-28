import React, { memo, PropsWithChildren } from 'react';
import Modal, { ModalProps } from 'react-native-modal';
import { StyleSheet } from 'react-native';

interface OwnProps extends Partial<ModalProps> {
  isVisible: boolean;
  onClose?: () => void;
}

type Props = OwnProps;

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

export const BaseModal = memo(
  ({ onClose, children, ...rest }: PropsWithChildren<Props>) => {
    return (
      <Modal
        style={styles.modal}
        onBackButtonPress={onClose}
        onBackdropPress={onClose}
        onSwipeComplete={onClose}
        backdropTransitionOutTiming={0}
        swipeDirection="down"
        swipeThreshold={50}
        backdropOpacity={0.4}
        {...rest}
      >
        {children}
      </Modal>
    );
  },
);
