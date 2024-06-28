import {useEffect, useMemo, useRef} from "react";

export const debounce = (func, timeout = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}

export type CallbackFunction = (...args: never[]) => void;

export const useDebounce = (callback: CallbackFunction, timeout: number) => {
  const ref = useRef<undefined | CallbackFunction>();

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  const debouncedCallback = useMemo(() => {
    const func = () => {
      ref.current?.();
    };

    return debounce(func, timeout);
  }, [timeout]);

  return debouncedCallback;
};