import { Triad } from "./src";
export { ArchetypeSymbol } from "./src";
export{ Dyad } from "./src";
export{ Monad } from "./src";
export{ Null_ad } from "./src";
export{ Triad } from "./src";

export {
  get_color_of_Narmour_concept,
  get_color_of_implication_realization,
  get_color_on_digital_parametric_scale,
  get_color_on_digital_intervallic_scale,
  get_color_on_registral_scale,
  get_color_on_intervallic_angle,
  get_color_on_parametric_scale
} from "./src";

const archetypes = [
  [new Triad("F3", "F3", "F3")],
  [
    "B4", "A4", "G4", "F4", "E4", "D4", "C4", "B3", "A3", "G3", "F3", "E3", "D3", "C3", "B2",
  ].map(e=> new Triad("F3", "B3", e)),
  [ 
    "F5", "E5", "D5", "C5", "B4", "A4", "G4", "F4", "E4", "D4", "C4", "B3", "A3", "G3", "F3",
  ].map(e=> new Triad("B3", "F4", e))
];

console.log("archetypes");
console.log(archetypes.map(e => e.map(e => e.symbol)));

console.log("melody motions");
console.log(archetypes.map(e => e.map(e => (
  {
    I: `${e.archetype.intervallic.direction.name}/${e.archetype.intervallic.magnitude.name}`,
    V: `${e.archetype.registral.direction.name}/${e.archetype.registral.magnitude.name}`
  }
))));
