import { Archetype } from "./src/MelodicArchetype";

export { _ArchetypeSymbol as ArchetypeSymbol } from "./src/MelodicArchetype";
export { Archetype } from "./src/MelodicArchetype";
export {
  get_color_of_Narmour_concept,
  get_color_on_digital_parametric_scale,
  get_color_on_digital_intervallic_scale,
  get_color_on_registral_scale,
  get_color_on_intervallic_angle,
  get_color_on_parametric_scale
} from "./src/colors.ts";

const archetypes = [
  [new Archetype("F3", "F3", "F3")],
  [
    "B4", "A4", "G4", "F4", "E4", "D4", "C4", "B3", "A3", "G3", "F3", "E3", "D3", "C3", "B2",
  ].map(e=> new Archetype("F3", "B3", e)),
  [ 
    "F5", "E5", "D5", "C5", "B4", "A4", "G4", "F4", "E4", "D4", "C4", "B3", "A3", "G3", "F3",
  ].map(e=> new Archetype("B3", "F4", e))
];

console.log("archetypes");
console.log(archetypes.map(e => e.map(e => e.symbol)));

console.log("melody motions");
console.log(archetypes.map(e => e.map(e => (
  {
    I: `${e.melody_motion.intervallic.direction.name}/${e.melody_motion.intervallic.magnitude.name}`,
    V: `${e.melody_motion.registral.direction.name}/${e.melody_motion.registral.magnitude.name}`
  }
))));
