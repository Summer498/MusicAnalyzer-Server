export interface ICurrentBeat {
    bpm: number;
    duration: number;
    index: number;
    next: ICurrentBeat;
    position: number;
    prev: ICurrentBeat;
    start: number;
}
export interface ISceneBeat {
    bpm: number;
    count: number;
    index: number;
    position: number;
    start: number;
}
