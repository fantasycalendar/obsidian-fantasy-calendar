/** Worker for eventual offloading of calendar calculation. */
import type { Event } from "src/@types/index";

const ctx: Worker = self as any;

interface EventMessage {
    type: "hash";
    events: Event[];
}

// Respond to message from parent thread
ctx.addEventListener("message", (event: MessageEvent<EventMessage>) => {
    if (event.data.type == "hash") {
        //build hash;
        
    }
});

export default {} as typeof Worker & (new () => Worker);
