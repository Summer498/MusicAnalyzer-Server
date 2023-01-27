import { IMedia } from "./IMedia/IMedia.js";
import { Player } from "./IPlayer/IPlayer.js";
import { IPlugin } from "./IPlugin/IPlugin.js";
import { ISongleAPI } from "./IsongleAPI/ISongleAPI.js";
import { ISyncPlayer } from "./ISyncPlayer/ISyncPlayer.js";
import { ISystem } from "./ISystem/ISystem.js";


export type Event = any;
export type BeatEvent = any;
export type ChordEvent = any;
export type SectionEvent = any;



export abstract class ISongle {
	abstract Media: IMedia
	Player = Player;
	abstract Plugin: IPlugin
	abstract SongleAPI: ISongleAPI
	abstract SyncPlayer: ISyncPlayer
	abstract System: ISystem
}
