export interface INote {
    duration: number;
    index: number;
    next: INote | undefined;
    prev: INote | undefined;
    start: number;
}
