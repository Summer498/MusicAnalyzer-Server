export class Directories {
  constructor(
    readonly src: string,
    readonly dst: string,
  ) { }
}
export class DataDirectories {
  readonly chord_ext: Directories;
  readonly chord_to_roman: Directories;

  readonly demucs: Directories;
  readonly separate: Directories;
  readonly separate_dir: string;

  readonly crepe: Directories;
  readonly crepe_tmp: string;

  readonly post_crepe: Directories;

  readonly pyin: Directories;
  readonly post_pyin_dir: string;
  readonly pyin_img: Directories;
  readonly post_pyin: Directories;

  readonly melody_analyze_crepe: Directories;
  readonly melody_analyze_pyin: Directories;

  constructor(song_name: string, file_path: string) {
    const resource = `resources/${song_name}`;
    const home = `${resource}/analyzed`;
    const chord = `${home}/chord`;
    const melody = `${home}/melody`;
    const demucs = `${resource}/demucs`;
    const crepe = `${melody}/crepe`;
    const pyin = `${melody}/pyin`;

    this.chord_ext = new Directories(file_path, `${chord}/chords.json`);
    this.chord_to_roman = new Directories(this.chord_ext.dst, `${chord}/roman.json`);

    this.separate_dir = `${demucs}`;
    this.demucs = new Directories(file_path, `separated/htdemucs/${song_name}`);
    this.separate = new Directories("", `${demucs}/vocals.wav`);

    this.crepe = new Directories(this.separate.dst, `${crepe}/vocals.f0.csv`);
    this.crepe_tmp = `${this.separate_dir}/vocals.f0.csv`;
    this.post_crepe = new Directories(this.crepe.dst, `${crepe}/vocals.json`);
    this.melody_analyze_crepe = new Directories(this.post_crepe.dst, `${crepe}/manalyze.json`);

    this.pyin = new Directories(this.separate.dst, `${pyin}/vocals.f0.json`);
    this.post_pyin_dir = pyin;
    this.post_pyin = new Directories(this.pyin.dst, `${pyin}/vocals.json`);
    this.melody_analyze_pyin = new Directories(this.post_pyin.dst, `${pyin}/manalyze.json`);
    this.pyin_img = new Directories(this.pyin.dst, `${pyin}/vocals.f0.png`);

  }
}
