"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const parse_csv = (str) => {
    const separated = str.split(",");
    const ret = separated.map(e => parseFloat(e));
    return ret;
};
const main = (argv) => {
    const CWD = process.cwd();
    const melody_filename = argv[2];
    const chord_filename = argv[3];
    const out_filename = argv[4];
    const melody_txt = fs_1.default.readFileSync(melody_filename, "utf-8");
    const chord_txt = fs_1.default.readFileSync(chord_filename, "utf-8");
    const melody_sr = 100; // CREPE から得られるメロディは毎秒 100 サンプル
    const melody = parse_csv(melody_txt).map((e, i) => [i / melody_sr, (i + 1) / melody_sr, e]);
    const chord = JSON.parse(chord_txt);
    console.log(melody);
    console.log(chord);
    const text = "てすてす";
    try {
        fs_1.default.writeFileSync(out_filename, text);
    }
    catch (e) {
        console.error(e);
    }
};
main(process.argv);
//# sourceMappingURL=main.js.map