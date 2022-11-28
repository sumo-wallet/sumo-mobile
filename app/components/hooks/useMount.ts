import { useEffect } from 'react';

const useMount = (handler: () => any) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(handler, []);
};

export default useMount;
