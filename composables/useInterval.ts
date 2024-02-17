const isNumber = (n: unknown): n is number => typeof n === "number";

export interface Interval {
  remove: () => void;
  start: (_ms?: number | undefined) => NodeJS.Timeout | undefined;
}

export function useInterval(
  callback: () => void,
  ms?: number | boolean | null
): Interval {
  let intervalID: NodeJS.Timeout | undefined = undefined;

  const remove = () => {
    if (!intervalID) return;
    clearInterval(intervalID);
    intervalID = undefined;
  };

  const start = (_ms?: number) => {
    remove();
    if (!_ms && !ms) return;

    const m = (_ms || ms) as number;
    return (intervalID = setInterval(callback, m));
  };

  if (isNumber(ms)) start();

  return { remove, start };
}
