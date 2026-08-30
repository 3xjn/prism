export interface PresenceState {
    readonly shouldRender: boolean;
    readonly present: boolean;
}
export interface UsePresenceOptions {
    readonly exitDuration: number;
}
export declare function usePresence(present: boolean, options: UsePresenceOptions): PresenceState;
