export interface IBeat {
    bpm: number;
    duration: number;
    index: number;
    next: IBeat;
    position: number;
    prev: IBeat;
    start: number;
}
export interface IBar {
    beats: IBeat[];
    index: number;
    next: IBar;
    prev: IBar;
    start: number;
}
