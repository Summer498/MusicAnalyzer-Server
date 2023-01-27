export interface ISongleWidgetAPI {
    computeAverageVolume: (e: any) => any;
    computeOffsetFromRepeatSegmentBy: (e: any, t: any) => any;
    createSongleWidgetElement: (args: {
        api: string;
    } | {
        url: string;
    }) => HTMLElement;
    findNextRepeatSegmentRepeatBy: (e: any, t: any) => any;
    findPrevRepeatSegmentRepeatBy: (e: any, t: any) => any;
    findSongleWidgets: () => any;
    findSongleWidgetsByAPI: (e: any) => any;
    findSongleWidgetsByMode: (e: any) => any;
    findSongleWidgetsByURL: (e: any) => any;
    findSongleWidgetsByUUID: (e: any) => any;
    findSongleWidgetsByVideoID: (e: any) => any;
    mergeRepeatSegments: (e: any, t: any) => any;
    millisecondsToMinutes: (e: any) => any;
    millisecondsToSeconds: (e: any) => any;
    minutesToMilliseconds: (e: any) => any;
    secondsToMilliseconds: (e: any) => any;
    DEFAULT_SONGLE_WIDGET_SIZE_H: number;
    DEFAULT_SONGLE_WIDGET_SIZE_W: number;
    DEFAULT_VIDEO_PLAYER_SIZE_H: number;
    DEFAULT_VIDEO_PLAYER_SIZE_W: number;
    MAX_VOLUME: number;
    MIN_SONGLE_WIDGET_SIZE_H: number;
    MIN_SONGLE_WIDGET_SIZE_W: number;
    MIN_VIDEO_PLAYER_SIZE_H: number;
    MIN_VIDEO_PLAYER_SIZE_W: number;
    MIN_VOLUME: number;
    MP3_MODE: string;
    NN_VIDEO_MODE: string;
    SOURCE_MP3: string;
    SOURCE_NN_VIDEO: string;
    SOURCE_SONGLE_WIDGET: string;
    SOURCE_YT_VIDEO: string;
    YT_VIDEO_MODE: string;
    version: string;
}
