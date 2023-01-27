import { IBeat } from "./IBeat";
import { IChord } from "./IChord";
import { IChorus } from "./IChorus";
import { IMelody } from "./IMelody";
import { IPluginBase } from "./IPluginBase";
import { ISongleSync } from "./ISongleSync";
import { ISongleWidget } from "./ISongleWidget";
import { IVariation } from "./IVariation";

export interface IPlugin {
	Beat: IBeat,
	Chord: IChord,
	Chorus: IChorus,
	Melody: IMelody,
	SongleSync: ISongleSync,
	SongleWidget: ISongleWidget,
	SuperClass: IPluginBase,
	Variation: IVariation,
}
