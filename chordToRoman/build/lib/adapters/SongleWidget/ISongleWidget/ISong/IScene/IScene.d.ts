import { IBar } from "./IBar";
import { ISceneBeat } from "./IBeat";
import { IChord } from "./IChord";
import { ISegment } from "./ISegment";
import { INote } from "./INote";
export interface IScene {
    bars: IBar[];
    beats: ISceneBeat[];
    chords: IChord[];
    chorusSegments: ISegment[];
    notes: INote[];
    repeatSegments: ISegment[];
}
