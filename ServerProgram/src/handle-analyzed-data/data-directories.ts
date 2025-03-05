import { dirname } from "path";

export class DataDirectories {
  // readonly resource:string
  readonly chord_ext_src: string;
  readonly chord_ext_dst: string;
  readonly chord_to_roman_src: string;
  readonly chord_to_roman_dst: string;

  readonly demucs_src: string;
  readonly demucs_dst: string;
  readonly separate_dst: string;
  readonly separate_dir: string;

  readonly crepe_src: string;
  readonly crepe_dst: string;
  readonly tmp_dst: string;

  readonly post_crepe_src: string;
  readonly post_crepe_dst: string;

  readonly pyin_src: string;
  readonly pyin_dst: string;
  readonly img_src: string;
  readonly img_dst: string;
  readonly post_pyin_src: string;
  readonly post_pyin_dst: string;

  readonly melody_analyze_crepe_src: string;
  readonly melody_analyze_pyin_src: string;
  readonly melody_analyze_chord_src: string;
  readonly melody_analyze_dst: string;


  constructor(song_name: string, file_path: string) {
    const resource = `resources/${song_name}`;
    //this.resource=resource
    this.chord_ext_dst = `./${resource}/analyzed/chord/chords.json`;
    this.chord_to_roman_dst = `./${resource}/analyzed/chord/roman.json`;
    this.demucs_dst = `./separated/htdemucs/${song_name}`;
    this.separate_dst = `./${resource}/demucs/vocals.wav`;
    this.separate_dir = dirname(this.separate_dst);
    this.crepe_dst = `./${resource}/analyzed/melody/crepe/vocals.f0.csv`;
    this.tmp_dst = `${dirname(this.separate_dst)}/vocals.f0.csv`;
    this.post_crepe_dst = `./${resource}/analyzed/melody/crepe/vocals.json`;
    this.melody_analyze_dst = `./${resource}/analyzed/melody/crepe/manalyze.json`;
    this.pyin_dst = `./${resource}/analyzed/melody/pyin/vocals.f0.json`;
    this.img_dst = `${dirname(this.pyin_dst)}/vocals.f0.png`;
    this.post_pyin_dst = `./${resource}/analyzed/melody/pyin/vocals.json`;
    this.melody_analyze_dst = `./${resource}/analyzed/melody/pyin/manalyze.json`;
    
    this.chord_ext_src = file_path;
    this.chord_to_roman_src = this.chord_ext_dst;
    this.demucs_src = file_path;
    this.pyin_src = this.separate_dst;
    this.img_src = this.pyin_dst;

    this.post_pyin_src = this.pyin_dst;
    this.melody_analyze_pyin_src = this.post_pyin_dst;
    
    this.crepe_src = this.separate_dst;
    this.post_crepe_src = this.crepe_dst;
    this.melody_analyze_crepe_src = this.post_crepe_dst;
    this.melody_analyze_chord_src = this.chord_to_roman_dst;
  }
}
