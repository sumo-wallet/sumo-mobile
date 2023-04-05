import { useMemo } from 'react';
import { default as useToggle } from 'react-use/lib/useToggle';

/**
 * Return array of [value, setTrue, setFalse], you can call setTrue and setFalse without setup useCallback
 */
const useBoolean = (
  initialValue = false,
): [boolean, () => void, () => void] => {
  const [value, toggle] = useToggle(initialValue);

  const { setTrue, setFalse } = useMemo(
    () => ({
      setTrue: () => toggle(true),
      setFalse: () => toggle(false),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return [value, setTrue, setFalse];
};

export default useBoolean;
