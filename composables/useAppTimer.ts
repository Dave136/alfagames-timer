const DEFAULT_DELAY = 1000;

function getDelayFromExpiryTimestamp(expiryTimestamp: number) {
  if (!Validate.expiryTimestamp(expiryTimestamp)) {
    return null;
  }

  const seconds = Time.getSecondsFromExpiry(expiryTimestamp);
  const extraMilliSeconds = Math.floor((seconds - Math.floor(seconds)) * 1000);
  return extraMilliSeconds > 0 ? extraMilliSeconds : DEFAULT_DELAY;
}
export interface UseAppTimer {
  seconds: Ref<number>;
  minutes: Ref<number>;
  hours: Ref<number>;
  days: Ref<number>;
  rawTime: Ref<number>;
  start(): void;
  pause(): void;
  resume(): void;
  restart(newExpiryTimestamp?: number, newAutoStart?: boolean): void;
  reset(): void;
  isRunning: Ref<boolean>;
  isExpired: Ref<boolean>;
  // getCount: () => number;
}

export const useAppTimer = (expiry = 60, autoStart = true): UseAppTimer => {
  let interval: Interval;

  const initialState = () => ({
    expiryTimestamp: expiry,
    seconds: Time.getSecondsFromExpiry(expiry),
    isRunning: autoStart,
    isExpired: false,
    didStart: autoStart,
    delay: getDelayFromExpiryTimestamp(expiry),
  });

  const state = reactive(initialState());

  function _handleExpire() {
    state.isExpired = true;
    state.isRunning = false;
    state.delay = null;
    if (interval) interval.remove();
  }

  function pause() {
    state.isRunning = false;
    if (interval) interval.remove();
  }

  function restart(newExpiryTimestamp: number = expiry, newAutoStart = true) {
    pause();
    state.delay = getDelayFromExpiryTimestamp(newExpiryTimestamp);
    state.didStart = newAutoStart;
    state.isExpired = false;
    state.expiryTimestamp = newExpiryTimestamp;
    state.seconds = Time.getSecondsFromExpiry(newExpiryTimestamp);
    if (state.didStart) start();
  }

  function resume() {
    const time = new Date();
    const newExpiryTimestamp = time.setMilliseconds(
      time.getMilliseconds() + state.seconds * 1000
    );
    restart(newExpiryTimestamp);
  }

  function start() {
    if (state.didStart) {
      state.seconds = Time.getSecondsFromExpiry(state.expiryTimestamp);
      state.isRunning = true;
      interval = useInterval(
        () => {
          if (state.delay !== DEFAULT_DELAY) {
            state.delay = DEFAULT_DELAY;
          }
          const secondsValue = Time.getSecondsFromExpiry(state.expiryTimestamp);
          state.seconds = secondsValue;
          if (secondsValue <= 0) {
            _handleExpire();
          }
        },
        state.isRunning ? state.delay : null
      );
    } else {
      resume();
    }
  }

  function reset() {
    if (interval) interval.remove();
    Object.assign(state, initialState());
  }

  restart(expiry, autoStart);
  return {
    ...Time.getTimeFromSeconds(toRef(state, 'seconds')),
    // count: Math.round(toRef(state, "seconds")),
    rawTime: toRef(state, 'seconds'),
    start,
    pause,
    resume,
    restart,
    reset,
    isRunning: toRef(state, 'isRunning'),
    isExpired: toRef(state, 'isExpired'),
    // getCount: () => state.seconds,
  };
};
