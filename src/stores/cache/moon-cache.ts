import { Moon } from "src/@types";
import { EntityCache } from "./entity-cache";

export class MoonCache extends EntityCache<Moon> {
    recalculate(): void {
        throw new Error("Method not implemented.");
    }
}
