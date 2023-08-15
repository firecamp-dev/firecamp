import { useRef, useEffect } from 'react';

// usEffect but it will not trigger on first render but after first render;
export default function useDidUpdateEffect(fn: Function, inputs: any) {
  const didMountRef = useRef(false);

  useEffect(() => {
    if (didMountRef.current) fn();
    else didMountRef.current = true;
  }, inputs);
}
