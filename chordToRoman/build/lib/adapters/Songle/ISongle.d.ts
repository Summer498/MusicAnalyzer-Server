import { IMedia } from "./IMedia/IMedia.js";
import { Player } from "./IPlayer/IPlayer.js";
import { IPlugin } from "./IPlugin/IPlugin.js";
import { ISongleAPI } from "./IsongleAPI/ISongleAPI.js";
import { ISyncPlayer } from "./ISyncPlayer/ISyncPlayer.js";
import { ISystem } from "./ISystem/ISystem.js";
export declare type Event = any;
export declare type BeatEvent = any;
export declare type ChordEvent = any;
export declare type SectionEvent = any;
export declare abstract class ISongle {
    abstract Media: IMedia;
    Player: typeof Player;
    abstract Plugin: IPlugin;
    abstract SongleAPI: ISongleAPI;
    abstract SyncPlayer: ISyncPlayer;
    abstract System: ISystem;
}
