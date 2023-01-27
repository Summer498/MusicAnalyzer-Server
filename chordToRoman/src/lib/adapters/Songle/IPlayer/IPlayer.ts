import { EventBase } from "../Events/EventBase.js";
import { PluginBase } from "../IPlugin/PluginBase.js";

export declare class Player {
    constructor(arg
        : { mediaElement: string }
    );
    addPlugin(plugin: PluginBase): void;
    useMedia(url: string): void;
    on(
        event_name: string,
        onEventInvoked: (e: EventBase) => void
    ): void;
}
