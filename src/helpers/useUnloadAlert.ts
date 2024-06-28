import {CallbackFunction} from "./debounce.ts";
import {useEffect} from "react";

export const useUnloadAlert = (callback: CallbackFunction, isChanged: boolean) => {
  useEffect(() => {
    window.addEventListener('beforeunload', alertUser);
    window.addEventListener('unload', callback);
    return () => {
      window.removeEventListener('beforeunload', alertUser);
      window.removeEventListener('unload', callback);
    }
  });

  const alertUser = async (event: WindowEventMap["beforeunload"]) => {
    if (isChanged) {
      console.log("You are leaving");
      event.preventDefault();
      event.returnValue = '';
    }
  }
}