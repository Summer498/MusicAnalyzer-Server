import { Chord } from "../../common";
import { Head as _Head } from "../../common";
import { IHead } from "../interface/i-head";

export class Head
extends _Head<Chord>
implements IHead {
  readonly recipe: "weak" | "progression" | "strong"
  constructor(head:IHead){
    super(head);
    this.recipe = head.recipe;
  }
}