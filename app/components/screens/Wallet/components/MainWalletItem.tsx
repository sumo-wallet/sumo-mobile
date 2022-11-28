import React, { memo } from 'react';
import { ImageSourcePropType } from 'react-native';

export interface MainWalletItemInterface {
  nameWallet: string;
  subTitle: string;
  avartar: ImageSourcePropType;
  onSelect?: () => void;
}

export const MainWalletItem = memo(
  ({ nameWallet, subTitle, avartar }: MainWalletItemInterface) => {
    return <></>;
  },
);

export default MainWalletItem;
