import { useSyncExternalStore } from "react";

const QUERIES = {
  pc: "(min-width: 1024px)",
  tablet: "(min-width: 768px) and (max-width: 1023px)",
  sp: "(max-width: 767px)",
};

const subscribe = (query: string) => (onStoreChange: () => void) => {
  const mql = window.matchMedia(query);
  const handler = () => onStoreChange();

  if (mql.addEventListener) {
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }

  mql.addListener(handler);
  return () => mql.removeListener(handler);
};

const getSnapshot = (query: string) => () => window.matchMedia(query).matches;

const useMediaQuery = (query: string) =>
  useSyncExternalStore(subscribe(query), getSnapshot(query));

export const useBreakpoint = () => {
  const isPC = useMediaQuery(QUERIES.pc);
  const isTablet = useMediaQuery(QUERIES.tablet);
  const isSP = useMediaQuery(QUERIES.sp);

  return { isPC, isTablet, isSP };
};

export const useIsPC = () => useMediaQuery(QUERIES.pc);
export const useIsTablet = () => useMediaQuery(QUERIES.tablet);
export const useIsSP = () => useMediaQuery(QUERIES.sp);
