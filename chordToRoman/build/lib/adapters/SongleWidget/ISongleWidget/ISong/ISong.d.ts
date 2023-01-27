import { IArtist } from "./IArtits.js";
import { IScene } from "./IScene/IScene.js";
export interface ISong {
    artist: IArtist;
    code: string;
    createdAt: string;
    duration: number;
    id: number;
    permalink: string;
    recognizedAt: string;
    rmsAmplitude: number;
    scene: IScene;
    title: string;
    updatedAt: string;
    url: string;
}
