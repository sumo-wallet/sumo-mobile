import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';

const useNavigator = () => {
  return useNavigation<NavigationProp<ParamListBase, string, undefined>>();
};

export default useNavigator;
