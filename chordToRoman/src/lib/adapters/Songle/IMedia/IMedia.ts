import { IHeadless } from "./IHeadless";
import { IHTMLMediaElement } from "./IHTMLMediaElement";
import { IMediaBase } from "./IMediaBase";
import { INNVideo } from "./INNVideo";
import { IYTVideo } from "./IYTVideo";

export interface IMedia {
	HtMLMediaElement: IHTMLMediaElement,
	Headless: IHeadless,
	NNVideo: INNVideo,
	SuperClass: IMediaBase,
	YTVideo: IYTVideo,
}
