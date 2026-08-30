export interface ProgressRange {
    readonly min: number;
    readonly max: number;
}
export declare function resolveProgressRange(min: number | undefined, max: number | undefined): ProgressRange;
export declare function resolveProgressValue(value: number | undefined, range: ProgressRange): number;
export declare function resolveProgressPercent(value: number, range: ProgressRange): number;
