export interface IChord {
    duration: number;
    index: number;
    name: string;
    next: IChord | undefined;
    prev: IChord | undefined;
    start: number;
}
