import { default as fs } from "fs";
import { default as csv } from "csv";
import { getRange, median } from "../Math";
import { WaveFile } from "wavefile";

const bandpass = (x: number, low: number, high: number) => low <= x && x < high ? x : NaN;
const freq2midi = (freq: number) => 12 * (Math.log2(freq) - Math.log2(440)) + 69;
const midi2freq = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12);

const roundOnMIDI = (freq: number) => midi2freq(Math.round(freq2midi(freq)));

class MedianFilter {
  buff;
  array;
  window_size;
  constructor(initializer: number[], window_size: number) {
    this.buff = initializer.slice(0, window_size);
    this.array = initializer;
    this.window_size = window_size;
  }
  median(i: number) {
    this.buff[i % this.window_size] = this.array[i];  // リングバッファに保存
    return median(this.buff);
  }
}

class Freq2Phase {
  s;
  s0;
  sampling_rate;
  constructor(s0: number, sampling_rate = 44100) {
    this.s = 0;
    this.s0 = s0 || 0;
    this.sampling_rate = sampling_rate;
  }
  calc(freq: number) {
    this.s += (freq || 0) / this.sampling_rate;
    return this.s + this.s0;
  }
}

type VocalsF0CSV = { time: number, frequency: number, confidence: number }
const main = (argv: string[]) => {
  const csv_file_path = argv[2];
  const dictionary_from_csv: VocalsF0CSV[] = [];
  const CSV_SAMPLING_RATE = 100;

  const csv_file_stream = fs.createReadStream(csv_file_path);
  console.log("起動！");
  csv_file_stream.pipe(csv.parse(
    { columns: true, cast: true, delimiter: ',' },
    (err, data: VocalsF0CSV) => {
      dictionary_from_csv.push(data);
    }
  ));
  console.log("CSV読み込み！");
  let __LINE__ = 0;

  // 瞬間周波数 [Hz/s]
  const frequency_row = dictionary_from_csv.map(e => e.frequency);
  const frequency_rounded = frequency_row.map(freq => roundOnMIDI(freq));
  console.log(__LINE__++); // 0

  // 中央値を用いたフィルタ (ヘンペルフィルタ) を用いてスパイクノイズを除去する
  const WINDOW_SIZE = 25;
  const median_filter = new MedianFilter(frequency_rounded, WINDOW_SIZE);
  const frequency_median_filtered = getRange(0, frequency_rounded.length).map(i => median_filter.median(i));
  console.log(__LINE__++); // 1

  const LOW = 220; // hz
  const HIGH = 880; // hz
  // バンドパスで低すぎる/高すぎる音を除く
  const frequency_001_band_passed = frequency_median_filtered.map(freq => bandpass(freq, LOW, HIGH));
  console.log(__LINE__++); // 2

  // 1/100[s] 刻みのデータをサンプリング周波数に合わせる
  const SAMPLING_RATE = 22050;
  const N = SAMPLING_RATE / CSV_SAMPLING_RATE;
  const size = frequency_001_band_passed.length * SAMPLING_RATE; // CSV_SAMPLING_RATE
  const frequency = getRange(0, size).map(i => 2 * Math.PI * frequency_001_band_passed[Math.floor(i / N)]);
  console.log(__LINE__++); // 3

  // output
  const out_filename = `${argv[3]}/vocals`;
  const out_midi_json = fs.createWriteStream(`${out_filename}.midi.json`);
  out_midi_json.write(JSON.stringify(frequency_001_band_passed.map(e => Math.round(freq2midi(e))), undefined, "  "));
  out_midi_json.on("error",(e)=>{
    console.log(e);
    console.log("エラーの表示");
  });
  console.log(__LINE__++); // 4

  const out_json = fs.createWriteStream(`${out_filename}.json`);
  console.log(__LINE__++); // 5
  out_json.write(JSON.stringify(frequency_001_band_passed));
  out_json.on("error", (e)=>{
    console.log(e);
    console.log("エラーの表示2");
  });
  console.log(__LINE__++); // 6

  // サイン波の音で確認するため, 瞬間周波数を積分して位相を求める
  const freq2phase = new Freq2Phase(frequency[0], SAMPLING_RATE);
  const phase = frequency.map(freq => freq2phase.calc(freq));
  const sinoid = phase.map(e=>Math.floor(Math.sin(e)*0.8*32767));
  const sinoid_wav = new WaveFile();
  sinoid_wav.fromScratch(1, SAMPLING_RATE, "16", sinoid);
  const out_f0_wav = fs.createWriteStream(`${out_filename}.f0.wav`);
  out_f0_wav.write(sinoid_wav.toBuffer());
  out_f0_wav.on("error", (e)=>{
    console.log(e);
    console.log("エラーの表示3");
  });

  console.log(__LINE__++);  // 7

  const mini_sinoid = sinoid.slice(17 * SAMPLING_RATE, 40 * SAMPLING_RATE);
  const mini_sinoid_wav = new WaveFile();
  mini_sinoid_wav.fromScratch(1, SAMPLING_RATE, "16", mini_sinoid);
  const out_mini_f0_wav = fs.createWriteStream(`${out_filename}mini.f0.wav`);
  out_mini_f0_wav.write(mini_sinoid_wav.toBuffer());
  out_mini_f0_wav.on("error", (e)=>{
    console.log(e);
    console.log("エラーの表示4");
  });
  console.log(__LINE__++);  // 8
};

main(process.argv);