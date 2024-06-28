import {MutableRefObject, useEffect} from "react";
import {CallbackFunction} from "./debounce.ts";

export const useClickOutside = (ref:  MutableRefObject<HTMLElement | undefined>, callback: CallbackFunction): void => {
  const handleClick = (e) => {
    if (ref?.current && !ref.current.contains(e.target)) {
      callback();
    }
  };
  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  });
};