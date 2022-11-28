import { ImageSourcePropType } from 'react-native';

export interface TokenDataInterface {
  name: string;
  icon: ImageSourcePropType;
  amount: string;
  percent: string;
  userAmount: number;
  userDollar: number;
}
