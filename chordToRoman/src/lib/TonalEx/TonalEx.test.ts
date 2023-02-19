import { Math } from "../Math/Math.js";
import { getDistance } from "../TPS/TPS.js";
import { ChordProgression, RomanChord } from "./TonalEx.js";
import Chord_default from "@tonaljs/chord";
import Scale_default from "@tonaljs/scale";

//const progression = new ChordProgression(["FM7", "G7", "Em7", "Am7"]);
const progression = new ChordProgression(["CM7", "G7", "Am7", "Em7", "FM7", "CM7", "FM7", "G7", "AmM7"]);

console.log("J-POP progression");
console.log(
    Math.getRange(0, progression.lead_sheet_chords.length)
        .map(t => progression.getStatesOnTime(t)
            .map((e: any) => e.toString(16))
        )
);

console.log(getDistance(
    new RomanChord(Scale_default.get("C major"), Chord_default.get("Am7")),
    new RomanChord(Scale_default.get("C major"), Chord_default.get("G7"))
));

console.log(progression.getChordIdSequence());
console.log(progression.getMinimumPath());

