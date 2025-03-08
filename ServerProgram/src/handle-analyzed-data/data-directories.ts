export class Directories<
  S extends string | undefined,
  T extends string | undefined,
  DD extends string | undefined,
  D extends string | undefined,
> {
  constructor(
    readonly src: S,
    readonly tmp: T,
    readonly dst_dir: DD,
    readonly dst: D,
  ) { }
}
export class DataDirectories {
  readonly chord;
  readonly roman;

  readonly demucs;

  readonly f0_crepe;
  readonly midi_crepe;
  readonly melody_crepe;

  readonly f0_pyin;
  readonly pyin_img;
  readonly midi_pyin;
  readonly melody_pyin;

  constructor(song_name: string, file_path: string) {
    const resource = `./resources/${song_name}`;
    const analyzed = `${resource}/analyzed`;
    const chord = `${analyzed}/chord`;
    const melody = `${analyzed}/melody`;
    const demucs = `${resource}/demucs`;
    const crepe = `${melody}/crepe`;
    const pyin = `${melody}/pyin`;

    this.chord = new Directories(file_path, undefined, chord, `${chord}/chords.json`);
    this.roman = new Directories(this.chord.dst, undefined, chord, `${chord}/roman.json`);

    this.demucs = new Directories(file_path, `separated/htdemucs/${song_name}`, demucs, `${demucs}/vocals.wav`);

    this.f0_crepe = new Directories(this.demucs.dst, `${crepe}/vocals.f0.csv`, crepe, `${crepe}/vocals.f0.csv`);
    this.midi_crepe = new Directories(this.f0_crepe.dst, undefined, crepe, `${crepe}/vocals.midi.json`);
    this.melody_crepe = new Directories(this.midi_crepe.dst, undefined, crepe, `${crepe}/manalyze.json`);

    this.f0_pyin = new Directories(this.demucs.dst, undefined, pyin, `${pyin}/vocals.f0.json`);
    this.midi_pyin = new Directories(this.f0_pyin.dst, undefined, pyin, `${pyin}/vocals.midi.json`);
    this.melody_pyin = new Directories(this.midi_pyin.dst, undefined, pyin, `${pyin}/manalyze.json`);
    this.pyin_img = new Directories(this.f0_pyin.dst, undefined, pyin, `${pyin}/vocals.f0.png`);

  }
}
