interface IBeat {
    bpm: number;
    count: number;
    duration: number;
    index: number;
    next: IBeat;
    position: number;
    prev: IBeat;
    start: number;
}

// TODO: 以下は違うのか?
// 異なるクラスとして扱ったほうが良いのか
// 上のように同じクラスの、フィールド抜けとして扱ったほうが良いのか
export interface ICurrentBeat{
    bpm: number;
    duration: number;
    index: number;
    next: ICurrentBeat;
    position: number;
    prev: ICurrentBeat
    start: number;
}

export interface ISceneBeat{
    bpm: number,
    count: number,
    index: number, 
    position: number,
    start: number
}