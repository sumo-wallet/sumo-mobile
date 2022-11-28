import { useRoute } from '@react-navigation/native';

const useNavigatorParams = <T = any>() => {
  const route = useRoute();
  return route.params as T;
};

export default useNavigatorParams;
