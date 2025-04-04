import { not } from "../logic";

export const removeFromArray = <T>(array: T[], rmv: T[]) => array.filter(e => not(rmv.includes(e)));
