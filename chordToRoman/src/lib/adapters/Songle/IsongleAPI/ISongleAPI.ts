import { IBeatAPI } from "./IBeatAPI";
import { IChordAPI } from "./IChordAPI";
import { IChorusAPI } from "./IChorusAPI";
import { IMelodyAPI } from "./IMelodyAPI";
import { IVariationAPI } from "./IVariationAPI";

export interface ISongleAPI{
    BeatAPI: IBeatAPI,
    ChordAPI: IChordAPI,
    ChorusAPI: IChorusAPI,
    MelodyAPI: IMelodyAPI,
    SongAPI: ISongleAPI,
    VariationAPI: IVariationAPI,
}