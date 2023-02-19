"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Math_js_1 = require("../Math/Math.js");
const TPS_js_1 = require("../TPS/TPS.js");
const TonalEx_js_1 = require("./TonalEx.js");
const chord_1 = __importDefault(require("@tonaljs/chord"));
const scale_1 = __importDefault(require("@tonaljs/scale"));
//const progression = new ChordProgression(["FM7", "G7", "Em7", "Am7"]);
const progression = new TonalEx_js_1.ChordProgression(["CM7", "G7", "Am7", "Em7", "FM7", "CM7", "FM7", "G7", "AmM7"]);
console.log("J-POP progression");
console.log(Math_js_1.Math.getRange(0, progression.lead_sheet_chords.length)
    .map(t => progression.getStatesOnTime(t)
    .map((e) => e.toString(16))));
console.log((0, TPS_js_1.getDistance)(new TonalEx_js_1.RomanChord(scale_1.default.get("C major"), chord_1.default.get("Am7")), new TonalEx_js_1.RomanChord(scale_1.default.get("C major"), chord_1.default.get("G7"))));
console.log(progression.getChordIdSequence());
console.log(progression.getMinimumPath());
//# sourceMappingURL=TonalEx.test.js.map