import fs from "fs"

const parse_csv = (str: string) => {
    const separated = str.split(",")
    const ret = separated.map(e => parseFloat(e))
    return ret
}

const main = (argv: string[]) => {
    const CWD = process.cwd();
    const melody_filename = argv[2];
    const chord_filename = argv[3];
    const out_filename = argv[4];
    const melody_txt = fs.readFileSync(melody_filename, "utf-8");
    const chord_txt = fs.readFileSync(chord_filename, "utf-8");
    const melody_sr = 100;  // CREPE から得られるメロディは毎秒 100 サンプル
    const melody = parse_csv(melody_txt).map((e,i)=>[i/melody_sr,(i+1)/melody_sr,e]);
    const chord = JSON.parse(chord_txt);
    console.log(melody);
    console.log(chord);



    const text = "てすてす"
    try {
        fs.writeFileSync(out_filename, text);
    }
    catch (e) {
        console.error(e);
    }
}
main(process.argv)