import { Temp } from "./temp";
import { IAt } from "../interface/i-at";

export class At {
  readonly temp: Temp
  constructor(
    at: IAt
  ) {
    this.temp = new Temp(at.temp)
  }
}
