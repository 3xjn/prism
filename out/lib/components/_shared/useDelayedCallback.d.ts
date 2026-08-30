export interface DelayedCallbackHandle {
    /** Schedule callback after delaySeconds, replacing any pending schedule. Runs immediately when the delay is zero or negative. */
    readonly schedule: (delaySeconds: number, callback: () => void) => void;
    /** Cancel the pending schedule, if any. */
    readonly cancel: () => void;
}
/**
 * Shared delayed-invoke plumbing for hover-intent style interactions
 * (tooltip open delays and similar). The pending thread is cancelled on
 * re-schedule, on cancel, and on unmount.
 */
export declare function useDelayedCallback(): DelayedCallbackHandle;
