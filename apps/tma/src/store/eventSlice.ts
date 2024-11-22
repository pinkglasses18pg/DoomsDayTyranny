// apps/tma/src/store/eventSlice.ts

import {EventType, EventSlice, SliceCreator} from "./types";
import rawEventConfig from "@/event_config.json";

export const createEventSlice: SliceCreator<keyof EventSlice> = (set, get) => ({
    events: (rawEventConfig as { event: EventType }[]).map((item) => item.event),
    getEventById: (eventId) => get().events.find((event ) => event.id === eventId),
    setEventConfig: (newEvents: EventType[]) => {
        set((state) => {
            state.events = newEvents;
        });
    }
});