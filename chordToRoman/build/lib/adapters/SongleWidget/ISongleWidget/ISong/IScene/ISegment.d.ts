import { IRepeat } from "./IRepeat";
export interface ISegment {
    duration: number;
    index: number;
    isChorus: boolean;
    repeats: IRepeat[];
}
