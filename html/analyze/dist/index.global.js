"use strict";
(() => {
  // ../../packages/UI/view-parameters/dist/index.mjs
  var reservation_range = 1 / 15;
  var bracket_height = 2;
  var size = 2;
  var octave_height = size * 84;
  var black_key_height = octave_height / 12;
  var createNowAt = (initial = 0) => {
    let val = initial;
    return { get: () => val, set: (v) => {
      val = v;
    } };
  };
  var NowAt = createNowAt();
  var createPianoRollRatio = (initial = 1) => {
    let val = initial;
    return { get: () => val, set: (v) => {
      val = v;
    } };
  };
  var PianoRollRatio = createPianoRollRatio();
  var PianoRollTimeLength = {
    get: () => PianoRollRatio.get() * SongLength.get()
  };
  var NoteSize = {
    get: () => PianoRollWidth.get() / PianoRollTimeLength.get()
  };
  var transposed = (e) => e - PianoRollBegin.get();
  var scaled = (e) => e * NoteSize.get();
  var negated = (e) => -e;
  var convertToCoordinate = (e) => e * black_key_height;
  var replaceNNasInf = (e) => isNaN(e) ? -99 : e;
  var midi2BlackCoordinate = (arg) => [
    transposed,
    convertToCoordinate,
    negated
  ].reduce((c, f) => f(c), arg);
  var midi2NNBlackCoordinate = (arg) => [
    midi2BlackCoordinate,
    replaceNNasInf
  ].reduce((c, f) => f(c), arg);
  var PianoRollConverter = {
    midi2BlackCoordinate,
    midi2NNBlackCoordinate,
    transposed,
    scaled,
    convertToCoordinate
  };
  var createCurrentTimeRatio = (initial = 1 / 4) => {
    let val = initial;
    return { get: () => val, set: (v) => {
      val = v;
    } };
  };
  var CurrentTimeRatio = createCurrentTimeRatio();
  var CurrentTimeX = {
    get: () => PianoRollWidth.get() * CurrentTimeRatio.get()
  };
  var OctaveCount = {
    get: () => Math.ceil(-(PianoRollEnd.get() - PianoRollBegin.get()) / 12)
  };
  var pianoRollBeginValue = 83;
  var PianoRollBegin = {
    get: () => pianoRollBeginValue,
    set: (v) => {
      pianoRollBeginValue = v;
    }
  };
  var pianoRollEndValue = 83 + 24;
  var PianoRollEnd = {
    get: () => pianoRollEndValue,
    set: (v) => {
      pianoRollEndValue = v;
    }
  };
  var PianoRollHeight = {
    get: () => octave_height * OctaveCount.get()
  };
  var WindowInnerWidth = { get: () => window.innerWidth };
  var PianoRollWidth = {
    get: () => WindowInnerWidth.get() - 48
  };
  var createSongLength = (initial = 0) => {
    let val = initial;
    return { get: () => val, set: (v) => {
      val = v;
    } };
  };
  var SongLength = createSongLength();
  var setCurrentTimeRatio = (e) => {
    CurrentTimeRatio.set(e);
  };
  var setPianoRollParameters = (hierarchical_melody) => {
    const last = (arr) => arr[arr.length - 1];
    const melody = last(hierarchical_melody);
    const song_length = melody.reduce((p, c) => p.time.end > p.time.end ? p : c).time.end * 1.05;
    const highest_pitch = melody.reduce((p, c) => isNaN(p.note) ? c : isNaN(c.note) ? p : p.note > c.note ? p : c).note || 0;
    const lowest_pitch = melody.reduce((p, c) => isNaN(p.note) ? c : isNaN(c.note) ? p : p.note < c.note ? p : c).note || 0;
    SongLength.set(song_length);
    PianoRollEnd.set(lowest_pitch - 3);
    PianoRollBegin.set(
      [hierarchical_melody.length].map((e) => e * bracket_height).map((e) => e / 12).map((e) => Math.floor(e)).map((e) => e * 12).map((e) => e + highest_pitch).map((e) => e + 12)[0]
    );
  };

  // ../../packages/util/math/dist/index.mjs
  var argmax = (array) => array.map((e, i) => [e, i]).reduce((p, c) => c[0] >= p[0] ? c : p)[1];
  var totalSum = (array) => array.reduce((p, c) => p + c);
  var decimal = (x) => x - Math.floor(x);
  var mod = (x, m) => (x % m + m) % m;
  var createComplex = (re, im) => {
    const self = {
      re,
      im,
      add(right) {
        return createComplex(re + right.re, im + right.im);
      },
      sub(right) {
        return createComplex(re - right.re, im - right.im);
      },
      scale(right) {
        return createComplex(re * right, im * right);
      },
      divScaler(right) {
        return createComplex(re / right, im / right);
      },
      mlt(right) {
        return createComplex(
          re * right.re - im * right.im,
          re * right.im + im * right.re
        );
      },
      div(right) {
        const D = right.re + right.re + right.im + right.im;
        return createComplex(
          (re * right.re + im * right.im) / D,
          (re * right.im - im * right.re) / D
        );
      }
    };
    return self;
  };
  var fft_core = (seq, root_of_unity2) => {
    const N = seq.length;
    const res = [];
    if (N == 1) {
      return seq;
    }
    const X_evens = fft_core(seq.filter((_, i) => i % 2 === 0), root_of_unity2);
    const X_odds = fft_core(seq.filter((_, i) => i % 2 == 1), root_of_unity2);
    for (let k = 0; k < N / 2; k++) {
      const evens = X_evens[k];
      const rotated_odds = X_odds[k].mlt(root_of_unity2.exponent(k, N));
      res[k] = evens.add(rotated_odds);
      res[k + N / 2] = evens.sub(rotated_odds);
    }
    return res;
  };
  var createRootOfUnity = () => {
    const exponent_cache = [];
    const modulo_cache = [];
    return {
      exponent(k, N) {
        const x = -2 * Math.PI * (k / N);
        exponent_cache[N] ||= [];
        exponent_cache[N][k] ||= createComplex(Math.cos(x), Math.sin(x));
        return exponent_cache[N][k];
      },
      modulo(k, N, modulo) {
        const root = modulo - 1;
        modulo_cache[N] ||= [];
        modulo_cache[N][k] ||= Math.pow(root, k * N) % modulo;
        return modulo_cache[N][k];
      }
    };
  };
  var fft = (seq) => {
    const N = Math.pow(2, Math.ceil(Math.log2(seq.length)));
    while (seq.length < N) {
      seq.push(createComplex(0, 0));
    }
    return fft_core(seq, createRootOfUnity());
  };
  var ifft = (seq) => {
    const ps = fft(seq.map((e) => createComplex(e.im, e.re)));
    return ps.map((e) => createComplex(e.im, e.re).divScaler(ps.length));
  };
  var convolution = (seq1, seq2) => {
    const f_seq1 = fft(seq1);
    const f_seq2 = fft(seq2);
    const mul = f_seq1.map((e, i) => e.mlt(f_seq2[i]));
    return ifft(mul);
  };
  var correlation = (seq1, seq2) => convolution(seq1, seq2.reverse());
  var getZeros = (length) => [...Array(length)].map((e) => 0);
  var getRange = (begin, end, step = 1) => [...Array(Math.abs(end - begin))].map((_, i) => i * step + begin);

  // ../../packages/music-structure/beat/beat-estimation/dist/index.mjs
  var calcTempo = (melodies, romans) => {
    const phase = 0;
    const melody_bpm = [];
    const bpm_range = 90;
    const onsets = getZeros(Math.ceil(melodies[melodies.length - 1].time.end * 100));
    const melody_phase = getRange(0, 90).map((i) => getZeros(90 + i));
    const b = Math.log2(90);
    melodies.forEach((e, i) => {
      if (i + 1 >= melodies.length) {
        return;
      }
      const term = melodies[i + 1].time.begin - melodies[i].time.begin + (Math.random() - 0.5) / 100;
      if (60 / term > 300 * 4) {
        return;
      }
      const bpm2 = Math.round(Math.pow(2, decimal(Math.log2(60 / term) - b) + b));
      const bpm = Math.round(Math.pow(3, decimal(Math.log2(bpm2) / Math.log2(3) - b / Math.log2(3)) + b / Math.log2(3)));
      if (isNaN(melody_bpm[bpm])) {
        melody_bpm[bpm] = 0;
      }
      melody_bpm[bpm]++;
      getRange(0, bpm_range).forEach((bpm3) => {
        melody_phase[bpm3][Math.floor(mod(e.time.begin, bpm3 + 90))]++;
      });
      onsets[Math.floor(e.time.begin * 100)] = 1;
    });
    const entropy = melody_phase.map((e) => {
      const sum = totalSum(e);
      const prob = e.map((e2) => e2 / sum);
      return { phase, tempo: totalSum(prob.map((p) => p === 0 ? 0 : -p * Math.log2(p))) };
    });
    onsets.forEach((e, i) => e === 0 && i !== 0 && (onsets[i] = onsets[i - 1] * 0.9));
    const w = (tau) => {
      const tau_0 = 50;
      const sigma_tau = 2;
      const x = Math.log2(tau / tau_0) / sigma_tau;
      return Math.exp(-x * x / 2);
    };
    const complex_onset = onsets.map((e) => createComplex(e, 0));
    const tps = correlation(
      complex_onset,
      complex_onset
    ).map((e, tau) => w(tau) * e.re);
    const roman_bpm = [];
    romans.forEach((_, i) => {
      if (i + 1 >= romans.length) {
        return;
      }
      const term = romans[i + 1].time.begin - romans[i].time.begin;
      const bpm2 = Math.round(Math.pow(2, decimal(Math.log2(60 / term) - b) + b));
      const bpm = Math.round(Math.pow(3, decimal(Math.log2(bpm2) / Math.log2(3) - b / Math.log2(3)) + b / Math.log2(3)));
      if (isNaN(roman_bpm[bpm])) {
        roman_bpm[bpm] = 0;
      }
      roman_bpm[bpm]++;
    });
    return { phase, tempo: argmax(tps) };
  };

  // ../../packages/music-structure/analyzed-data-container/dist/index.mjs
  var createAnalyzedDataContainer = (roman, melody, hierarchical_melody) => {
    const d_melodies = melody.map((e) => e);
    const filtered = d_melodies.map((e) => e).filter((e, i) => i + 1 >= d_melodies.length || 60 / (d_melodies[i + 1].time.begin - d_melodies[i].time.begin) < 300 * 4);
    return {
      roman,
      melody: filtered,
      hierarchical_melody,
      beat_info: calcTempo(filtered, roman),
      d_melodies
    };
  };

  // ../../packages/util/math/src/fft/array/complex.ts
  var mltV2R = (...x) => x[0].map((e) => e * x[1]);
  var addV2VR = (...x) => x[0].map((e, i) => e + x[1][i]);
  var subV2VR = (...x) => x[0].map((e, i) => e - x[1][i]);
  var mltV2VR = (...x) => x[0].map((e, i) => e * x[1][i]);
  var sclV2R = (...x) => [mltV2R(x[0][0], x[1]), mltV2R(x[0][1], x[1])];
  var addV2VC = (...x) => [addV2VR(x[0][0], x[1][0]), addV2VR(x[0][1], x[1][1])];
  var subV2VC = (...x) => [subV2VR(x[0][0], x[1][0]), subV2VR(x[0][1], x[1][1])];
  var mltV2VC = (...x) => [
    subV2VR(mltV2VR(x[0][0], x[1][0]), mltV2VR(x[0][1], x[1][1])),
    addV2VR(mltV2VR(x[0][1], x[1][0]), mltV2VR(x[0][0], x[1][1]))
  ];

  // ../../packages/util/math/src/fft/array/root-of-unity.ts
  var createRootOfUnity2 = () => {
    const exponent_cache = [];
    const modulo_cache = [];
    return {
      exponent(k, N) {
        const x = -2 * Math.PI * (k / N);
        exponent_cache[N] ||= [];
        exponent_cache[N][k] ||= [Math.cos(x), Math.sin(x)];
        return exponent_cache[N][k];
      },
      exponentList(N) {
        return [
          new Float32Array(N).map((e, k) => Math.cos(-2 * Math.PI * (k / N))),
          new Float32Array(N).map((e, k) => Math.sin(-2 * Math.PI * (k / N)))
        ];
      },
      modulo(k, N, modulo) {
        const root = modulo - 1;
        modulo_cache[N] ||= [];
        modulo_cache[N][k] ||= Math.pow(root, k * N) % modulo;
        return modulo_cache[N][k];
      }
    };
  };

  // ../../packages/util/math/src/fft/array/ftt-core.ts
  var root_of_unity = createRootOfUnity2();
  var addAndSub = (x, y) => [
    addV2VC(x, y),
    subV2VC(x, y)
  ];
  var fft_core2 = (...seq) => {
    const N = seq[0].length;
    if (N <= 1) {
      return seq;
    }
    const E = fft_core2(...[
      seq[0].filter((_, i) => i % 2 === 0),
      seq[1].filter((_, i) => i % 2 === 0)
    ]);
    const O = fft_core2(...[
      seq[0].filter((_, i) => i % 2 === 1),
      seq[1].filter((_, i) => i % 2 === 1)
    ]);
    const R = mltV2VC(O, root_of_unity.exponentList(N));
    const add_sub = addAndSub(E, R);
    return [
      new Float32Array([...add_sub[0][0], ...add_sub[1][0]]),
      new Float32Array([...add_sub[0][1], ...add_sub[1][1]])
    ];
  };

  // ../../packages/util/math/src/fft/array/index.ts
  var fft2 = (...seq) => {
    const N = Math.sqrt(seq[0].length);
    return sclV2R(fft_core2(...seq), 1 / N);
  };

  // ../../packages/UI/spectrogram/dist/index.mjs
  var createWaveViewer = (analyser) => {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("stroke", "blue");
    path.setAttribute("fill", "none");
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.appendChild(path);
    svg.id = "sound-wave";
    svg.setAttribute("width", String(800));
    svg.setAttribute("height", String(450));
    const old_wave = Array.from({ length: analyser.analyser.fftSize }, () => createComplex(0, 0));
    const getDelay = (copy) => {
      const col = correlation(old_wave, copy);
      let delay = 0;
      for (let i = 0; i < col.length / 2; i++) {
        if (col[delay].re < col[i].re) delay = i;
      }
      for (let i = 0; i < copy.length; i++) {
        old_wave[i] = copy[(i + delay) % copy.length];
      }
      return delay;
    };
    const onAudioUpdate5 = () => {
      const wave = analyser.getByteTimeDomainData();
      const width = svg.clientWidth;
      const height = svg.clientHeight;
      let path_data = "";
      const copy = [];
      wave.forEach((e) => copy.push(createComplex(e, 0)));
      const delay = getDelay(copy);
      for (let i = 0; i < wave.length / 2; i++) {
        if (isNaN(wave[i + delay] * 0)) continue;
        const x = i * 2 / (wave.length - 1) * width;
        const y = wave[i + delay] / 255 * height;
        path_data += `L ${x},${y}`;
      }
      path.setAttribute("d", "M" + path_data.slice(1));
    };
    return { svg, onAudioUpdate: onAudioUpdate5 };
  };
  var createSpectrogramViewer = (analyser) => {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("stroke", "red");
    path.setAttribute("fill", "none");
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.appendChild(path);
    svg.id = "spectrum";
    svg.setAttribute("width", String(800));
    svg.setAttribute("height", String(450));
    const onAudioUpdate5 = () => {
      const freqData = analyser.getFloatFrequencyData();
      const fftSize = freqData.length / 2;
      const width = svg.clientWidth;
      const height = svg.clientHeight;
      let pathData = "";
      for (let i = 0; i < fftSize; i++) {
        if (isNaN(freqData[i] * 0)) continue;
        const x = i / (fftSize - 1) * width;
        const y = -(freqData[i] / 128) * height;
        pathData += `L ${x},${y}`;
      }
      const d = pathData.slice(1);
      if (d.length > 0) path.setAttribute("d", "M" + d);
    };
    return { svg, onAudioUpdate: onAudioUpdate5 };
  };
  var connect = (...node) => {
    const next = node.slice(1);
    next.forEach((e, i) => node[i].connect(e));
  };
  var getByteFrequencyData = (analyser) => {
    const buffer_length = analyser.fftSize;
    const buffer = new Uint8Array(buffer_length);
    analyser.getByteFrequencyData(buffer);
    return buffer;
  };
  var getByteTimeDomainData = (analyser) => {
    const buffer_length = analyser.fftSize;
    const buffer = new Uint8Array(buffer_length);
    analyser.getByteTimeDomainData(buffer);
    return buffer;
  };
  var getFloatFrequencyData = (analyser) => {
    const buffer_length = analyser.fftSize;
    const buffer = new Float32Array(buffer_length);
    analyser.getFloatFrequencyData(buffer);
    return buffer;
  };
  var getFloatTimeDomainData = (analyser) => {
    const buffer_length = analyser.fftSize;
    const buffer = new Float32Array(buffer_length);
    analyser.getFloatTimeDomainData(buffer);
    return buffer;
  };
  var blackManWindow = (x) => {
    const c = 0.16;
    const a = [(1 - c) / 2, 1 / 2, c / 2];
    const N = x.length;
    return x.map((e, i) => a[0] - a[1] * Math.cos(
      2 * Math.PI * i / N + a[2] * Math.cos(4 * Math.PI * i / N)
    ) * e);
  };
  var getFFT = (analyser) => {
    const buff = blackManWindow(getFloatTimeDomainData(analyser));
    const amplitude = [];
    for (let i = 0; i < buff.length; i++) {
      amplitude.push(buff[i]);
    }
    return fft2(buff, buff.map((e) => 0));
  };
  var resumeAudioCtx = (audioCtx2) => () => {
    audioCtx2.state === "suspended" && audioCtx2.resume();
  };
  var createAudioAnalyzer = (audioElement, contextFactory = () => new AudioContext()) => {
    const audioCtx2 = contextFactory();
    const source = audioCtx2.createMediaElementSource(audioElement);
    const analyser = audioCtx2.createAnalyser();
    audioElement.addEventListener("play", resumeAudioCtx(audioCtx2));
    analyser.fftSize = 1024;
    connect(source, analyser, audioCtx2.destination);
    return {
      analyser,
      getByteTimeDomainData: () => getByteTimeDomainData(analyser),
      getFloatTimeDomainData: () => getFloatTimeDomainData(analyser),
      getByteFrequencyData: () => getByteFrequencyData(analyser),
      getFloatFrequencyData: () => getFloatFrequencyData(analyser),
      getFFT: () => getFFT(analyser)
    };
  };
  var createFFTViewer = (analyser) => {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("stroke", "rgb(192,0,255)");
    path.setAttribute("fill", "none");
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.appendChild(path);
    svg.id = "fft";
    svg.setAttribute("width", String(800));
    svg.setAttribute("height", String(450));
    const onAudioUpdate5 = () => {
      const freqData = analyser.getFFT();
      const N = freqData[0].length / 2;
      const width = svg.clientWidth;
      const height = svg.clientHeight;
      const absV = (...c) => c[0].map((e, i) => Math.sqrt(e * e + c[1][i] * c[1][i]));
      path.setAttribute(
        "d",
        "M" + [...Array.from(absV(...freqData))].map((e, i) => {
          if (isNaN(e * 0)) return "";
          const x = i / (N - 1) * width;
          const y = (1 - Math.log2(1 + e)) * height;
          return `L ${x},${y}`;
        }).join().slice(1)
      );
    };
    return { svg, onAudioUpdate: onAudioUpdate5 };
  };
  var createAudioViewer = (audio_element, audio_registry) => {
    const analyser = createAudioAnalyzer(audio_element);
    const wave = createWaveViewer(analyser);
    const spectrogram = createSpectrogramViewer(analyser);
    const fft22 = createFFTViewer(analyser);
    const onAudioUpdate5 = () => {
      wave.onAudioUpdate();
      spectrogram.onAudioUpdate();
      fft22.onAudioUpdate();
    };
    audio_registry.addListeners(onAudioUpdate5);
    return { wave, spectrogram, fft: fft22, onAudioUpdate: onAudioUpdate5 };
  };

  // ../../packages/util/time-and/dist/index.mjs
  var getArgs = (...args) => {
    if (args.length === 1) {
      const [e] = args;
      return [e.begin, e.end];
    }
    return args;
  };
  var createTime = (...args) => {
    const [begin, end] = getArgs(...args);
    return {
      begin,
      end,
      get duration() {
        return this.end - this.begin;
      },
      map: (func) => createTime(func(begin), func(end)),
      has: (medium) => begin <= medium && medium < end
    };
  };

  // ../../packages/UI/view/dist/index.mjs
  var audioRegistryCount = 0;
  var createAudioReflectableRegistry = () => {
    if (audioRegistryCount >= 1) {
      throw new Error("this constructor should not be called twice (singleton)");
    }
    audioRegistryCount++;
    const listeners = [];
    return {
      addListeners: (...ls) => {
        listeners.push(...ls);
      },
      onUpdate: () => {
        listeners.forEach((e) => e());
      }
    };
  };
  var windowRegistryCount = 0;
  var createWindowReflectableRegistry = () => {
    if (windowRegistryCount >= 1) {
      throw new Error("this constructor should not be called twice (singleton)");
    }
    windowRegistryCount++;
    const listeners = [];
    return {
      addListeners: (...ls) => {
        listeners.push(...ls);
      },
      onUpdate: () => {
        listeners.forEach((e) => e());
      }
    };
  };
  var PianoRollTranslateX = {
    get() {
      return CurrentTimeX.get() - NowAt.get() * NoteSize.get();
    }
  };

  // ../../packages/UI/synth/dist/index.mjs
  function createGain(ctx, parentNode, gain) {
    const gainNode = ctx.createGain();
    gainNode.gain.value = gain;
    gainNode.connect(parentNode);
    return gainNode;
  }
  function createOscillator(ctx, parentNode, type, frequency, detune) {
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.value = frequency;
    osc.detune.value = detune;
    osc.connect(parentNode);
    return osc;
  }
  var audioCtx = new AudioContext();
  function play(hzs = [330, 440, 550], begin_sec, length_sec, amplitude = 1) {
    const ctx = audioCtx;
    const parent = audioCtx.destination;
    const peak = amplitude / hzs.length;
    const attack = 0.01;
    const decay = 0.4;
    const sustain = 0.7 * peak;
    const release = 0.05 * length_sec;
    const detune = 0;
    const detune_delta = 1;
    hzs.map((hz, i) => {
      const gain_node = createGain(ctx, parent, 0);
      const osc = createOscillator(
        ctx,
        gain_node,
        "square",
        hz,
        detune + detune_delta * i
      );
      const start = audioCtx.currentTime + begin_sec;
      const delay = Math.random() * 0.1;
      const audioParam = gain_node.gain;
      osc.start(start);
      audioParam.cancelScheduledValues(start);
      audioParam.linearRampToValueAtTime(0, 2e-3 + start + delay);
      audioParam.linearRampToValueAtTime(peak, start + delay + attack);
      audioParam.linearRampToValueAtTime(sustain, start + delay + attack + decay);
      audioParam.linearRampToValueAtTime(sustain, start + delay + length_sec);
      audioParam.exponentialRampToValueAtTime(
        1e-3,
        start + length_sec + release
      );
      osc.stop(start + length_sec + release);
    });
  }

  // ../../packages/UI/piano-roll/beat-view/dist/index.mjs
  var createBeatBarModel = (beat_info, i) => ({
    time: createTime(
      i * 60 / beat_info.tempo,
      (i + 1) * 60 / beat_info.tempo
    )
  });
  var updateX_BeatBarView = (svg) => (x1, x2) => {
    svg.setAttribute("x1", String(x1));
    svg.setAttribute("x2", String(x2));
  };
  var updateY_BeatBarView = (svg) => (y1, y2) => {
    svg.setAttribute("y1", String(y1));
    svg.setAttribute("y2", String(y2));
  };
  var createBeatBarView = (svg) => ({ svg });
  var updateX = (svg) => (model) => {
    updateX_BeatBarView(svg)(
      PianoRollConverter.scaled(model.time.begin),
      PianoRollConverter.scaled(model.time.begin)
    );
  };
  var updateY = (svg) => (y1, y2) => {
    updateY_BeatBarView(svg)(y1, y2);
  };
  var createBeatBar = (beat_info, i) => {
    const model = createBeatBarModel(beat_info, i);
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "line");
    svg.id = "bar";
    svg.style.stroke = "rgb(0, 0, 0)";
    svg.style.display = "none";
    const view = createBeatBarView(svg);
    let sound_reserved = false;
    const y1 = 0;
    const y2 = PianoRollHeight.get();
    updateX(svg)(model);
    updateY(svg)(y1, y2);
    const beepBeat = () => {
      const model_is_in_range = createTime(0, reservation_range).map((e) => e + NowAt.get()).has(model.time.begin);
      if (model_is_in_range) {
        if (sound_reserved === false) {
          play([220], model.time.begin - NowAt.get(), 0.125);
          sound_reserved = true;
          setTimeout(() => {
            sound_reserved = false;
          }, reservation_range * 1e3);
        }
      }
    };
    const onWindowResized5 = () => {
      updateX(svg)(model);
    };
    const onTimeRangeChanged4 = onWindowResized5;
    const onAudioUpdate5 = () => {
    };
    return { model, view, onWindowResized: onWindowResized5, onTimeRangeChanged: onTimeRangeChanged4, onAudioUpdate: onAudioUpdate5 };
  };
  var createBeatBarsSeries = (children) => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.id = "beat-bars";
    children.forEach((e) => svg.appendChild(e.view.svg));
    const onAudioUpdate5 = () => {
      svg.setAttribute("transform", `translate(${PianoRollTranslateX.get()})`);
    };
    return {
      children,
      svg,
      children_model: children.map((e) => e.model),
      show: children,
      onAudioUpdate: onAudioUpdate5
    };
  };
  var createBeatElements = (beat_info, melodies, controllers) => {
    const N = Math.ceil(
      beat_info.tempo * melodies[melodies.length - 1].time.end
    ) + beat_info.phase;
    const seed = [...Array(N)];
    const beat_bar = seed.map((_, i) => createBeatBar(beat_info, i));
    const beat_bars = createBeatBarsSeries(beat_bar);
    controllers.audio.addListeners(
      ...beat_bars.children.map((e) => e.onAudioUpdate)
    );
    controllers.window.addListeners(
      ...beat_bars.children.map((e) => e.onWindowResized)
    );
    controllers.time_range.addListeners(
      ...beat_bars.children.map((e) => e.onTimeRangeChanged)
    );
    return { children: [beat_bars], beat_bars: beat_bars.svg };
  };

  // ../../packages/util/stdlib/dist/index.mjs
  var createAssertion = (assertion) => ({
    onFailed: (errorExecution) => {
      if (!assertion) errorExecution();
    }
  });
  var getCapitalCase = (str) => str[0].toUpperCase().concat(str.slice(1));
  var getLowerCase = (str) => str.toLowerCase();

  // ../../node_modules/@tonaljs/pitch/dist/index.mjs
  function isNamedPitch(src) {
    return src !== null && typeof src === "object" && "name" in src && typeof src.name === "string" ? true : false;
  }
  function isPitch(pitch2) {
    return pitch2 !== null && typeof pitch2 === "object" && "step" in pitch2 && typeof pitch2.step === "number" && "alt" in pitch2 && typeof pitch2.alt === "number" && !isNaN(pitch2.step) && !isNaN(pitch2.alt) ? true : false;
  }
  var FIFTHS = [0, 2, 4, -1, 1, 3, 5];
  var STEPS_TO_OCTS = FIFTHS.map(
    (fifths) => Math.floor(fifths * 7 / 12)
  );
  function coordinates(pitch2) {
    const { step, alt, oct, dir = 1 } = pitch2;
    const f = FIFTHS[step] + 7 * alt;
    if (oct === void 0) {
      return [dir * f];
    }
    const o = oct - STEPS_TO_OCTS[step] - 4 * alt;
    return [dir * f, dir * o];
  }
  var FIFTHS_TO_STEPS = [3, 0, 4, 1, 5, 2, 6];
  function pitch(coord) {
    const [f, o, dir] = coord;
    const step = FIFTHS_TO_STEPS[unaltered(f)];
    const alt = Math.floor((f + 1) / 7);
    if (o === void 0) {
      return { step, alt, dir };
    }
    const oct = o + 4 * alt + STEPS_TO_OCTS[step];
    return { step, alt, oct, dir };
  }
  function unaltered(f) {
    const i = (f + 1) % 7;
    return i < 0 ? 7 + i : i;
  }

  // ../../node_modules/@tonaljs/pitch-interval/dist/index.mjs
  var fillStr = (s, n) => Array(Math.abs(n) + 1).join(s);
  var NoInterval = Object.freeze({
    empty: true,
    name: "",
    num: NaN,
    q: "",
    type: "",
    step: NaN,
    alt: NaN,
    dir: NaN,
    simple: NaN,
    semitones: NaN,
    chroma: NaN,
    coord: [],
    oct: NaN
  });
  var INTERVAL_TONAL_REGEX = "([-+]?\\d+)(d{1,4}|m|M|P|A{1,4})";
  var INTERVAL_SHORTHAND_REGEX = "(AA|A|P|M|m|d|dd)([-+]?\\d+)";
  var REGEX = new RegExp(
    "^" + INTERVAL_TONAL_REGEX + "|" + INTERVAL_SHORTHAND_REGEX + "$"
  );
  function tokenizeInterval(str) {
    const m = REGEX.exec(`${str}`);
    if (m === null) {
      return ["", ""];
    }
    return m[1] ? [m[1], m[2]] : [m[4], m[3]];
  }
  var cache = {};
  function interval(src) {
    return typeof src === "string" ? cache[src] || (cache[src] = parse(src)) : isPitch(src) ? interval(pitchName(src)) : isNamedPitch(src) ? interval(src.name) : NoInterval;
  }
  var SIZES = [0, 2, 4, 5, 7, 9, 11];
  var TYPES = "PMMPPMM";
  function parse(str) {
    const tokens = tokenizeInterval(str);
    if (tokens[0] === "") {
      return NoInterval;
    }
    const num = +tokens[0];
    const q = tokens[1];
    const step = (Math.abs(num) - 1) % 7;
    const t = TYPES[step];
    if (t === "M" && q === "P") {
      return NoInterval;
    }
    const type = t === "M" ? "majorable" : "perfectable";
    const name = "" + num + q;
    const dir = num < 0 ? -1 : 1;
    const simple = num === 8 || num === -8 ? num : dir * (step + 1);
    const alt = qToAlt(type, q);
    const oct = Math.floor((Math.abs(num) - 1) / 7);
    const semitones2 = dir * (SIZES[step] + alt + 12 * oct);
    const chroma3 = (dir * (SIZES[step] + alt) % 12 + 12) % 12;
    const coord = coordinates({ step, alt, oct, dir });
    return {
      empty: false,
      name,
      num,
      q,
      step,
      alt,
      dir,
      type,
      simple,
      semitones: semitones2,
      chroma: chroma3,
      coord,
      oct
    };
  }
  function coordToInterval(coord, forceDescending) {
    const [f, o = 0] = coord;
    const isDescending = f * 7 + o * 12 < 0;
    const ivl = forceDescending || isDescending ? [-f, -o, -1] : [f, o, 1];
    return interval(pitch(ivl));
  }
  function qToAlt(type, q) {
    return q === "M" && type === "majorable" || q === "P" && type === "perfectable" ? 0 : q === "m" && type === "majorable" ? -1 : /^A+$/.test(q) ? q.length : /^d+$/.test(q) ? -1 * (type === "perfectable" ? q.length : q.length + 1) : 0;
  }
  function pitchName(props) {
    const { step, alt, oct = 0, dir } = props;
    if (!dir) {
      return "";
    }
    const calcNum = step + 1 + 7 * oct;
    const num = calcNum === 0 ? step + 1 : calcNum;
    const d = dir < 0 ? "-" : "";
    const type = TYPES[step] === "M" ? "majorable" : "perfectable";
    const name = d + num + altToQ(type, alt);
    return name;
  }
  function altToQ(type, alt) {
    if (alt === 0) {
      return type === "majorable" ? "M" : "P";
    } else if (alt === -1 && type === "majorable") {
      return "m";
    } else if (alt > 0) {
      return fillStr("A", alt);
    } else {
      return fillStr("d", type === "perfectable" ? alt : alt + 1);
    }
  }

  // ../../node_modules/@tonaljs/pitch-note/dist/index.mjs
  var fillStr2 = (s, n) => Array(Math.abs(n) + 1).join(s);
  var NoNote = Object.freeze({
    empty: true,
    name: "",
    letter: "",
    acc: "",
    pc: "",
    step: NaN,
    alt: NaN,
    chroma: NaN,
    height: NaN,
    coord: [],
    midi: null,
    freq: null
  });
  var cache2 = /* @__PURE__ */ new Map();
  var stepToLetter = (step) => "CDEFGAB".charAt(step);
  var altToAcc = (alt) => alt < 0 ? fillStr2("b", -alt) : fillStr2("#", alt);
  var accToAlt = (acc) => acc[0] === "b" ? -acc.length : acc.length;
  function note(src) {
    const stringSrc = JSON.stringify(src);
    const cached = cache2.get(stringSrc);
    if (cached) {
      return cached;
    }
    const value = typeof src === "string" ? parse2(src) : isPitch(src) ? note(pitchName2(src)) : isNamedPitch(src) ? note(src.name) : NoNote;
    cache2.set(stringSrc, value);
    return value;
  }
  var REGEX2 = /^([a-gA-G]?)(#{1,}|b{1,}|x{1,}|)(-?\d*)\s*(.*)$/;
  function tokenizeNote(str) {
    const m = REGEX2.exec(str);
    return m ? [m[1].toUpperCase(), m[2].replace(/x/g, "##"), m[3], m[4]] : ["", "", "", ""];
  }
  function coordToNote(noteCoord) {
    return note(pitch(noteCoord));
  }
  var mod2 = (n, m) => (n % m + m) % m;
  var SEMI = [0, 2, 4, 5, 7, 9, 11];
  function parse2(noteName) {
    const tokens = tokenizeNote(noteName);
    if (tokens[0] === "" || tokens[3] !== "") {
      return NoNote;
    }
    const letter = tokens[0];
    const acc = tokens[1];
    const octStr = tokens[2];
    const step = (letter.charCodeAt(0) + 3) % 7;
    const alt = accToAlt(acc);
    const oct = octStr.length ? +octStr : void 0;
    const coord = coordinates({ step, alt, oct });
    const name = letter + acc + octStr;
    const pc = letter + acc;
    const chroma3 = (SEMI[step] + alt + 120) % 12;
    const height = oct === void 0 ? mod2(SEMI[step] + alt, 12) - 12 * 99 : SEMI[step] + alt + 12 * (oct + 1);
    const midi = height >= 0 && height <= 127 ? height : null;
    const freq = oct === void 0 ? null : Math.pow(2, (height - 69) / 12) * 440;
    return {
      empty: false,
      acc,
      alt,
      chroma: chroma3,
      coord,
      freq,
      height,
      letter,
      midi,
      name,
      oct,
      pc,
      step
    };
  }
  function pitchName2(props) {
    const { step, alt, oct } = props;
    const letter = stepToLetter(step);
    if (!letter) {
      return "";
    }
    const pc = letter + altToAcc(alt);
    return oct || oct === 0 ? pc + oct : pc;
  }

  // ../../node_modules/@tonaljs/pitch-distance/dist/index.mjs
  function transpose(noteName, intervalName) {
    const note4 = note(noteName);
    const intervalCoord = Array.isArray(intervalName) ? intervalName : interval(intervalName).coord;
    if (note4.empty || !intervalCoord || intervalCoord.length < 2) {
      return "";
    }
    const noteCoord = note4.coord;
    const tr = noteCoord.length === 1 ? [noteCoord[0] + intervalCoord[0]] : [noteCoord[0] + intervalCoord[0], noteCoord[1] + intervalCoord[1]];
    return coordToNote(tr).name;
  }
  function distance(fromNote, toNote) {
    const from = note(fromNote);
    const to = note(toNote);
    if (from.empty || to.empty) {
      return "";
    }
    const fcoord = from.coord;
    const tcoord = to.coord;
    const fifths = tcoord[0] - fcoord[0];
    const octs = fcoord.length === 2 && tcoord.length === 2 ? tcoord[1] - fcoord[1] : -Math.floor(fifths * 7 / 12);
    const forceDescending = to.height === from.height && to.midi !== null && from.midi !== null && from.step > to.step;
    return coordToInterval([fifths, octs], forceDescending).name;
  }

  // ../../node_modules/@tonaljs/core/dist/index.mjs
  function deprecate(original, alternative, fn) {
    return function(...args) {
      console.warn(`${original} is deprecated. Use ${alternative}.`);
      return fn.apply(this, args);
    };
  }
  var isNamed = deprecate("isNamed", "isNamedPitch", isNamedPitch);

  // ../../node_modules/@tonaljs/collection/dist/index.mjs
  function rotate(times, arr) {
    const len = arr.length;
    const n = (times % len + len) % len;
    return arr.slice(n, len).concat(arr.slice(0, n));
  }

  // ../../node_modules/@tonaljs/pcset/dist/index.mjs
  var EmptyPcset = {
    empty: true,
    name: "",
    setNum: 0,
    chroma: "000000000000",
    normalized: "000000000000",
    intervals: []
  };
  var setNumToChroma = (num2) => Number(num2).toString(2).padStart(12, "0");
  var chromaToNumber = (chroma22) => parseInt(chroma22, 2);
  var REGEX3 = /^[01]{12}$/;
  function isChroma(set) {
    return REGEX3.test(set);
  }
  var isPcsetNum = (set) => typeof set === "number" && set >= 0 && set <= 4095;
  var isPcset = (set) => set && isChroma(set.chroma);
  var cache3 = { [EmptyPcset.chroma]: EmptyPcset };
  function get(src) {
    const chroma22 = isChroma(src) ? src : isPcsetNum(src) ? setNumToChroma(src) : Array.isArray(src) ? listToChroma(src) : isPcset(src) ? src.chroma : EmptyPcset.chroma;
    return cache3[chroma22] = cache3[chroma22] || chromaToPcset(chroma22);
  }
  var pcset = deprecate("Pcset.pcset", "Pcset.get", get);
  var IVLS = [
    "1P",
    "2m",
    "2M",
    "3m",
    "3M",
    "4P",
    "5d",
    "5P",
    "6m",
    "6M",
    "7m",
    "7M"
  ];
  function chromaToIntervals(chroma22) {
    const intervals2 = [];
    for (let i = 0; i < 12; i++) {
      if (chroma22.charAt(i) === "1")
        intervals2.push(IVLS[i]);
    }
    return intervals2;
  }
  function chromaRotations(chroma22) {
    const binary = chroma22.split("");
    return binary.map((_, i) => rotate(i, binary).join(""));
  }
  function chromaToPcset(chroma22) {
    const setNum = chromaToNumber(chroma22);
    const normalizedNum = chromaRotations(chroma22).map(chromaToNumber).filter((n) => n >= 2048).sort()[0];
    const normalized = setNumToChroma(normalizedNum);
    const intervals2 = chromaToIntervals(chroma22);
    return {
      empty: false,
      name: "",
      setNum,
      chroma: chroma22,
      normalized,
      intervals: intervals2
    };
  }
  function listToChroma(set) {
    if (set.length === 0) {
      return EmptyPcset.chroma;
    }
    let pitch2;
    const binary = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < set.length; i++) {
      pitch2 = note(set[i]);
      if (pitch2.empty)
        pitch2 = interval(set[i]);
      if (!pitch2.empty)
        binary[pitch2.chroma] = 1;
    }
    return binary.join("");
  }

  // ../../node_modules/@tonaljs/chord-type/dist/index.mjs
  var CHORDS = [
    // ==Major==
    ["1P 3M 5P", "major", "M ^  maj"],
    ["1P 3M 5P 7M", "major seventh", "maj7 \u0394 ma7 M7 Maj7 ^7"],
    ["1P 3M 5P 7M 9M", "major ninth", "maj9 \u03949 ^9"],
    ["1P 3M 5P 7M 9M 13M", "major thirteenth", "maj13 Maj13 ^13"],
    ["1P 3M 5P 6M", "sixth", "6 add6 add13 M6"],
    ["1P 3M 5P 6M 9M", "sixth added ninth", "6add9 6/9 69 M69"],
    ["1P 3M 6m 7M", "major seventh flat sixth", "M7b6 ^7b6"],
    [
      "1P 3M 5P 7M 11A",
      "major seventh sharp eleventh",
      "maj#4 \u0394#4 \u0394#11 M7#11 ^7#11 maj7#11"
    ],
    // ==Minor==
    // '''Normal'''
    ["1P 3m 5P", "minor", "m min -"],
    ["1P 3m 5P 7m", "minor seventh", "m7 min7 mi7 -7"],
    [
      "1P 3m 5P 7M",
      "minor/major seventh",
      "m/ma7 m/maj7 mM7 mMaj7 m/M7 -\u03947 m\u0394 -^7 -maj7"
    ],
    ["1P 3m 5P 6M", "minor sixth", "m6 -6"],
    ["1P 3m 5P 7m 9M", "minor ninth", "m9 -9"],
    ["1P 3m 5P 7M 9M", "minor/major ninth", "mM9 mMaj9 -^9"],
    ["1P 3m 5P 7m 9M 11P", "minor eleventh", "m11 -11"],
    ["1P 3m 5P 7m 9M 13M", "minor thirteenth", "m13 -13"],
    // '''Diminished'''
    ["1P 3m 5d", "diminished", "dim \xB0 o"],
    ["1P 3m 5d 7d", "diminished seventh", "dim7 \xB07 o7"],
    ["1P 3m 5d 7m", "half-diminished", "m7b5 \xF8 -7b5 h7 h"],
    // ==Dominant/Seventh==
    // '''Normal'''
    ["1P 3M 5P 7m", "dominant seventh", "7 dom"],
    ["1P 3M 5P 7m 9M", "dominant ninth", "9"],
    ["1P 3M 5P 7m 9M 13M", "dominant thirteenth", "13"],
    ["1P 3M 5P 7m 11A", "lydian dominant seventh", "7#11 7#4"],
    // '''Altered'''
    ["1P 3M 5P 7m 9m", "dominant flat ninth", "7b9"],
    ["1P 3M 5P 7m 9A", "dominant sharp ninth", "7#9"],
    ["1P 3M 7m 9m", "altered", "alt7"],
    // '''Suspended'''
    ["1P 4P 5P", "suspended fourth", "sus4 sus"],
    ["1P 2M 5P", "suspended second", "sus2"],
    ["1P 4P 5P 7m", "suspended fourth seventh", "7sus4 7sus"],
    ["1P 5P 7m 9M 11P", "eleventh", "11"],
    [
      "1P 4P 5P 7m 9m",
      "suspended fourth flat ninth",
      "b9sus phryg 7b9sus 7b9sus4"
    ],
    // ==Other==
    ["1P 5P", "fifth", "5"],
    ["1P 3M 5A", "augmented", "aug + +5 ^#5"],
    ["1P 3m 5A", "minor augmented", "m#5 -#5 m+"],
    ["1P 3M 5A 7M", "augmented seventh", "maj7#5 maj7+5 +maj7 ^7#5"],
    [
      "1P 3M 5P 7M 9M 11A",
      "major sharp eleventh (lydian)",
      "maj9#11 \u03949#11 ^9#11"
    ],
    // ==Legacy==
    ["1P 2M 4P 5P", "", "sus24 sus4add9"],
    ["1P 3M 5A 7M 9M", "", "maj9#5 Maj9#5"],
    ["1P 3M 5A 7m", "", "7#5 +7 7+ 7aug aug7"],
    ["1P 3M 5A 7m 9A", "", "7#5#9 7#9#5 7alt"],
    ["1P 3M 5A 7m 9M", "", "9#5 9+"],
    ["1P 3M 5A 7m 9M 11A", "", "9#5#11"],
    ["1P 3M 5A 7m 9m", "", "7#5b9 7b9#5"],
    ["1P 3M 5A 7m 9m 11A", "", "7#5b9#11"],
    ["1P 3M 5A 9A", "", "+add#9"],
    ["1P 3M 5A 9M", "", "M#5add9 +add9"],
    ["1P 3M 5P 6M 11A", "", "M6#11 M6b5 6#11 6b5"],
    ["1P 3M 5P 6M 7M 9M", "", "M7add13"],
    ["1P 3M 5P 6M 9M 11A", "", "69#11"],
    ["1P 3m 5P 6M 9M", "", "m69 -69"],
    ["1P 3M 5P 6m 7m", "", "7b6"],
    ["1P 3M 5P 7M 9A 11A", "", "maj7#9#11"],
    ["1P 3M 5P 7M 9M 11A 13M", "", "M13#11 maj13#11 M13+4 M13#4"],
    ["1P 3M 5P 7M 9m", "", "M7b9"],
    ["1P 3M 5P 7m 11A 13m", "", "7#11b13 7b5b13"],
    ["1P 3M 5P 7m 13M", "", "7add6 67 7add13"],
    ["1P 3M 5P 7m 9A 11A", "", "7#9#11 7b5#9 7#9b5"],
    ["1P 3M 5P 7m 9A 11A 13M", "", "13#9#11"],
    ["1P 3M 5P 7m 9A 11A 13m", "", "7#9#11b13"],
    ["1P 3M 5P 7m 9A 13M", "", "13#9"],
    ["1P 3M 5P 7m 9A 13m", "", "7#9b13"],
    ["1P 3M 5P 7m 9M 11A", "", "9#11 9+4 9#4"],
    ["1P 3M 5P 7m 9M 11A 13M", "", "13#11 13+4 13#4"],
    ["1P 3M 5P 7m 9M 11A 13m", "", "9#11b13 9b5b13"],
    ["1P 3M 5P 7m 9m 11A", "", "7b9#11 7b5b9 7b9b5"],
    ["1P 3M 5P 7m 9m 11A 13M", "", "13b9#11"],
    ["1P 3M 5P 7m 9m 11A 13m", "", "7b9b13#11 7b9#11b13 7b5b9b13"],
    ["1P 3M 5P 7m 9m 13M", "", "13b9"],
    ["1P 3M 5P 7m 9m 13m", "", "7b9b13"],
    ["1P 3M 5P 7m 9m 9A", "", "7b9#9"],
    ["1P 3M 5P 9M", "", "Madd9 2 add9 add2"],
    ["1P 3M 5P 9m", "", "Maddb9"],
    ["1P 3M 5d", "", "Mb5"],
    ["1P 3M 5d 6M 7m 9M", "", "13b5"],
    ["1P 3M 5d 7M", "", "M7b5"],
    ["1P 3M 5d 7M 9M", "", "M9b5"],
    ["1P 3M 5d 7m", "", "7b5"],
    ["1P 3M 5d 7m 9M", "", "9b5"],
    ["1P 3M 7m", "", "7no5"],
    ["1P 3M 7m 13m", "", "7b13"],
    ["1P 3M 7m 9M", "", "9no5"],
    ["1P 3M 7m 9M 13M", "", "13no5"],
    ["1P 3M 7m 9M 13m", "", "9b13"],
    ["1P 3m 4P 5P", "", "madd4"],
    ["1P 3m 5P 6m 7M", "", "mMaj7b6"],
    ["1P 3m 5P 6m 7M 9M", "", "mMaj9b6"],
    ["1P 3m 5P 7m 11P", "", "m7add11 m7add4"],
    ["1P 3m 5P 9M", "", "madd9"],
    ["1P 3m 5d 6M 7M", "", "o7M7"],
    ["1P 3m 5d 7M", "", "oM7"],
    ["1P 3m 6m 7M", "", "mb6M7"],
    ["1P 3m 6m 7m", "", "m7#5"],
    ["1P 3m 6m 7m 9M", "", "m9#5"],
    ["1P 3m 5A 7m 9M 11P", "", "m11A"],
    ["1P 3m 6m 9m", "", "mb6b9"],
    ["1P 2M 3m 5d 7m", "", "m9b5"],
    ["1P 4P 5A 7M", "", "M7#5sus4"],
    ["1P 4P 5A 7M 9M", "", "M9#5sus4"],
    ["1P 4P 5A 7m", "", "7#5sus4"],
    ["1P 4P 5P 7M", "", "M7sus4"],
    ["1P 4P 5P 7M 9M", "", "M9sus4"],
    ["1P 4P 5P 7m 9M", "", "9sus4 9sus"],
    ["1P 4P 5P 7m 9M 13M", "", "13sus4 13sus"],
    ["1P 4P 5P 7m 9m 13m", "", "7sus4b9b13 7b9b13sus4"],
    ["1P 4P 7m 10m", "", "4 quartal"],
    ["1P 5P 7m 9m 11P", "", "11b9"]
  ];
  var data_default = CHORDS;
  var NoChordType = {
    ...EmptyPcset,
    name: "",
    quality: "Unknown",
    intervals: [],
    aliases: []
  };
  var dictionary = [];
  var index = {};
  function get2(type) {
    return index[type] || NoChordType;
  }
  var chordType = deprecate("ChordType.chordType", "ChordType.get", get2);
  function all() {
    return dictionary.slice();
  }
  var entries = deprecate("ChordType.entries", "ChordType.all", all);
  function add(intervals, aliases, fullName) {
    const quality = getQuality(intervals);
    const chord = {
      ...get(intervals),
      name: fullName || "",
      quality,
      intervals,
      aliases
    };
    dictionary.push(chord);
    if (chord.name) {
      index[chord.name] = chord;
    }
    index[chord.setNum] = chord;
    index[chord.chroma] = chord;
    chord.aliases.forEach((alias) => addAlias(chord, alias));
  }
  function addAlias(chord, alias) {
    index[alias] = chord;
  }
  function getQuality(intervals) {
    const has = (interval4) => intervals.indexOf(interval4) !== -1;
    return has("5A") ? "Augmented" : has("3M") ? "Major" : has("5d") ? "Diminished" : has("3m") ? "Minor" : "Unknown";
  }
  data_default.forEach(
    ([ivls, fullName, names2]) => add(ivls.split(" "), names2.split(" "), fullName)
  );
  dictionary.sort((a, b) => a.setNum - b.setNum);

  // ../../node_modules/@tonaljs/chord-detect/dist/index.mjs
  var BITMASK = {
    // 3m 000100000000
    // 3M 000010000000
    anyThirds: 384,
    // 5P 000000010000
    perfectFifth: 16,
    // 5d 000000100000
    // 5A 000000001000
    nonPerfectFifths: 40,
    anySeventh: 3
  };
  var testChromaNumber = (bitmask) => (chromaNumber) => Boolean(chromaNumber & bitmask);
  var hasAnyThird = testChromaNumber(BITMASK.anyThirds);
  var hasPerfectFifth = testChromaNumber(BITMASK.perfectFifth);
  var hasAnySeventh = testChromaNumber(BITMASK.anySeventh);
  var hasNonPerfectFifth = testChromaNumber(BITMASK.nonPerfectFifths);

  // ../../node_modules/@tonaljs/chord/node_modules/@tonaljs/pitch-interval/dist/index.mjs
  var fillStr3 = (s, n) => Array(Math.abs(n) + 1).join(s);
  var NoInterval2 = Object.freeze({
    empty: true,
    name: "",
    num: NaN,
    q: "",
    type: "",
    step: NaN,
    alt: NaN,
    dir: NaN,
    simple: NaN,
    semitones: NaN,
    chroma: NaN,
    coord: [],
    oct: NaN
  });
  var INTERVAL_TONAL_REGEX2 = "([-+]?\\d+)(d{1,4}|m|M|P|A{1,4})";
  var INTERVAL_SHORTHAND_REGEX2 = "(AA|A|P|M|m|d|dd)([-+]?\\d+)";
  var REGEX4 = new RegExp(
    "^" + INTERVAL_TONAL_REGEX2 + "|" + INTERVAL_SHORTHAND_REGEX2 + "$"
  );
  function tokenizeInterval2(str) {
    const m = REGEX4.exec(`${str}`);
    if (m === null) {
      return ["", ""];
    }
    return m[1] ? [m[1], m[2]] : [m[4], m[3]];
  }
  var cache4 = {};
  function interval2(src) {
    return typeof src === "string" ? cache4[src] || (cache4[src] = parse3(src)) : isPitch(src) ? interval2(pitchName3(src)) : isNamedPitch(src) ? interval2(src.name) : NoInterval2;
  }
  var SIZES2 = [0, 2, 4, 5, 7, 9, 11];
  var TYPES2 = "PMMPPMM";
  function parse3(str) {
    const tokens = tokenizeInterval2(str);
    if (tokens[0] === "") {
      return NoInterval2;
    }
    const num = +tokens[0];
    const q = tokens[1];
    const step = (Math.abs(num) - 1) % 7;
    const t = TYPES2[step];
    if (t === "M" && q === "P") {
      return NoInterval2;
    }
    const type = t === "M" ? "majorable" : "perfectable";
    const name = "" + num + q;
    const dir = num < 0 ? -1 : 1;
    const simple = num === 8 || num === -8 ? num : dir * (step + 1);
    const alt = qToAlt2(type, q);
    const oct = Math.floor((Math.abs(num) - 1) / 7);
    const semitones2 = dir * (SIZES2[step] + alt + 12 * oct);
    const chroma3 = (dir * (SIZES2[step] + alt) % 12 + 12) % 12;
    const coord = coordinates({ step, alt, oct, dir });
    return {
      empty: false,
      name,
      num,
      q,
      step,
      alt,
      dir,
      type,
      simple,
      semitones: semitones2,
      chroma: chroma3,
      coord,
      oct
    };
  }
  function coordToInterval2(coord, forceDescending) {
    const [f, o = 0] = coord;
    const isDescending = f * 7 + o * 12 < 0;
    const ivl = forceDescending || isDescending ? [-f, -o, -1] : [f, o, 1];
    return interval2(pitch(ivl));
  }
  function qToAlt2(type, q) {
    return q === "M" && type === "majorable" || q === "P" && type === "perfectable" ? 0 : q === "m" && type === "majorable" ? -1 : /^A+$/.test(q) ? q.length : /^d+$/.test(q) ? -1 * (type === "perfectable" ? q.length : q.length + 1) : 0;
  }
  function pitchName3(props) {
    const { step, alt, oct = 0, dir } = props;
    if (!dir) {
      return "";
    }
    const calcNum = step + 1 + 7 * oct;
    const num = calcNum === 0 ? step + 1 : calcNum;
    const d = dir < 0 ? "-" : "";
    const type = TYPES2[step] === "M" ? "majorable" : "perfectable";
    const name = d + num + altToQ2(type, alt);
    return name;
  }
  function altToQ2(type, alt) {
    if (alt === 0) {
      return type === "majorable" ? "M" : "P";
    } else if (alt === -1 && type === "majorable") {
      return "m";
    } else if (alt > 0) {
      return fillStr3("A", alt);
    } else {
      return fillStr3("d", type === "perfectable" ? alt : alt + 1);
    }
  }

  // ../../node_modules/@tonaljs/chord/node_modules/@tonaljs/interval/node_modules/@tonaljs/pitch-note/dist/index.mjs
  var NoNote2 = Object.freeze({
    empty: true,
    name: "",
    letter: "",
    acc: "",
    pc: "",
    step: NaN,
    alt: NaN,
    chroma: NaN,
    height: NaN,
    coord: [],
    midi: null,
    freq: null
  });

  // ../../node_modules/@tonaljs/chord/node_modules/@tonaljs/interval/dist/index.mjs
  var IQ = "P m M m M P d P m M m M".split(" ");
  var add2 = combinator((a, b) => [a[0] + b[0], a[1] + b[1]]);
  var subtract = combinator((a, b) => [a[0] - b[0], a[1] - b[1]]);
  function combinator(fn) {
    return (a, b) => {
      const coordA = interval2(a).coord;
      const coordB = interval2(b).coord;
      if (coordA && coordB) {
        const coord = fn(coordA, coordB);
        return coordToInterval2(coord).name;
      }
    };
  }

  // ../../node_modules/@tonaljs/scale-type/dist/index.mjs
  var SCALES = [
    // Basic scales
    ["1P 2M 3M 5P 6M", "major pentatonic", "pentatonic"],
    ["1P 2M 3M 4P 5P 6M 7M", "major", "ionian"],
    ["1P 2M 3m 4P 5P 6m 7m", "minor", "aeolian"],
    // Jazz common scales
    ["1P 2M 3m 3M 5P 6M", "major blues"],
    ["1P 3m 4P 5d 5P 7m", "minor blues", "blues"],
    ["1P 2M 3m 4P 5P 6M 7M", "melodic minor"],
    ["1P 2M 3m 4P 5P 6m 7M", "harmonic minor"],
    ["1P 2M 3M 4P 5P 6M 7m 7M", "bebop"],
    ["1P 2M 3m 4P 5d 6m 6M 7M", "diminished", "whole-half diminished"],
    // Modes
    ["1P 2M 3m 4P 5P 6M 7m", "dorian"],
    ["1P 2M 3M 4A 5P 6M 7M", "lydian"],
    ["1P 2M 3M 4P 5P 6M 7m", "mixolydian", "dominant"],
    ["1P 2m 3m 4P 5P 6m 7m", "phrygian"],
    ["1P 2m 3m 4P 5d 6m 7m", "locrian"],
    // 5-note scales
    ["1P 3M 4P 5P 7M", "ionian pentatonic"],
    ["1P 3M 4P 5P 7m", "mixolydian pentatonic", "indian"],
    ["1P 2M 4P 5P 6M", "ritusen"],
    ["1P 2M 4P 5P 7m", "egyptian"],
    ["1P 3M 4P 5d 7m", "neopolitan major pentatonic"],
    ["1P 3m 4P 5P 6m", "vietnamese 1"],
    ["1P 2m 3m 5P 6m", "pelog"],
    ["1P 2m 4P 5P 6m", "kumoijoshi"],
    ["1P 2M 3m 5P 6m", "hirajoshi"],
    ["1P 2m 4P 5d 7m", "iwato"],
    ["1P 2m 4P 5P 7m", "in-sen"],
    ["1P 3M 4A 5P 7M", "lydian pentatonic", "chinese"],
    ["1P 3m 4P 6m 7m", "malkos raga"],
    ["1P 3m 4P 5d 7m", "locrian pentatonic", "minor seven flat five pentatonic"],
    ["1P 3m 4P 5P 7m", "minor pentatonic", "vietnamese 2"],
    ["1P 3m 4P 5P 6M", "minor six pentatonic"],
    ["1P 2M 3m 5P 6M", "flat three pentatonic", "kumoi"],
    ["1P 2M 3M 5P 6m", "flat six pentatonic"],
    ["1P 2m 3M 5P 6M", "scriabin"],
    ["1P 3M 5d 6m 7m", "whole tone pentatonic"],
    ["1P 3M 4A 5A 7M", "lydian #5P pentatonic"],
    ["1P 3M 4A 5P 7m", "lydian dominant pentatonic"],
    ["1P 3m 4P 5P 7M", "minor #7M pentatonic"],
    ["1P 3m 4d 5d 7m", "super locrian pentatonic"],
    // 6-note scales
    ["1P 2M 3m 4P 5P 7M", "minor hexatonic"],
    ["1P 2A 3M 5P 5A 7M", "augmented"],
    ["1P 2M 4P 5P 6M 7m", "piongio"],
    ["1P 2m 3M 4A 6M 7m", "prometheus neopolitan"],
    ["1P 2M 3M 4A 6M 7m", "prometheus"],
    ["1P 2m 3M 5d 6m 7m", "mystery #1"],
    ["1P 2m 3M 4P 5A 6M", "six tone symmetric"],
    ["1P 2M 3M 4A 5A 6A", "whole tone", "messiaen's mode #1"],
    ["1P 2m 4P 4A 5P 7M", "messiaen's mode #5"],
    // 7-note scales
    ["1P 2M 3M 4P 5d 6m 7m", "locrian major", "arabian"],
    ["1P 2m 3M 4A 5P 6m 7M", "double harmonic lydian"],
    [
      "1P 2m 2A 3M 4A 6m 7m",
      "altered",
      "super locrian",
      "diminished whole tone",
      "pomeroy"
    ],
    ["1P 2M 3m 4P 5d 6m 7m", "locrian #2", "half-diminished", "aeolian b5"],
    [
      "1P 2M 3M 4P 5P 6m 7m",
      "mixolydian b6",
      "melodic minor fifth mode",
      "hindu"
    ],
    ["1P 2M 3M 4A 5P 6M 7m", "lydian dominant", "lydian b7", "overtone"],
    ["1P 2M 3M 4A 5A 6M 7M", "lydian augmented"],
    [
      "1P 2m 3m 4P 5P 6M 7m",
      "dorian b2",
      "phrygian #6",
      "melodic minor second mode"
    ],
    [
      "1P 2m 3m 4d 5d 6m 7d",
      "ultralocrian",
      "superlocrian bb7",
      "superlocrian diminished"
    ],
    ["1P 2m 3m 4P 5d 6M 7m", "locrian 6", "locrian natural 6", "locrian sharp 6"],
    ["1P 2A 3M 4P 5P 5A 7M", "augmented heptatonic"],
    // Source https://en.wikipedia.org/wiki/Ukrainian_Dorian_scale
    [
      "1P 2M 3m 4A 5P 6M 7m",
      "dorian #4",
      "ukrainian dorian",
      "romanian minor",
      "altered dorian"
    ],
    ["1P 2M 3m 4A 5P 6M 7M", "lydian diminished"],
    ["1P 2M 3M 4A 5A 7m 7M", "leading whole tone"],
    ["1P 2M 3M 4A 5P 6m 7m", "lydian minor"],
    ["1P 2m 3M 4P 5P 6m 7m", "phrygian dominant", "spanish", "phrygian major"],
    ["1P 2m 3m 4P 5P 6m 7M", "balinese"],
    ["1P 2m 3m 4P 5P 6M 7M", "neopolitan major"],
    ["1P 2M 3M 4P 5P 6m 7M", "harmonic major"],
    ["1P 2m 3M 4P 5P 6m 7M", "double harmonic major", "gypsy"],
    ["1P 2M 3m 4A 5P 6m 7M", "hungarian minor"],
    ["1P 2A 3M 4A 5P 6M 7m", "hungarian major"],
    ["1P 2m 3M 4P 5d 6M 7m", "oriental"],
    ["1P 2m 3m 3M 4A 5P 7m", "flamenco"],
    ["1P 2m 3m 4A 5P 6m 7M", "todi raga"],
    ["1P 2m 3M 4P 5d 6m 7M", "persian"],
    ["1P 2m 3M 5d 6m 7m 7M", "enigmatic"],
    [
      "1P 2M 3M 4P 5A 6M 7M",
      "major augmented",
      "major #5",
      "ionian augmented",
      "ionian #5"
    ],
    ["1P 2A 3M 4A 5P 6M 7M", "lydian #9"],
    // 8-note scales
    ["1P 2m 2M 4P 4A 5P 6m 7M", "messiaen's mode #4"],
    ["1P 2m 3M 4P 4A 5P 6m 7M", "purvi raga"],
    ["1P 2m 3m 3M 4P 5P 6m 7m", "spanish heptatonic"],
    ["1P 2M 3m 3M 4P 5P 6M 7m", "bebop minor"],
    ["1P 2M 3M 4P 5P 5A 6M 7M", "bebop major"],
    ["1P 2m 3m 4P 5d 5P 6m 7m", "bebop locrian"],
    ["1P 2M 3m 4P 5P 6m 7m 7M", "minor bebop"],
    ["1P 2M 3M 4P 5d 5P 6M 7M", "ichikosucho"],
    ["1P 2M 3m 4P 5P 6m 6M 7M", "minor six diminished"],
    [
      "1P 2m 3m 3M 4A 5P 6M 7m",
      "half-whole diminished",
      "dominant diminished",
      "messiaen's mode #2"
    ],
    ["1P 3m 3M 4P 5P 6M 7m 7M", "kafi raga"],
    ["1P 2M 3M 4P 4A 5A 6A 7M", "messiaen's mode #6"],
    // 9-note scales
    ["1P 2M 3m 3M 4P 5d 5P 6M 7m", "composite blues"],
    ["1P 2M 3m 3M 4A 5P 6m 7m 7M", "messiaen's mode #3"],
    // 10-note scales
    ["1P 2m 2M 3m 4P 4A 5P 6m 6M 7M", "messiaen's mode #7"],
    // 12-note scales
    ["1P 2m 2M 3m 3M 4P 5d 5P 6m 6M 7m 7M", "chromatic"]
  ];
  var data_default2 = SCALES;
  var NoScaleType = {
    ...EmptyPcset,
    intervals: [],
    aliases: []
  };
  var dictionary2 = [];
  var index2 = {};
  function get3(type) {
    return index2[type] || NoScaleType;
  }
  var scaleType = deprecate(
    "ScaleDictionary.scaleType",
    "ScaleType.get",
    get3
  );
  function all2() {
    return dictionary2.slice();
  }
  var entries2 = deprecate(
    "ScaleDictionary.entries",
    "ScaleType.all",
    all2
  );
  function add3(intervals, name, aliases = []) {
    const scale2 = { ...get(intervals), name, intervals, aliases };
    dictionary2.push(scale2);
    index2[scale2.name] = scale2;
    index2[scale2.setNum] = scale2;
    index2[scale2.chroma] = scale2;
    scale2.aliases.forEach((alias) => addAlias2(scale2, alias));
    return scale2;
  }
  function addAlias2(scale2, alias) {
    index2[alias] = scale2;
  }
  data_default2.forEach(
    ([ivls, name, ...aliases]) => add3(ivls.split(" "), name, aliases)
  );

  // ../../node_modules/@tonaljs/chord/dist/index.mjs
  var NoChord = {
    empty: true,
    name: "",
    symbol: "",
    root: "",
    bass: "",
    rootDegree: 0,
    type: "",
    tonic: null,
    setNum: NaN,
    quality: "Unknown",
    chroma: "",
    normalized: "",
    aliases: [],
    notes: [],
    intervals: []
  };
  function tokenize(name) {
    const [letter, acc, oct, type] = tokenizeNote(name);
    if (letter === "") {
      return tokenizeBass("", name);
    } else if (letter === "A" && type === "ug") {
      return tokenizeBass("", "aug");
    } else {
      return tokenizeBass(letter + acc, oct + type);
    }
  }
  function tokenizeBass(note22, chord2) {
    const split = chord2.split("/");
    if (split.length === 1) {
      return [note22, split[0], ""];
    }
    const [letter, acc, oct, type] = tokenizeNote(split[1]);
    if (letter !== "" && oct === "" && type === "") {
      return [note22, split[0], letter + acc];
    } else {
      return [note22, chord2, ""];
    }
  }
  function get4(src) {
    if (Array.isArray(src)) {
      return getChord(src[1] || "", src[0], src[2]);
    } else if (src === "") {
      return NoChord;
    } else {
      const [tonic, type, bass] = tokenize(src);
      const chord2 = getChord(type, tonic, bass);
      return chord2.empty ? getChord(src) : chord2;
    }
  }
  function getChord(typeName, optionalTonic, optionalBass) {
    const type = get2(typeName);
    const tonic = note(optionalTonic || "");
    const bass = note(optionalBass || "");
    if (type.empty || optionalTonic && tonic.empty || optionalBass && bass.empty) {
      return NoChord;
    }
    const bassInterval = distance(tonic.pc, bass.pc);
    const bassIndex = type.intervals.indexOf(bassInterval);
    const hasRoot = bassIndex >= 0;
    const root = hasRoot ? bass : note("");
    const rootDegree = bassIndex === -1 ? NaN : bassIndex + 1;
    const hasBass = bass.pc && bass.pc !== tonic.pc;
    const intervals = Array.from(type.intervals);
    if (hasRoot) {
      for (let i = 1; i < rootDegree; i++) {
        const num = intervals[0][0];
        const quality = intervals[0][1];
        const newNum = parseInt(num, 10) + 7;
        intervals.push(`${newNum}${quality}`);
        intervals.shift();
      }
    } else if (hasBass) {
      const ivl = subtract(distance(tonic.pc, bass.pc), "8P");
      if (ivl)
        intervals.unshift(ivl);
    }
    const notes2 = tonic.empty ? [] : intervals.map((i) => transpose(tonic.pc, i));
    typeName = type.aliases.indexOf(typeName) !== -1 ? typeName : type.aliases[0];
    const symbol = `${tonic.empty ? "" : tonic.pc}${typeName}${hasRoot && rootDegree > 1 ? "/" + root.pc : hasBass ? "/" + bass.pc : ""}`;
    const name = `${optionalTonic ? tonic.pc + " " : ""}${type.name}${hasRoot && rootDegree > 1 ? " over " + root.pc : hasBass ? " over " + bass.pc : ""}`;
    return {
      ...type,
      name,
      symbol,
      tonic: tonic.pc,
      type: type.name,
      root: root.pc,
      bass: hasBass ? bass.pc : "",
      intervals,
      rootDegree,
      notes: notes2
    };
  }

  // ../../node_modules/@tonaljs/interval/node_modules/@tonaljs/pitch-interval/dist/index.mjs
  var fillStr4 = (s, n) => Array(Math.abs(n) + 1).join(s);
  var NoInterval3 = Object.freeze({
    empty: true,
    name: "",
    num: NaN,
    q: "",
    type: "",
    step: NaN,
    alt: NaN,
    dir: NaN,
    simple: NaN,
    semitones: NaN,
    chroma: NaN,
    coord: [],
    oct: NaN
  });
  var INTERVAL_TONAL_REGEX3 = "([-+]?\\d+)(d{1,4}|m|M|P|A{1,4})";
  var INTERVAL_SHORTHAND_REGEX3 = "(AA|A|P|M|m|d|dd)([-+]?\\d+)";
  var REGEX5 = new RegExp(
    "^" + INTERVAL_TONAL_REGEX3 + "|" + INTERVAL_SHORTHAND_REGEX3 + "$"
  );
  function tokenizeInterval3(str) {
    const m = REGEX5.exec(`${str}`);
    if (m === null) {
      return ["", ""];
    }
    return m[1] ? [m[1], m[2]] : [m[4], m[3]];
  }
  var cache5 = {};
  function interval3(src) {
    return typeof src === "string" ? cache5[src] || (cache5[src] = parse4(src)) : isPitch(src) ? interval3(pitchName4(src)) : isNamedPitch(src) ? interval3(src.name) : NoInterval3;
  }
  var SIZES3 = [0, 2, 4, 5, 7, 9, 11];
  var TYPES3 = "PMMPPMM";
  function parse4(str) {
    const tokens = tokenizeInterval3(str);
    if (tokens[0] === "") {
      return NoInterval3;
    }
    const num = +tokens[0];
    const q = tokens[1];
    const step = (Math.abs(num) - 1) % 7;
    const t = TYPES3[step];
    if (t === "M" && q === "P") {
      return NoInterval3;
    }
    const type = t === "M" ? "majorable" : "perfectable";
    const name = "" + num + q;
    const dir = num < 0 ? -1 : 1;
    const simple = num === 8 || num === -8 ? num : dir * (step + 1);
    const alt = qToAlt3(type, q);
    const oct = Math.floor((Math.abs(num) - 1) / 7);
    const semitones2 = dir * (SIZES3[step] + alt + 12 * oct);
    const chroma3 = (dir * (SIZES3[step] + alt) % 12 + 12) % 12;
    const coord = coordinates({ step, alt, oct, dir });
    return {
      empty: false,
      name,
      num,
      q,
      step,
      alt,
      dir,
      type,
      simple,
      semitones: semitones2,
      chroma: chroma3,
      coord,
      oct
    };
  }
  function coordToInterval3(coord, forceDescending) {
    const [f, o = 0] = coord;
    const isDescending = f * 7 + o * 12 < 0;
    const ivl = forceDescending || isDescending ? [-f, -o, -1] : [f, o, 1];
    return interval3(pitch(ivl));
  }
  function qToAlt3(type, q) {
    return q === "M" && type === "majorable" || q === "P" && type === "perfectable" ? 0 : q === "m" && type === "majorable" ? -1 : /^A+$/.test(q) ? q.length : /^d+$/.test(q) ? -1 * (type === "perfectable" ? q.length : q.length + 1) : 0;
  }
  function pitchName4(props) {
    const { step, alt, oct = 0, dir } = props;
    if (!dir) {
      return "";
    }
    const calcNum = step + 1 + 7 * oct;
    const num = calcNum === 0 ? step + 1 : calcNum;
    const d = dir < 0 ? "-" : "";
    const type = TYPES3[step] === "M" ? "majorable" : "perfectable";
    const name = d + num + altToQ3(type, alt);
    return name;
  }
  function altToQ3(type, alt) {
    if (alt === 0) {
      return type === "majorable" ? "M" : "P";
    } else if (alt === -1 && type === "majorable") {
      return "m";
    } else if (alt > 0) {
      return fillStr4("A", alt);
    } else {
      return fillStr4("d", type === "perfectable" ? alt : alt + 1);
    }
  }

  // ../../node_modules/@tonaljs/interval/node_modules/@tonaljs/pitch-note/dist/index.mjs
  var fillStr5 = (s, n) => Array(Math.abs(n) + 1).join(s);
  var NoNote3 = Object.freeze({
    empty: true,
    name: "",
    letter: "",
    acc: "",
    pc: "",
    step: NaN,
    alt: NaN,
    chroma: NaN,
    height: NaN,
    coord: [],
    midi: null,
    freq: null
  });
  var cache6 = /* @__PURE__ */ new Map();
  var stepToLetter2 = (step) => "CDEFGAB".charAt(step);
  var altToAcc2 = (alt) => alt < 0 ? fillStr5("b", -alt) : fillStr5("#", alt);
  var accToAlt2 = (acc) => acc[0] === "b" ? -acc.length : acc.length;
  function note3(src) {
    const stringSrc = JSON.stringify(src);
    const cached = cache6.get(stringSrc);
    if (cached) {
      return cached;
    }
    const value = typeof src === "string" ? parse5(src) : isPitch(src) ? note3(pitchName5(src)) : isNamedPitch(src) ? note3(src.name) : NoNote3;
    cache6.set(stringSrc, value);
    return value;
  }
  var REGEX6 = /^([a-gA-G]?)(#{1,}|b{1,}|x{1,}|)(-?\d*)\s*(.*)$/;
  function tokenizeNote2(str) {
    const m = REGEX6.exec(str);
    return m ? [m[1].toUpperCase(), m[2].replace(/x/g, "##"), m[3], m[4]] : ["", "", "", ""];
  }
  var mod3 = (n, m) => (n % m + m) % m;
  var SEMI2 = [0, 2, 4, 5, 7, 9, 11];
  function parse5(noteName) {
    const tokens = tokenizeNote2(noteName);
    if (tokens[0] === "" || tokens[3] !== "") {
      return NoNote3;
    }
    const letter = tokens[0];
    const acc = tokens[1];
    const octStr = tokens[2];
    const step = (letter.charCodeAt(0) + 3) % 7;
    const alt = accToAlt2(acc);
    const oct = octStr.length ? +octStr : void 0;
    const coord = coordinates({ step, alt, oct });
    const name = letter + acc + octStr;
    const pc = letter + acc;
    const chroma3 = (SEMI2[step] + alt + 120) % 12;
    const height = oct === void 0 ? mod3(SEMI2[step] + alt, 12) - 12 * 99 : SEMI2[step] + alt + 12 * (oct + 1);
    const midi = height >= 0 && height <= 127 ? height : null;
    const freq = oct === void 0 ? null : Math.pow(2, (height - 69) / 12) * 440;
    return {
      empty: false,
      acc,
      alt,
      chroma: chroma3,
      coord,
      freq,
      height,
      letter,
      midi,
      name,
      oct,
      pc,
      step
    };
  }
  function pitchName5(props) {
    const { step, alt, oct } = props;
    const letter = stepToLetter2(step);
    if (!letter) {
      return "";
    }
    const pc = letter + altToAcc2(alt);
    return oct || oct === 0 ? pc + oct : pc;
  }

  // ../../node_modules/@tonaljs/interval/node_modules/@tonaljs/pitch-distance/dist/index.mjs
  function distance3(fromNote, toNote) {
    const from = note3(fromNote);
    const to = note3(toNote);
    if (from.empty || to.empty) {
      return "";
    }
    const fcoord = from.coord;
    const tcoord = to.coord;
    const fifths = tcoord[0] - fcoord[0];
    const octs = fcoord.length === 2 && tcoord.length === 2 ? tcoord[1] - fcoord[1] : -Math.floor(fifths * 7 / 12);
    const forceDescending = to.height === from.height && to.midi !== null && from.oct === to.oct && from.step > to.step;
    return coordToInterval3([fifths, octs], forceDescending).name;
  }

  // ../../node_modules/@tonaljs/interval/dist/index.mjs
  var get5 = interval3;
  var semitones = (name2) => interval3(name2).semitones;
  var IQ2 = "P m M m M P d P m M m M".split(" ");
  var distance4 = distance3;
  var add4 = combinator2((a, b) => [a[0] + b[0], a[1] + b[1]]);
  var subtract2 = combinator2((a, b) => [a[0] - b[0], a[1] - b[1]]);
  function combinator2(fn) {
    return (a, b) => {
      const coordA = interval3(a).coord;
      const coordB = interval3(b).coord;
      if (coordA && coordB) {
        const coord = fn(coordA, coordB);
        return coordToInterval3(coord).name;
      }
    };
  }

  // ../../node_modules/@tonaljs/midi/dist/index.mjs
  var L2 = Math.log(2);
  var L440 = Math.log(440);
  var SHARPS = "C C# D D# E F F# G G# A A# B".split(" ");
  var FLATS = "C Db D Eb E F Gb G Ab A Bb B".split(" ");
  function midiToNoteName(midi, options = {}) {
    if (isNaN(midi) || midi === -Infinity || midi === Infinity)
      return "";
    midi = Math.round(midi);
    const pcs = options.sharps === true ? SHARPS : FLATS;
    const pc = pcs[midi % 12];
    if (options.pitchClass) {
      return pc;
    }
    const o = Math.floor(midi / 12) - 1;
    return pc + o;
  }

  // ../../node_modules/@tonaljs/note/dist/index.mjs
  var get6 = note;
  var chroma = (note4) => get6(note4).chroma;
  function fromMidi(midi2) {
    return midiToNoteName(midi2);
  }

  // ../../node_modules/@tonaljs/roman-numeral/dist/index.mjs
  var NoRomanNumeral = { empty: true, name: "", chordType: "" };
  var cache7 = {};
  function get7(src) {
    return typeof src === "string" ? cache7[src] || (cache7[src] = parse6(src)) : typeof src === "number" ? get7(NAMES[src] || "") : isPitch(src) ? fromPitch(src) : isNamed(src) ? get7(src.name) : NoRomanNumeral;
  }
  var romanNumeral = deprecate(
    "RomanNumeral.romanNumeral",
    "RomanNumeral.get",
    get7
  );
  function fromPitch(pitch2) {
    return get7(altToAcc(pitch2.alt) + NAMES[pitch2.step]);
  }
  var REGEX7 = /^(#{1,}|b{1,}|x{1,}|)(IV|I{1,3}|VI{0,2}|iv|i{1,3}|vi{0,2})([^IViv]*)$/;
  function tokenize2(str) {
    return REGEX7.exec(str) || ["", "", "", ""];
  }
  var ROMANS = "I II III IV V VI VII";
  var NAMES = ROMANS.split(" ");
  var NAMES_MINOR = ROMANS.toLowerCase().split(" ");
  function parse6(src) {
    const [name, acc, roman, chordType2] = tokenize2(src);
    if (!roman) {
      return NoRomanNumeral;
    }
    const upperRoman = roman.toUpperCase();
    const step = NAMES.indexOf(upperRoman);
    const alt = accToAlt(acc);
    const dir = 1;
    return {
      empty: false,
      name,
      roman,
      interval: interval({ step, alt, dir }).name,
      acc,
      chordType: chordType2,
      alt,
      step,
      major: roman === upperRoman,
      oct: 0,
      dir
    };
  }

  // ../../node_modules/@tonaljs/key/dist/index.mjs
  var Empty = Object.freeze([]);
  var NoKey = {
    type: "major",
    tonic: "",
    alteration: 0,
    keySignature: ""
  };
  var NoKeyScale = {
    tonic: "",
    grades: Empty,
    intervals: Empty,
    scale: Empty,
    triads: Empty,
    chords: Empty,
    chordsHarmonicFunction: Empty,
    chordScales: Empty
  };
  var NoMajorKey = {
    ...NoKey,
    ...NoKeyScale,
    type: "major",
    minorRelative: "",
    scale: Empty,
    secondaryDominants: Empty,
    secondaryDominantsMinorRelative: Empty,
    substituteDominants: Empty,
    substituteDominantsMinorRelative: Empty
  };
  var NoMinorKey = {
    ...NoKey,
    type: "minor",
    relativeMajor: "",
    natural: NoKeyScale,
    harmonic: NoKeyScale,
    melodic: NoKeyScale
  };
  var mapScaleToType = (scale2, list, sep = "") => list.map((type, i) => `${scale2[i]}${sep}${type}`);
  function keyScale(grades, triads, chords, harmonicFunctions, chordScales) {
    return (tonic) => {
      const intervals = grades.map((gr) => get7(gr).interval || "");
      const scale2 = intervals.map((interval4) => transpose(tonic, interval4));
      return {
        tonic,
        grades,
        intervals,
        scale: scale2,
        triads: mapScaleToType(scale2, triads),
        chords: mapScaleToType(scale2, chords),
        chordsHarmonicFunction: harmonicFunctions.slice(),
        chordScales: mapScaleToType(scale2, chordScales, " ")
      };
    };
  }
  var MajorScale = keyScale(
    "I II III IV V VI VII".split(" "),
    " m m   m dim".split(" "),
    "maj7 m7 m7 maj7 7 m7 m7b5".split(" "),
    "T SD T SD D T D".split(" "),
    "major,dorian,phrygian,lydian,mixolydian,minor,locrian".split(",")
  );
  var NaturalScale = keyScale(
    "I II bIII IV V bVI bVII".split(" "),
    "m dim  m m  ".split(" "),
    "m7 m7b5 maj7 m7 m7 maj7 7".split(" "),
    "T SD T SD D SD SD".split(" "),
    "minor,locrian,major,dorian,phrygian,lydian,mixolydian".split(",")
  );
  var HarmonicScale = keyScale(
    "I II bIII IV V bVI VII".split(" "),
    "m dim aug m   dim".split(" "),
    "mMaj7 m7b5 +maj7 m7 7 maj7 o7".split(" "),
    "T SD T SD D SD D".split(" "),
    "harmonic minor,locrian 6,major augmented,lydian diminished,phrygian dominant,lydian #9,ultralocrian".split(
      ","
    )
  );
  var MelodicScale = keyScale(
    "I II bIII IV V VI VII".split(" "),
    "m m aug   dim dim".split(" "),
    "m6 m7 +maj7 7 7 m7b5 m7b5".split(" "),
    "T SD T SD D  ".split(" "),
    "melodic minor,dorian b2,lydian augmented,lydian dominant,mixolydian b6,locrian #2,altered".split(
      ","
    )
  );

  // ../../node_modules/@tonaljs/scale/dist/index.mjs
  var NoScale = {
    empty: true,
    name: "",
    type: "",
    tonic: null,
    setNum: NaN,
    chroma: "",
    normalized: "",
    aliases: [],
    notes: [],
    intervals: []
  };
  function tokenize3(name) {
    if (typeof name !== "string") {
      return ["", ""];
    }
    const i = name.indexOf(" ");
    const tonic = note(name.substring(0, i));
    if (tonic.empty) {
      const n = note(name);
      return n.empty ? ["", name] : [n.name, ""];
    }
    const type = name.substring(tonic.name.length + 1).toLowerCase();
    return [tonic.name, type.length ? type : ""];
  }
  function get8(src) {
    const tokens = Array.isArray(src) ? src : tokenize3(src);
    const tonic = note(tokens[0]).name;
    const st = get3(tokens[1]);
    if (st.empty) {
      return NoScale;
    }
    const type = st.name;
    const notes = tonic ? st.intervals.map((i) => transpose(tonic, i)) : [];
    const name = tonic ? tonic + " " + type : type;
    return { ...st, name, type, tonic, notes };
  }
  var scale = deprecate("Scale.scale", "Scale.get", get8);

  // ../../packages/util/color/dist/index.mjs
  var map2rgbByHue = (h, max, mid) => {
    switch (Math.floor(h)) {
      case 0:
        return [max, mid, 0];
      case 1:
        return [mid, max, 0];
      case 2:
        return [0, max, mid];
      case 3:
        return [0, mid, max];
      case 4:
        return [mid, 0, max];
      case 5:
        return [max, 0, mid];
      default:
        throw new Error(`Unexpected value received. It should be in 0 <= h < 6, but h is ${h}`);
    }
  };
  var hsv2rgb = (h, s, v) => {
    createAssertion(0 <= s && s <= 1).onFailed(() => {
      throw new RangeError(`Unexpected value received. It should be in 0 <= s <= 1, but max is ${s}`);
    });
    createAssertion(0 <= v && v <= 1).onFailed(() => {
      throw new RangeError(`Unexpected value received. It should be in 0 <= v <= 1, but mid is ${v}`);
    });
    const H = mod(h, 360) / 60;
    const max = v * s;
    const mid = v * s * Math.abs(mod(H + 1, 2) - 1);
    const m = v * (1 - s);
    const rgb = map2rgbByHue(H, max, mid);
    const f = (e) => Math.floor((e + m) * 256);
    const g = (e) => e > 255 ? 255 : e;
    return [g(f(rgb[0])), g(f(rgb[1])), g(f(rgb[2]))];
  };
  var rgbToString = (rgb) => "#" + rgb.map((e) => ("0" + e.toString(16)).slice(-2)).join("");
  var green_hue = 120;
  var thirdToColor = (note4, tonic, s, v) => {
    if (note4.length === 0) {
      return "rgb(64, 64, 64)";
    }
    const interval4 = get5(distance4(tonic, note4));
    const circle_of_third_pos = mod(chroma(tonic) * 5, 12) - interval4.step / 4;
    return rgbToString(hsv2rgb(-circle_of_third_pos * 360 / 12 + green_hue, s, v));
  };
  var fifthChromaToColor = (chroma3, s, v) => rgbToString(hsv2rgb(-mod(chroma3 * 5, 12) * 360 / 12 + green_hue, s, v));
  var fifthToColor = (note4, s, v) => note4.length ? fifthChromaToColor(chroma(note4), s, v) : "rgb(64, 64, 64)";

  // ../../packages/UI/piano-roll/chord-view/dist/index.mjs
  var chord_name_margin = 5;
  var chord_text_em = size;
  var chord_text_size = 16 * chord_text_em;
  var oneLetterKey = (key) => {
    const tonic = key.tonic || "";
    const type = key.type;
    if (type === "aeolian") {
      return getLowerCase(tonic);
    } else if (type === "minor") {
      return getLowerCase(tonic);
    } else if (type === "ionian") {
      return getCapitalCase(tonic);
    } else if (type === "major") {
      return getCapitalCase(tonic);
    } else {
      return key.name;
    }
  };
  var getChordKeyModel = (e) => ({
    time: e.time,
    chord: e.chord,
    scale: e.scale,
    roman: e.roman,
    tonic: e.scale.tonic || ""
  });
  var getColor = (tonic) => (s, v) => {
    return fifthToColor(tonic, s, v) || "rgb(0, 0, 0)";
  };
  var updateChordKeyViewX = (svg) => (x) => {
    svg.setAttribute("x", String(x));
  };
  var updateChordKeyViewY = (svg) => (y) => {
    svg.setAttribute("y", String(y));
  };
  var scaled2 = (e) => e * NoteSize.get();
  var onWindowResized = (begin, svg) => () => {
    updateChordKeyViewX(svg)(scaled2(begin));
  };
  function buildChordKeySeries(romans, controllers) {
    const children = romans.map((e) => {
      const model = getChordKeyModel(e);
      const svg2 = document.createElementNS("http://www.w3.org/2000/svg", "text");
      svg2.id = "key-name";
      svg2.style.fontFamily = "Times New Roman";
      svg2.style.fontSize = `${chord_text_em}em`;
      svg2.style.textAnchor = "end";
      svg2.textContent = oneLetterKey(model.scale) + ": ";
      svg2.style.fill = getColor(model.tonic)(1, 0.75);
      updateChordKeyViewX(svg2)(scaled2(model.time.begin));
      updateChordKeyViewY(svg2)(PianoRollHeight.get() + chord_text_size + (chord_text_size + chord_name_margin));
      const key = { model, svg: svg2 };
      return key;
    });
    const id = "key-names";
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.id = id;
    children.forEach((e) => svg.appendChild(e.svg));
    controllers.audio.addListeners(() => children.forEach((e) => onWindowResized(e.model.time.begin, e.svg)()));
    controllers.window.addListeners(() => children.forEach((e) => onWindowResized(e.model.time.begin, e.svg)));
    controllers.time_range.addListeners(() => svg.setAttribute("transform", `translate(${PianoRollTranslateX.get()})`));
    return svg;
  }
  var getChordNoteModel = (e, note4, oct) => ({
    ...e,
    type: e.chord.type,
    note: note4.chroma,
    note_name: note4.name,
    tonic: e.chord.tonic || "",
    interval: distance4(e.chord.tonic || "", note4),
    oct
  });
  var updateChordNoteViewX = (svg) => (x) => {
    svg.setAttribute("x", String(x));
  };
  var updateChordNoteViewY = (svg) => (y) => {
    svg.setAttribute("y", String(y));
  };
  var updateChordNoteViewWidth = (svg) => (w) => {
    svg.setAttribute("width", String(w));
  };
  var updateChordNoteViewHeight = (svg) => (h) => {
    svg.setAttribute("height", String(h));
  };
  var getColor2 = (tonic) => (s, v) => {
    return fifthToColor(tonic, s, v) || "rgb(0, 0, 0)";
  };
  var scaled22 = (e) => e * NoteSize.get();
  var updateChordNoteX = (svg, begin) => {
    updateChordNoteViewX(svg)(scaled22(begin));
  };
  var updateChordNoteY = (svg, y) => {
    updateChordNoteViewY(svg)(y);
  };
  var updateChordNoteWidth = (svg, duration) => {
    updateChordNoteViewWidth(svg)(scaled22(duration));
  };
  var updateChordNoteHeight = (svg) => {
    updateChordNoteViewHeight(svg)(black_key_height);
  };
  var onWindowResized_ChordNote = (svg, model) => {
    updateChordNoteX(svg, model.time.begin);
    updateChordNoteWidth(svg, scaled22(model.time.duration));
    updateChordNoteHeight(svg);
  };
  function buildChordNotesSeries(romans, controllers) {
    const children = romans.map((roman) => {
      const model = roman;
      const chord = model.chord;
      const svg2 = document.createElementNS("http://www.w3.org/2000/svg", "g");
      svg2.id = chord.name;
      const children2 = [...Array(OctaveCount.get())].map((_, oct) => {
        const svg3 = document.createElementNS("http://www.w3.org/2000/svg", "g");
        svg3.id = `${chord.name}-${oct}`;
        const children3 = chord.notes.map((note4) => {
          const model2 = getChordNoteModel(roman, get6(note4), oct);
          const svg4 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
          svg4.id = "key-name";
          svg4.style.fontFamily = "Times New Roman";
          svg4.style.fontSize = `${chord_text_em}em`;
          svg4.style.textAnchor = "end";
          svg4.textContent = oneLetterKey(model2.scale) + ": ";
          svg4.style.fill = getColor2(model2.tonic)(1, 0.75);
          svg4.style.stroke = "rgb(64, 64, 64)";
          svg4.style.fill = thirdToColor(model2.note_name, model2.tonic, 0.25, 1);
          if (false) {
            svg4.style.fill = getColor2(model2.tonic)(0.25, model2.type === "major" ? 1 : 0.9);
          }
          const y = [model2.note].map((e) => mod(e, 12)).map((e) => e + 12).map((e) => e * model2.oct).map((e) => PianoRollConverter.midi2BlackCoordinate(e))[0];
          updateChordNoteX(svg4, model2.time.begin);
          updateChordNoteY(svg4, y);
          updateChordNoteWidth(svg4, scaled22(model2.time.duration));
          updateChordNoteHeight(svg4);
          return { model: model2, svg: svg4 };
        });
        children3.forEach((e) => svg3.appendChild(e.svg));
        return { svg: svg3, children: children3 };
      });
      children2.forEach((e) => svg2.appendChild(e.svg));
      return { svg: svg2, children: children2 };
    });
    const id = "chords";
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.id = id;
    children.forEach((e) => svg.appendChild(e.svg));
    controllers.audio.addListeners(() => children.forEach((e) => e.children.forEach((e2) => e2.children.forEach((e3) => onWindowResized_ChordNote(e3.svg, e3.model)))));
    controllers.window.addListeners(() => children.forEach((e) => e.children.forEach((e2) => e2.children.forEach((e3) => onWindowResized_ChordNote(e3.svg, e3.model)))));
    controllers.time_range.addListeners(() => svg.setAttribute("transform", `translate(${PianoRollTranslateX.get()})`));
    return svg;
  }
  var shortenChord = (chord) => {
    const M7 = chord.replace("major seventh", "M7");
    const major = M7.replace("major", "");
    const minor = major.replace("minor ", "m").replace("minor", "m");
    const seventh = minor.replace("seventh", "7");
    return seventh;
  };
  var getChordNameModel = (e) => ({
    ...e,
    tonic: e.chord.tonic || ""
  });
  var getColor3 = (tonic) => (s, v) => {
    return fifthToColor(tonic, s, v) || "rgb(0, 0, 0)";
  };
  var updateChordNameViewX = (svg) => (x) => {
    svg.setAttribute("x", String(x));
  };
  var updateChordNameViewY = (svg) => (y) => {
    svg.setAttribute("y", String(y));
  };
  var scaled3 = (e) => e * NoteSize.get();
  function buildChordNameSeries(romans, controllers) {
    const children = romans.map((e) => {
      const model = getChordNameModel(e);
      const svg2 = document.createElementNS("http://www.w3.org/2000/svg", "text");
      svg2.textContent = shortenChord(model.chord.name);
      svg2.id = "chord-name";
      svg2.style.fontFamily = "Times New Roman";
      svg2.style.fontSize = `${chord_text_em}em`;
      svg2.style.fill = getColor3(model.tonic)(1, 0.75);
      updateChordNameViewX(svg2)(scaled3(model.time.begin));
      updateChordNameViewY(svg2)(PianoRollHeight.get() + chord_text_size);
      return svg2;
    });
    const id = "chord-names";
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.id = id;
    children.forEach((e) => svg.appendChild(e));
    controllers.audio.addListeners(() => children.forEach((e) => updateChordNameViewY(e)(PianoRollHeight.get() + chord_text_size)));
    controllers.window.addListeners(() => children.forEach((e) => updateChordNameViewY(e)(PianoRollHeight.get() + chord_text_size)));
    controllers.time_range.addListeners(() => svg.setAttribute("transform", `translate(${PianoRollTranslateX.get()})`));
    return svg;
  }
  var getChordRomanModel = (e) => ({
    ...e,
    tonic: e.chord.tonic || ""
  });
  var getColor4 = (tonic) => (s, v) => {
    return fifthToColor(tonic, s, v) || "rgb(0, 0, 0)";
  };
  var updateChordRomanViewX = (svg) => (x) => {
    svg.setAttribute("x", String(x));
  };
  var updateChordRomanViewY = (svg) => (y) => {
    svg.setAttribute("y", String(y));
  };
  var scaled4 = (e) => e * NoteSize.get();
  function buildChordRomanSeries(romans, controllers) {
    const children = romans.map((e) => {
      const model = getChordRomanModel(e);
      const svg2 = document.createElementNS("http://www.w3.org/2000/svg", "text");
      svg2.textContent = shortenChord(model.roman);
      svg2.id = "roman-name";
      svg2.style.fontFamily = "Times New Roman";
      svg2.style.fontSize = `${chord_text_em}em`;
      svg2.style.fill = getColor4(model.tonic)(1, 0.75);
      updateChordRomanViewX(svg2)(scaled4(model.time.begin));
      updateChordRomanViewY(svg2)(PianoRollHeight.get() + chord_text_size + (chord_text_size + chord_name_margin));
      return { model, svg: svg2 };
    });
    const id = "roman-names";
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.id = id;
    children.forEach((e) => svg.appendChild(e.svg));
    controllers.audio.addListeners(() => children.forEach((e) => updateChordRomanViewX(e.svg)(scaled4(e.model.time.begin))));
    controllers.window.addListeners(() => children.forEach((e) => updateChordRomanViewX(e.svg)(scaled4(e.model.time.begin))));
    controllers.time_range.addListeners(() => svg.setAttribute("transform", `translate(${PianoRollTranslateX.get()})`));
    return svg;
  }
  var getRequiredByChordPartModel = (e) => ({
    time: e.time,
    chord: get4(e.chord),
    scale: get8(e.scale),
    roman: e.roman
  });
  function createChordElements(romans, controllers) {
    const data = romans.map((e) => getRequiredByChordPartModel(e));
    const chord_keys = buildChordKeySeries(data, controllers);
    const chord_names = buildChordNameSeries(data, controllers);
    const chord_notes = buildChordNotesSeries(data, controllers);
    const chord_romans = buildChordRomanSeries(data, controllers);
    const children = [
      chord_keys,
      chord_names,
      chord_notes,
      chord_romans
    ];
    return {
      children,
      chord_keys,
      chord_names,
      chord_notes,
      chord_romans
    };
  }

  // ../../packages/UI/piano-roll/melody-view/dist/index.mjs
  var updateX_DMelodyView = (svg) => (x) => {
    svg.setAttribute("x", String(x));
  };
  var updateY_DMelodyView = (svg) => (y) => {
    svg.setAttribute("y", String(y));
  };
  var updateWidth_DMelodyView = (svg) => (w) => {
    svg.setAttribute("width", String(w));
  };
  var updateHeight_DMelodyView = (svg) => (h) => {
    svg.setAttribute("height", String(h));
  };
  var updateX2 = (svg) => (begin) => {
    updateX_DMelodyView(svg)(PianoRollConverter.scaled(begin));
  };
  var updateY2 = (svg) => (note4) => {
    updateY_DMelodyView(svg)(PianoRollConverter.midi2NNBlackCoordinate(note4));
  };
  var updateWidth = (svg) => (duration) => {
    updateWidth_DMelodyView(svg)(PianoRollConverter.scaled(duration));
  };
  var updateHeight = (svg) => {
    updateHeight_DMelodyView(svg)(black_key_height);
  };
  var onWindowResized2 = (svg) => (model) => {
    updateX2(svg)(model.time.begin);
    updateWidth(svg)(model.time.duration);
    updateHeight(svg);
  };
  var onTimeRangeChanged = onWindowResized2;
  var onDMelodyVisibilityChanged = (svg) => (visible) => {
    const visibility = visible ? "visible" : "hidden";
    svg.setAttribute("visibility", visibility);
  };
  var onAudioUpdate = (svg) => {
    svg.setAttribute("transform", `translate(${PianoRollTranslateX.get()})`);
  };
  function getMelodyViewSVG() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    svg.id = "melody-note";
    svg.style.fill = rgbToString(hsv2rgb(0, 0, 0.75));
    svg.style.stroke = "rgb(64, 64, 64)";
    return svg;
  }
  function getSVGG(id, parts) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.id = id;
    parts.forEach((e) => svg.appendChild(e.svg));
    return svg;
  }
  function buildDMelody(d_melody, controllers) {
    const children = d_melody.map((melody) => {
      const svg2 = getMelodyViewSVG();
      updateX2(svg2)(melody.time.begin);
      updateY2(svg2)(melody.note);
      updateWidth(svg2)(melody.time.duration);
      updateHeight(svg2);
      return { model: melody, svg: svg2 };
    });
    const svg = getSVGG("detected-melody", children);
    const d_melody_collection = { svg, children };
    controllers.window.addListeners(...d_melody_collection.children.map((e) => () => onWindowResized2(e.svg)(e.model)));
    controllers.time_range.addListeners(...d_melody_collection.children.map((e) => () => onTimeRangeChanged(e.svg)(e.model)));
    controllers.d_melody.addListeners(onDMelodyVisibilityChanged(d_melody_collection.svg));
    controllers.audio.addListeners(() => onAudioUpdate(d_melody_collection.svg));
    onAudioUpdate(d_melody_collection.svg);
    return d_melody_collection.svg;
  }
  var createIRPlotAxis = (svg) => ({ svg });
  var createIRPlotCircles = (svg) => {
    let show = [];
    const setShow2 = (visible_layers) => {
      show = visible_layers;
      svg.replaceChildren(...show.map((e) => e.view.svg));
    };
    return {
      svg,
      get show() {
        return show;
      },
      setShow: setShow2
    };
  };
  var createIRPlotHierarchyModel = (children) => {
    const w = Math.max(...children.map((e) => e.view.model.w));
    const h = Math.max(...children.map((e) => e.view.model.h));
    return { width: w, height: h };
  };
  var createIRPlotHierarchyView = (svg, x_axis, y_axis, circles) => ({
    svg,
    x_axis,
    y_axis,
    circles,
    updateCircleVisibility: (visible_layer) => circles.setShow(visible_layer)
  });
  var createCacheCore = (melodySeries) => {
    let cache8 = [];
    let index3 = 0;
    const cacheHit = () => cache8[1]?.time.has(NowAt.get());
    const cacheUpdate = () => {
      if (cacheHit()) {
        return;
      }
      index3 = melodySeries.findIndex(
        (value) => value.time.has(NowAt.get())
      );
      const i = index3;
      const N = melodySeries.length;
      cache8 = [
        melodySeries[Math.max(0, i - 1)],
        melodySeries[Math.max(0, i)],
        melodySeries[Math.min(i + 1, N - 1)],
        melodySeries[Math.min(i + 2, N - 1)]
      ];
    };
    const core = {
      melody_series: melodySeries,
      get index() {
        cacheUpdate();
        return index3;
      },
      get melody() {
        cacheUpdate();
        return cache8;
      }
    };
    return core;
  };
  var createMelodiesCache = (melodySeries) => {
    const core = createCacheCore(melodySeries);
    const is_visible = () => {
      const i = core.index;
      return 1 <= i && i < core.melody_series.length - 1;
    };
    const getRangedMelody = () => core.melody;
    const getPositionRatio = () => {
      const melodies = core.melody;
      const t = [melodies[1].time.begin, melodies[2].time.begin];
      return (NowAt.get() - t[0]) / (t[1] - t[0]);
    };
    const getInterval = () => {
      const melodies = core.melody.map((e) => e.note);
      return [
        melodies[1] - melodies[0] || 0,
        melodies[2] - melodies[1] || 0,
        melodies[3] - melodies[2] || 0
      ];
    };
    const getCurrentNote = () => core.melody[1];
    const cache8 = {
      get is_visible() {
        return is_visible();
      },
      getRangedMelody: () => getRangedMelody(),
      getPositionRatio: () => getPositionRatio(),
      getInterval: () => getInterval(),
      getCurrentNote: () => getCurrentNote()
    };
    return cache8;
  };
  var createIRPlotModel = (melody_series) => {
    const melody = createMelodiesCache(melody_series);
    const model = {
      time: createTime(0, 0),
      head: createTime(0, 0),
      melody,
      get archetype() {
        return melody.getCurrentNote().melody_analysis.implication_realization;
      },
      get is_visible() {
        return melody.is_visible;
      },
      getRangedMelody: () => melody.getRangedMelody(),
      getPositionRatio: () => melody.getPositionRatio(),
      getInterval: () => melody.getInterval(),
      getCurrentNote: () => melody.getCurrentNote()
    };
    return model;
  };
  var createIRPlotViewModel = () => ({
    w: 500,
    h: 500,
    x0: 250,
    y0: 250,
    getTranslatedX: function(x) {
      return x * this.w / 2 + this.x0;
    },
    getTranslatedY: function(y) {
      return y * this.h / 2 + this.y0;
    }
  });
  var get_pos = (_x, _y) => {
    const a = 1 / 3;
    const x = a * _x;
    const y = a * _y;
    const double_angle_x = x * x - y * y;
    const double_angle_y = 2 * x * y;
    const r2 = 1 + x * x + y * y;
    return [
      double_angle_x / r2,
      double_angle_y / r2
    ];
  };
  var nan2zero = (x) => isNaN(x) ? 0 : x;
  var createIRPlotView = (svg, view_model, model) => {
    const updateX4 = (x) => {
      [x].map((e) => view_model.getTranslatedX(e)).map((e) => nan2zero(e)).map((e) => svg.setAttribute("cx", String(e)));
    };
    const updateY4 = (y) => {
      [y].map((e) => view_model.getTranslatedY(e)).map((e) => nan2zero(e)).map((e) => svg.setAttribute("cy", String(e)));
    };
    const easeInOutCos = (t) => (1 - Math.cos(t * Math.PI)) / 2;
    return {
      svg,
      view_model,
      model,
      updateRadius: (r) => {
        svg.style.r = String(r);
      },
      updatePosition: () => {
        const interval4 = model.getInterval();
        const curr = get_pos(interval4[0], interval4[1]);
        const next = get_pos(interval4[1], interval4[2]);
        const r = easeInOutCos(model.getPositionRatio());
        updateX4(-((1 - r) * curr[0] + r * next[0]));
        updateY4(-((1 - r) * curr[1] + r * next[1]));
      },
      setColor: (color) => {
        svg.style.fill = color;
      }
    };
  };
  var createIRPlot = (model, view) => ({
    model,
    view,
    get svg() {
      return view.svg;
    },
    onAudioUpdate: () => view.updatePosition(),
    onWindowResized: () => {
    },
    setColor: (f) => view.setColor(f(model.archetype))
  });
  var createIRPlotLayerModel = (w, h) => ({ w, h });
  var createIRPlotLayerView = (svg, layer, model) => ({
    svg,
    layer,
    model,
    updateWidth: (w) => svg.setAttribute("width", String(w)),
    updateHeight: (h) => svg.setAttribute("height", String(h))
  });
  var createIRPlotLayer = (svg, view, children, layer) => {
    const children_model = children.map((e) => e.model);
    const show = children;
    return {
      svg,
      view,
      children,
      layer,
      children_model,
      get show() {
        return show;
      },
      onAudioUpdate: () => svg.setAttribute("transform", `translate(${PianoRollTranslateX.get()})`)
    };
  };
  var createIRPlotHierarchy = (svg, children, view, model) => {
    let visible_layer = children.length;
    const hierarchy = {
      svg,
      children,
      view,
      model,
      _show: [],
      onChangedLayer(value) {
        visible_layer = value;
        const show = children.filter((e) => e.children[0].model.is_visible).filter((e) => 1 < e.layer && e.layer <= visible_layer);
        view.updateCircleVisibility(show);
      },
      setShow(layers) {
        this._show = layers;
        this._show.forEach((e) => e.onAudioUpdate());
        svg.replaceChildren(...this._show.map((e) => e.svg));
      }
    };
    return hierarchy;
  };
  var createIRPlotSVG = (svg, children) => ({ svg, children });
  function getCircle() {
    const circle_svg = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle_svg.style.stroke = "rgb(16, 16, 16)";
    circle_svg.style.strokeWidth = String(6);
    return circle_svg;
  }
  function getLayer(layer, child) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.id = `layer-${layer}`;
    svg.appendChild(child.view.svg);
    return svg;
  }
  function updateRadius(l, N, part) {
    const base = Math.min(part.view.view_model.w, part.view.view_model.h) / 10 / N;
    part.view.updateRadius(base * (N - l / 2));
  }
  function getAxis(p) {
    const x_axis_svg = document.createElementNS("http://www.w3.org/2000/svg", "line");
    x_axis_svg.setAttribute("x1", String(p.x1));
    x_axis_svg.setAttribute("x2", String(p.x2));
    x_axis_svg.setAttribute("y1", String(p.y1));
    x_axis_svg.setAttribute("y2", String(p.y2));
    x_axis_svg.style.stroke = "rgb(0, 0, 0)";
    return x_axis_svg;
  }
  function getAxisSVG(w, h, x_axis, y_axis, circles) {
    const axis_svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    axis_svg.id = "implication-realization plot";
    axis_svg.replaceChildren(x_axis.svg, y_axis.svg, circles.svg);
    axis_svg.setAttribute("width", String(w));
    axis_svg.setAttribute("height", String(h));
    return axis_svg;
  }
  function getSVGG2(id, children) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.id = id;
    children.forEach((e) => svg.appendChild(e.svg));
    return svg;
  }
  function buildIRPlot(h_melodies, controllers) {
    const layers = h_melodies.map((e, l) => {
      const model = createIRPlotModel(e);
      const circle_svg2 = getCircle();
      const view_model = createIRPlotViewModel();
      const view2 = createIRPlotView(circle_svg2, view_model, model);
      const part = createIRPlot(model, view2);
      const svg2 = getLayer(l, part);
      const layer_model = createIRPlotLayerModel(part.view.view_model.w, part.view.view_model.h);
      updateRadius(l, h_melodies.length, part);
      const layer_view = createIRPlotLayerView(svg2, l, layer_model);
      layer_view.updateWidth(layer_model.w);
      layer_view.updateHeight(layer_model.h);
      const svgg2 = getSVGG2(`layer-${l}`, [part]);
      return createIRPlotLayer(svgg2, layer_view, [part], l);
    });
    const h_model = createIRPlotHierarchyModel(layers);
    const w = h_model.width;
    const h = h_model.height;
    const x_axis_svg = getAxis({ x1: 0, x2: w, y1: h / 2, y2: h / 2 });
    const y_axis_svg = getAxis({ x1: w / 2, x2: w / 2, y1: 0, y2: h });
    const x_axis = createIRPlotAxis(x_axis_svg);
    const y_axis = createIRPlotAxis(y_axis_svg);
    const circle_svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const circles = createIRPlotCircles(circle_svg);
    const axis_svg = getAxisSVG(w, h, x_axis, y_axis, circles);
    const view = createIRPlotHierarchyView(axis_svg, x_axis, y_axis, circles);
    const svgg = getSVGG2("IR-plot-hierarchy", layers);
    const hierarchy = [createIRPlotHierarchy(svgg, layers, view, h_model)];
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.id = "IR-plot";
    hierarchy.forEach((e) => svg.appendChild(e.view.svg));
    hierarchy.forEach((e) => svg.setAttribute("width", String(e.model.width)));
    hierarchy.forEach((e) => svg.setAttribute("height", String(e.model.height)));
    const ir_plot_svg = createIRPlotSVG(svg, hierarchy);
    controllers.window.addListeners(...ir_plot_svg.children.flatMap((e) => e).flatMap((e) => e.children).flatMap((e) => e.children).map((e) => e.onWindowResized));
    controllers.hierarchy.addListeners(...ir_plot_svg.children.flatMap((e) => e.onChangedLayer));
    controllers.melody_color.addListeners(...ir_plot_svg.children.flatMap((e) => e.children).flatMap((e) => e.children).map((e) => e.setColor));
    controllers.audio.addListeners(...ir_plot_svg.children.flatMap((e) => e.children).map((e) => e.onAudioUpdate));
    ir_plot_svg.children.flatMap((e) => e.children).map((e) => e.onAudioUpdate());
    return ir_plot_svg.svg;
  }
  var getIRSymbolModel = (e, layer) => ({
    ...e,
    archetype: e.melody_analysis.implication_realization,
    layer: layer || 0
  });
  var ir_analysis_em = size;
  var updateX_IRSymbolView = (svg) => (x) => {
    svg.setAttribute("x", String(x));
  };
  var updateY_IRSymbolView = (svg) => (y) => {
    svg.setAttribute("y", String(y));
  };
  var setColor_IRSymbolView = (svg) => (color) => svg.setAttribute("fill", color);
  var updateX22 = (svg) => (model) => {
    updateX_IRSymbolView(svg)(
      PianoRollConverter.scaled(model.time.begin) + PianoRollConverter.scaled(model.time.duration) / 2
    );
  };
  var updateY22 = (svg) => (model) => {
    updateY_IRSymbolView(svg)(PianoRollConverter.midi2NNBlackCoordinate(model.note));
  };
  var onWindowResized22 = (svg) => (model) => {
    updateX22(svg)(model);
  };
  var onTimeRangeChanged2 = onWindowResized22;
  var setColor = (svg) => (model) => (f) => setColor_IRSymbolView(svg)(f(model.archetype));
  var getIRSymbolLayer = (svg, children, layer) => ({
    svg,
    layer,
    show: children,
    children,
    children_model: children.map((e) => e.model)
  });
  var onAudioUpdate2 = (svg) => {
    svg.setAttribute("transform", `translate(${PianoRollTranslateX.get()})`);
  };
  var setShow = (svg) => (show) => (visible_layers) => {
    show = visible_layers;
    show.forEach((e) => onAudioUpdate2(e.svg));
    svg.replaceChildren(...show.map((e) => e.svg));
  };
  var onChangedLayer = (svg) => (show) => (children) => (value) => {
    const visible_layer = children.filter((e) => value === e.layer);
    setShow(svg)(show)(visible_layer);
  };
  function getIRSymbolSVG(text) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "text");
    svg.textContent = text;
    svg.id = "I-R Symbol";
    svg.style.fontFamily = "Times New Roman";
    svg.style.fontSize = `${ir_analysis_em}em`;
    svg.style.textAnchor = "middle";
    svg.style.visibility = "hidden";
    return svg;
  }
  function getSVGG3(id, children) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.id = id;
    children.forEach((e) => svg.appendChild(e.svg));
    return svg;
  }
  var getParts = (l) => (e) => {
    const model = getIRSymbolModel(e, l);
    const svg = getIRSymbolSVG(model.archetype.symbol);
    updateX22(svg)(model);
    updateY22(svg)(model);
    return { model, svg };
  };
  var getLayers = (e, l) => {
    const parts = e.map(getParts(l));
    const svg = getSVGG3(`layer-${l}`, parts);
    return getIRSymbolLayer(svg, parts, l);
  };
  function buildIRSymbol(h_melodies, controllers) {
    const children = h_melodies.map(getLayers);
    const svg = getSVGG3("implication-realization archetype", children);
    const ir_hierarchy = { svg, children, show: children };
    controllers.hierarchy.addListeners(() => onChangedLayer(ir_hierarchy.svg)(ir_hierarchy.show)(ir_hierarchy.children));
    controllers.window.addListeners(...ir_hierarchy.children.flatMap((e) => e.children).map((e) => () => onWindowResized22(e.svg)(e.model)));
    controllers.time_range.addListeners(...ir_hierarchy.children.flatMap((e) => e.children).map((e) => () => onTimeRangeChanged2(e.svg)(e.model)));
    controllers.melody_color.addListeners(...ir_hierarchy.children.flatMap((e) => e.children).map((e) => () => setColor(e.svg)(e.model)));
    controllers.audio.addListeners(...ir_hierarchy.children.map((e) => () => onAudioUpdate2(e.svg)));
    ir_hierarchy.children.map((e) => onAudioUpdate2(e.svg));
    return ir_hierarchy.svg;
  }
  var deleteMelody = () => {
    console.log("deleteMelody called");
  };
  var _beep_volume = 0;
  var _do_melody_beep = false;
  var _sound_reserved = false;
  var _beepMelody = (model) => {
    const volume = _beep_volume / 400;
    const pitch2 = [440 * Math.pow(2, (model.note - 69) / 12)];
    const begin_sec = model.time.begin - NowAt.get();
    const length_sec = model.time.duration;
    play(pitch2, begin_sec, length_sec, volume);
    _sound_reserved = true;
    setTimeout(() => {
      _sound_reserved = false;
    }, reservation_range * 1e3);
  };
  var beepMelody = (model) => {
    if (!_do_melody_beep) {
      return;
    }
    if (!model.note) {
      return;
    }
    const model_is_in_range = createTime(0, reservation_range).map((e) => e + NowAt.get()).has(model.time.begin);
    if (model_is_in_range) {
      if (_sound_reserved === false) {
        _beepMelody(model);
      }
    }
  };
  var onMelodyBeepCheckChanged_MelodyBeep = (do_melody_beep) => {
    _do_melody_beep = do_melody_beep;
  };
  var onMelodyVolumeBarChanged_MelodyBeep = (beep_volume) => {
    _beep_volume = beep_volume;
  };
  var getMelodyModel = (e) => ({
    time: e.time,
    head: e.head,
    note: e.note,
    melody_analysis: e.melody_analysis,
    archetype: e.melody_analysis.implication_realization
  });
  var updateX_MelodyView = (svg) => (x) => {
    svg.setAttribute("x", String(x));
  };
  var updateY_MelodyView = (svg) => (y) => {
    svg.setAttribute("y", String(y));
  };
  var updateWidth_MelodyView = (svg) => (w) => {
    svg.setAttribute("width", String(w));
  };
  var updateHeight_MelodyView = (svg) => (h) => {
    svg.setAttribute("height", String(h));
  };
  var setColor_MelodyView = (svg) => (color) => svg.setAttribute("fill", "#0d0");
  var updateX3 = (svg) => (model) => {
    updateX_MelodyView(svg)(PianoRollConverter.scaled(model.time.begin));
  };
  var updateY3 = (svg) => (model) => {
    updateY_MelodyView(svg)(PianoRollConverter.midi2NNBlackCoordinate(model.note));
  };
  var updateWidth2 = (svg) => (model) => {
    updateWidth_MelodyView(svg)(31 / 32 * PianoRollConverter.scaled(model.time.duration));
  };
  var updateHeight2 = (svg) => {
    updateHeight_MelodyView(svg)(black_key_height);
  };
  var onWindowResized3 = (svg) => (model) => {
    updateX3(svg)(model);
    updateWidth2(svg)(model);
  };
  var setColor2 = (svg) => (model) => (f) => setColor_MelodyView(svg)(f(model.archetype));
  var onTimeRangeChanged3 = onWindowResized3;
  var beep = (model) => {
    beepMelody(model);
  };
  var onMelodyBeepCheckChanged = (e) => {
    onMelodyBeepCheckChanged_MelodyBeep(e);
  };
  var onMelodyVolumeBarChanged = (e) => {
    onMelodyVolumeBarChanged_MelodyBeep(e);
  };
  var beep_MelodyLayer = (children) => {
    children.forEach((e) => beep(e.model));
  };
  var onAudioUpdate_MelodyLayer = (svg) => {
    svg.setAttribute("transform", `translate(${PianoRollTranslateX.get()})`);
  };
  var onChangedLayer2 = (svg) => (e) => (children) => (value) => {
    e.show = children.filter((e2) => value === e2.layer);
    e.show.forEach((e2) => onAudioUpdate_MelodyLayer(e2.svg));
    svg.replaceChildren(...e.show.map((e2) => e2.svg));
  };
  function getMelodySVG() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    svg.id = "melody-note";
    svg.style.stroke = "rgb(64, 64, 64)";
    svg.onclick = deleteMelody;
    return svg;
  }
  function getSVGG4(id, children) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.id = id;
    children.forEach((e) => svg.appendChild(e.svg));
    return svg;
  }
  var getParts2 = (e) => {
    const model = getMelodyModel(e);
    const svg = getMelodySVG();
    updateX3(svg)(model);
    updateY3(svg)(model);
    updateWidth2(svg)(model);
    updateHeight2(svg);
    return { model, svg };
  };
  var getLayers2 = (e, layer) => {
    const parts = e.map(getParts2);
    const svg = getSVGG4(`layer-${layer}`, parts);
    return { svg, parts, layer };
  };
  function buildMelody(h_melodies, controllers) {
    const layers = h_melodies.map(getLayers2);
    const svg = getSVGG4("melody", layers);
    const melody_hierarchy = { svg, layers, show: layers };
    controllers.window.addListeners(...melody_hierarchy.layers.flatMap((e) => e.parts).map((e) => () => onWindowResized3(e.svg)(e.model)));
    controllers.hierarchy.addListeners(onChangedLayer2(melody_hierarchy.svg)(melody_hierarchy)(melody_hierarchy.layers));
    controllers.time_range.addListeners(...melody_hierarchy.layers.flatMap((e) => e.parts).map((e) => () => onTimeRangeChanged3(e.svg)(e.model)));
    controllers.melody_color.addListeners(...melody_hierarchy.layers.flatMap((e) => e.parts).map((e) => setColor2(e.svg)(e.model)));
    controllers.melody_beep.checkbox.addListeners(...melody_hierarchy.layers.flatMap((e) => e.parts).map((e) => onMelodyBeepCheckChanged));
    controllers.melody_beep.volume.addListeners(...melody_hierarchy.layers.flatMap((e) => e.parts).map((e) => onMelodyVolumeBarChanged));
    controllers.audio.addListeners(...melody_hierarchy.layers.map((e) => () => onAudioUpdate_MelodyLayer(e.svg)));
    controllers.audio.addListeners(...melody_hierarchy.show.map((e) => () => beep_MelodyLayer(e.parts)));
    melody_hierarchy.layers.map((e) => () => onAudioUpdate_MelodyLayer(e.svg));
    melody_hierarchy.show.map((e) => beep_MelodyLayer(e.parts));
    return melody_hierarchy.svg;
  }
  var createReductionModel = (e, layer) => ({
    time: e.time,
    head: e.head,
    archetype: e.melody_analysis.implication_realization,
    layer
  });
  var createReductionViewModel = (model) => {
    let x = PianoRollConverter.scaled(model.time.begin);
    let w = PianoRollConverter.scaled(model.time.duration);
    let cw = PianoRollConverter.scaled(model.head.duration);
    let cx = PianoRollConverter.scaled(model.head.begin) + cw / 2;
    const y = PianoRollConverter.convertToCoordinate(model.layer + 2) * bracket_height;
    const h = black_key_height * bracket_height;
    let strong = false;
    const getViewX = (v) => PianoRollConverter.scaled(v);
    const getViewW = (v) => PianoRollConverter.scaled(v);
    const updateX4 = () => {
      x = getViewX(model.time.begin);
      cx = getViewX(model.head.begin) + getViewW(model.head.duration) / 2;
    };
    const updateWidth3 = () => {
      w = getViewW(model.time.duration);
      cw = getViewW(model.head.duration);
    };
    const onWindowResized42 = () => {
      updateWidth3();
      updateX4();
      return vm;
    };
    const vm = {
      model,
      get y() {
        return y;
      },
      get h() {
        return h;
      },
      get x() {
        return x;
      },
      get w() {
        return w;
      },
      get cx() {
        return cx;
      },
      get cw() {
        return cw;
      },
      get strong() {
        return strong;
      },
      set strong(v) {
        strong = v;
      },
      archetype: model.archetype,
      onWindowResized: onWindowResized42,
      onTimeRangeChanged: onWindowResized42
    };
    return vm;
  };
  var createIRMSymbol = (svg) => ({
    svg,
    update: (cx, y, w, h) => {
      svg.setAttribute("x", String(cx));
      svg.setAttribute("y", String(y));
      svg.setAttribute("fontSize", `${Math.min(w / h, bracket_height)}em`);
    },
    onWindowResized: (model) => {
      svg.setAttribute("x", String(model.cx));
      svg.setAttribute("y", String(model.y));
      svg.setAttribute("fontSize", `${Math.min(model.w / model.h, bracket_height)}em`);
    },
    setColor: (color) => {
      svg.style.fill = color;
    }
  });
  var createBracket = (svg, model) => ({
    svg,
    updateStrong: () => {
      svg.style.strokeWidth = model.strong ? "3" : "1";
    },
    update: (x, y, w, h) => {
      const begin = { x: x + w * 0 / 10 + h * 0 / 2, y: y - h * 0 / 10 };
      const ctrl11 = { x: x + w * 0 / 10 + h * 0 / 2, y: y - h * 6 / 10 };
      const ctrl12 = { x: x + w * 0 / 10 + Math.min(w * 0.1, h * 1 / 2), y: y - h * 10 / 10 };
      const corner1 = { x: x + w * 0 / 10 + Math.min(w * 0.2, h * 2 / 2), y: y - h * 10 / 10 };
      const corner2 = { x: x + w * 10 / 10 - Math.min(w * 0.2, h * 2 / 2), y: y - h * 10 / 10 };
      const ctrl21 = { x: x + w * 10 / 10 - Math.min(w * 0.1, h * 1 / 2), y: y - h * 10 / 10 };
      const ctrl22 = { x: x + w * 10 / 10 - h * 0 / 2, y: y - h * 6 / 10 };
      const end = { x: x + w * 10 / 10 - h * 0 / 2, y: y - h * 0 / 10 };
      svg.setAttribute(
        "d",
        `M${begin.x} ${begin.y}C${ctrl11.x} ${ctrl11.y} ${ctrl12.x} ${ctrl12.y} ${corner1.x} ${corner1.y}L${corner2.x} ${corner2.y}C${ctrl21.x} ${ctrl21.y} ${ctrl22.x} ${ctrl22.y} ${end.x} ${end.y}`
      );
    },
    onWindowResized: (m) => {
      svg.setAttribute("d", "");
      createBracket(svg, m).update(m.x, m.y, m.w, m.h);
    }
  });
  var createDot = (svg, model) => ({
    svg,
    updateStrong: () => {
      svg.style.r = String(model.strong ? 5 : 3);
    },
    update: (cx, cy) => {
      svg.setAttribute("cx", String(cx));
      svg.setAttribute("cy", String(cy));
    },
    onWindowResized: (m) => {
      svg.setAttribute("cx", String(m.cx));
      svg.setAttribute("cy", String(m.y - m.h));
    }
  });
  var createReductionView = (svg, bracket, dot, ir_symbol, model) => {
    const view = {
      svg,
      bracket,
      dot,
      ir_symbol,
      model,
      get strong() {
        return model.strong;
      },
      set strong(value) {
        model.strong = value;
        bracket.updateStrong();
        dot.updateStrong();
      },
      onTimeRangeChanged() {
        view.onWindowResized();
      },
      onWindowResized() {
        const m = model.onWindowResized();
        bracket.onWindowResized(m);
        dot.onWindowResized(m);
        ir_symbol.onWindowResized(m);
      },
      setColor: (color) => {
        svg.style.fill = color;
      }
    };
    return view;
  };
  var createReduction = (model, view) => ({
    model,
    view,
    get svg() {
      return view.svg;
    },
    setColor: (f) => view.setColor(f(model.archetype)),
    renewStrong: (s) => {
      view.strong = s;
    },
    onTimeRangeChanged: () => view.onTimeRangeChanged(),
    onWindowResized: () => view.onWindowResized()
  });
  var createReductionLayer = (svg, children, layer) => {
    const children_model = children.map((e) => e.model);
    const show = children;
    return {
      svg,
      children,
      layer,
      children_model,
      get show() {
        return show;
      },
      renewStrong: (l) => {
        children.forEach((e) => e.renewStrong(l === layer));
      },
      onAudioUpdate: () => {
        svg.setAttribute("transform", `translate(${PianoRollTranslateX.get()})`);
      }
    };
  };
  var createReductionHierarchy = (svg, children) => {
    const hierarchy = {
      svg,
      children,
      _show: [],
      setShow(layers) {
        this._show = layers;
        this._show.forEach((e) => e.onAudioUpdate());
        svg.replaceChildren(...this._show.map((e) => e.svg));
      },
      onChangedLayer(value) {
        const visible = children.filter((e) => value >= e.layer);
        (this._show || []).forEach((e) => e.renewStrong(value));
        visible.forEach((e) => e.renewStrong(value));
        this.setShow(visible);
      }
    };
    return hierarchy;
  };
  function getReductionSVG(bracket, dot, ir_symbol) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.id = "time-span-node";
    svg.appendChild(bracket.svg);
    if (true) {
      svg.appendChild(dot.svg);
    }
    if (false) {
      svg.appendChild(ir_symbol.svg);
    }
    return svg;
  }
  function getIRMSymbolSVG(model) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "text");
    svg.textContent = model.archetype.symbol;
    svg.id = "I-R Symbol";
    svg.style.fontFamily = "Times New Roman";
    svg.style.fontSize = `${bracket_height}em`;
    svg.style.textAnchor = "middle";
    return svg;
  }
  function getBracketSVG() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    svg.id = "group";
    svg.style.stroke = "rgb(0, 0, 64)";
    svg.style.strokeWidth = String(3);
    svg.style.fill = "rgb(242, 242, 242)";
    return svg;
  }
  function getDotSVG() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    svg.id = "head";
    svg.style.stroke = "rgb(192, 0, 0)";
    svg.style.fill = "rgb(192, 0, 0)";
    return svg;
  }
  function getSVGG5(id, children) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.id = id;
    children.forEach((e) => svg.appendChild(e.svg));
    return svg;
  }
  function buildReduction(h_melodies, controllers) {
    const layer = h_melodies.map((e, l) => {
      const parts = e.map((mel) => {
        const model = createReductionModel(mel, l);
        const view_model = createReductionViewModel(model);
        const bracket = createBracket(getBracketSVG(), view_model);
        const dot = createDot(getDotSVG(), view_model);
        const ir_symbol = createIRMSymbol(getIRMSymbolSVG(model));
        const svg3 = getReductionSVG(bracket, dot, ir_symbol);
        const view = createReductionView(svg3, bracket, dot, ir_symbol, view_model);
        return createReduction(model, view);
      });
      const svg2 = getSVGG5(`layer-${l}`, parts);
      return createReductionLayer(svg2, parts, l);
    });
    const svg = getSVGG5("time-span-reduction", layer);
    const time_span_tree = createReductionHierarchy(svg, layer);
    controllers.window.addListeners(...time_span_tree.children.flatMap((e) => e.children).map((e) => e.onWindowResized));
    controllers.hierarchy.addListeners(time_span_tree.onChangedLayer);
    controllers.time_range.addListeners(...time_span_tree.children.flatMap((e) => e.children).map((e) => e.onTimeRangeChanged));
    controllers.melody_color.addListeners(...time_span_tree.children.flatMap((e) => e.children).map((e) => e.setColor));
    controllers.audio.addListeners(...time_span_tree.children.map((e) => e.onAudioUpdate));
    time_span_tree.children.map((e) => e.onAudioUpdate());
    return time_span_tree.svg;
  }
  var getGravityModel = (layer, e, next, gravity) => ({
    ...e,
    next,
    gravity,
    destination: gravity.destination,
    layer: layer || 0
  });
  var getLinePos = (x1, x2, y1, y2) => ({
    x1,
    x2,
    y1,
    y2
  });
  var scaled5 = (e) => (w, h) => getLinePos(
    e.x1 * w,
    e.x2 * w,
    e.y1 * h,
    e.y2 * h
  );
  var updateWidth_GravityView = (svg) => (w) => {
    svg.setAttribute("width", String(w));
  };
  var updateHeight_GravityView = (svg) => (h) => {
    svg.setAttribute("height", String(h));
  };
  var onWindowResized_GravityView = (triangle, line) => (line_pos) => {
    const angle = Math.atan2(line_pos.y2 - line_pos.y1, line_pos.x2 - line_pos.x1) * 180 / Math.PI + 90;
    triangle.setAttribute("transform", `translate(${line_pos.x2},${line_pos.y2}) rotate(${angle})`);
    line.setAttribute("x1", String(line_pos.x1));
    line.setAttribute("x2", String(line_pos.x2));
    line.setAttribute("y1", String(line_pos.y1));
    line.setAttribute("y2", String(line_pos.y2));
  };
  var onWindowResized_Gravity = (svg) => (model) => (triangle, line, line_seed) => {
    updateWidth_GravityView(svg)(PianoRollConverter.scaled(model.time.duration));
    updateHeight_GravityView(svg)(black_key_height);
    onWindowResized_GravityView(triangle, line)(scaled5(line_seed)(NoteSize.get(), 1));
  };
  var onAudioUpdate3 = (svg) => {
    svg.setAttribute("transform", `translate(${PianoRollTranslateX.get()})`);
  };
  var onUpdateGravityVisibility_GravityHierarchy = (svg) => (visible) => {
    svg.style.visibility = visible ? "visible" : "hidden";
  };
  var onChangedLayer_GravityHierarchy = (svg, show, children) => (value) => {
    show = children.filter((e) => value === e.layer);
    show.forEach((e) => onAudioUpdate3(e.svg));
    svg.replaceChildren(...show.map((e) => e.svg));
  };
  function getTriangle() {
    const triangle_width2 = 4;
    const triangle_height2 = 5;
    const triangle_svg = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    triangle_svg.classList.add("triangle");
    triangle_svg.id = "gravity-arrow";
    triangle_svg.style.stroke = "rgb(0, 0, 0)";
    triangle_svg.style.fill = "rgb(0, 0, 0)";
    triangle_svg.style.strokeWidth = String(5);
    triangle_svg.setAttribute("points", [0, 0, -triangle_width2, +triangle_height2, +triangle_width2, +triangle_height2].join(","));
    return triangle_svg;
  }
  function getLine() {
    const line_svg = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line_svg.id = "gravity-arrow";
    line_svg.classList.add("line");
    line_svg.style.stroke = "rgb(0, 0, 0)";
    line_svg.style.strokeWidth = String(5);
    return line_svg;
  }
  function getGravitySVG(triangle, line) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.id = "gravity";
    svg.appendChild(triangle);
    svg.appendChild(line);
    return svg;
  }
  function getLinePos2(e, n, g) {
    const convert = (arg) => [
      (e2) => PianoRollConverter.midi2BlackCoordinate(e2),
      (e2) => 0.5 + e2
    ].reduce((c, f) => f(c), arg);
    const line_pos = getLinePos(
      e.time.begin + e.time.duration / 2,
      n.time.begin,
      isNaN(e.note) ? -99 : convert(e.note),
      isNaN(e.note) ? -99 : convert(g.destination)
    );
    return line_pos;
  }
  function getSVGG6(id, children) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.id = id;
    children.forEach((e) => svg.appendChild(e.svg));
    return svg;
  }
  var getLayers3 = (mode) => (melodies, layer) => {
    const next = melodies.slice(1);
    const children = next.map((n, i) => {
      const e = melodies[i];
      const g = e.melody_analysis[mode];
      if (!g) {
        return;
      }
      const line_seed = getLinePos2(e, n, g);
      const model = getGravityModel(layer, e, n, g);
      const triangle = getTriangle();
      const line = getLine();
      const svg2 = getGravitySVG(triangle, line);
      const view = { svg: svg2, triangle, line };
      return {
        model,
        view,
        line_seed,
        ...view
      };
    }).filter((e) => e !== void 0).map((e) => ({ ...e, ...e.view }));
    const svg = getSVGG6(`layer-${layer}`, children);
    return { layer, svg, children, show: children };
  };
  function buildGravity(mode, h_melodies, controllers) {
    const children = h_melodies.map(getLayers3(mode));
    const svg = getSVGG6(mode, children);
    const gravity_hierarchy = { svg, children, show: children };
    switch (mode) {
      case "chord_gravity":
        controllers.gravity.chord_checkbox.addListeners(() => onUpdateGravityVisibility_GravityHierarchy(gravity_hierarchy.svg));
      case "scale_gravity":
        controllers.gravity.scale_checkbox.addListeners(() => onUpdateGravityVisibility_GravityHierarchy(gravity_hierarchy.svg));
      default:
        ;
    }
    controllers.hierarchy.addListeners(onChangedLayer_GravityHierarchy(gravity_hierarchy.svg, gravity_hierarchy.show, gravity_hierarchy.children));
    controllers.window.addListeners(...gravity_hierarchy.children.flatMap((e) => e.children).map((e) => () => onWindowResized_Gravity(e.svg)(e.model)(e.triangle, e.line, e.line_seed)));
    controllers.time_range.addListeners(...gravity_hierarchy.children.flatMap((e) => e.children).map((e) => () => onWindowResized_Gravity(e.svg)(e.model)(e.triangle, e.line, e.line_seed)));
    controllers.audio.addListeners(...gravity_hierarchy.children.map((e) => () => onAudioUpdate3(e.svg)));
    gravity_hierarchy.children.map((e) => onAudioUpdate3(e.svg));
    return gravity_hierarchy.svg;
  }
  function getLinePos3(e, n) {
    const convert = (arg) => [
      (e2) => e2 - 0.5,
      (e2) => PianoRollConverter.midi2BlackCoordinate(e2)
    ].reduce((c, f) => f(c), arg);
    const line_pos = {
      x1: e.time.begin + e.time.duration / 2,
      x2: n.time.begin + n.time.duration / 2,
      y1: isNaN(e.note) ? -99 : convert(e.note),
      y2: isNaN(n.note) ? -99 : convert(n.note)
    };
    return line_pos;
  }
  var triangle_width = 10;
  var triangle_height = 10;
  function getTriangle2() {
    const triangle_svg = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    triangle_svg.classList.add("triangle");
    triangle_svg.id = "gravity-arrow";
    triangle_svg.style.stroke = "rgb(0, 0, 0)";
    triangle_svg.style.fill = "rgb(0, 0, 0)";
    triangle_svg.style.strokeWidth = String(0);
    triangle_svg.setAttribute("points", [0, 0, -triangle_width, +triangle_height, +triangle_width, +triangle_height].join(","));
    return triangle_svg;
  }
  function getLine2() {
    const line_svg = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line_svg.id = "gravity-arrow";
    line_svg.classList.add("line");
    line_svg.style.stroke = "rgb(0, 0, 0)";
    line_svg.style.strokeWidth = String(5);
    return line_svg;
  }
  function getGravitySVG2(...children) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.id = "gravity";
    children.forEach((e) => svg.appendChild(e));
    return svg;
  }
  function getSVGG7(id, children) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.id = id;
    children.forEach((e) => svg.appendChild(e));
    return svg;
  }
  var getArchetypeColor = (archetype) => {
    switch (archetype.symbol) {
      case "(P)":
      case "P":
        return "rgba(0,0,255,1)";
      case "(IP)":
      case "IP":
        return "rgba(170,0,255,1)";
      case "(VP)":
      case "VP":
        return "rgba(0,170,255,1)";
      case "(R)":
      case "R":
        return "rgba(255,0,0,1)";
      case "(IR)":
      case "IR":
        return "rgba(255,170,0,1)";
      case "(VR)":
      case "VR":
        return "rgba(255,0,170,1)";
      case "(D)":
      case "D":
        return "rgba(0,255,0,1)";
      case "(ID)":
      case "ID":
        return "rgba(0,255,170,1)";
      default:
        "rgba(0,0,0,.25)";
    }
  };
  var xor = (a, b) => !(a && b) && (a || b);
  var eqv = (a, b) => !(a || b) || a && b;
  var sameSign = (a, b) => Math.sign(a) === Math.sign(b);
  var diffSign = (a, b) => Math.sign(a) !== Math.sign(b);
  var isMR = (observed, realized) => {
    const I = Math.abs(observed);
    const R = Math.abs(realized);
    return I + m3 <= R;
  };
  var isML = (observed, realized) => {
    const I = Math.abs(observed);
    const R = Math.abs(realized);
    return R <= I - m3;
  };
  var isMN = (observed, realized) => {
    const I = Math.abs(observed);
    const R = Math.abs(realized);
    return I - m3 < R && R < I + m3;
  };
  var isV = (observed, realized) => {
    return isMR(observed, realized);
  };
  var isB = (observed, realized) => {
    return !isV(observed, realized) && eqv(isMN(observed, realized), sameSign(observed, realized));
  };
  var isR = (observed, realized) => {
    return isV(observed, realized) ? diffSign(observed, realized) : isML(observed, realized);
  };
  var isP = (observed, realized) => {
    return !isR(observed, realized);
  };
  var isAA = (observed) => {
    return Math.abs(observed) < 6;
  };
  var isReconsidered = (observed, realized) => {
    const AA = isAA(observed);
    const is_P = isP(observed, realized);
    return xor(AA, is_P);
  };
  var m3 = 3;
  var getRange2 = (inf, sup, over, sgn, dst) => {
    return {
      inf,
      sup,
      over,
      sgn,
      dst
    };
  };
  var getProspectiveDestination = (observed) => {
    const s = Math.sign(observed);
    const O = Math.abs(observed);
    const L = O - m3;
    const G = O + m3;
    return isAA(observed) ? getRange2(+s * L, +s * G, +s * G, 1, s * O) : getRange2(-s * 0, -s * L, -s * G, -1, O < m3 ? -s * M2 : -s * L / 2);
  };
  var getProspectiveArrow = (layer) => (delayed_melody) => (_, i) => {
    const first = delayed_melody[0][i];
    const second = delayed_melody[1][i];
    const third = delayed_melody[2][i];
    if (!isReconsidered(second.note - first.note, third.note - second.note)) {
      return;
    }
    const implication = getProspectiveDestination(second.note - first.note);
    const line_pos = getLinePos3(
      { time: second.time, note: second.note },
      { time: third.time, note: second.note + implication.dst }
    );
    const model = {
      ...second,
      archetype: second.melody_analysis.implication_realization,
      layer: layer || 0
    };
    const triangle = getTriangle2();
    const line = getLine2();
    const alpha = isReconsidered(second.note - first.note, third.note - second.note) ? 0.25 : 1;
    const color = isAA(second.note - first.note) ? `rgba(0,0,255,${alpha})` : `rgba(255,0,0,${alpha})`;
    triangle.style.stroke = color;
    triangle.style.fill = color;
    line.style.stroke = color;
    line.style.strokeWidth = String(2);
    const svg = getGravitySVG2(triangle, line);
    const view = { svg, triangle, line };
    return { model, view, line_pos };
  };
  var M2 = 2;
  var getRetrospectiveDestination = (observed, realized) => {
    const s = Math.sign(observed);
    const O = Math.abs(observed);
    const L = O - m3;
    const G = O + m3;
    return isP(observed, realized) ? getRange2(+s * L, +s * G, +s * G, 1, s * O) : getRange2(-s * 0, -s * L, -s * G, -1, O < m3 ? -s * M2 : -s * L / 2);
  };
  var getRetrospectiveArrow = (layer) => (delayed_melody) => (_, i) => {
    const first = delayed_melody[0][i];
    const second = delayed_melody[1][i];
    const third = delayed_melody[2][i];
    const implication = getRetrospectiveDestination(second.note - first.note, third.note - second.note);
    const line_pos = getLinePos3(
      { time: second.time, note: second.note },
      { time: third.time, note: second.note + implication.dst }
    );
    const model = {
      ...second,
      archetype: second.melody_analysis.implication_realization,
      layer: layer || 0
    };
    const triangle = getTriangle2();
    const line = getLine2();
    const alpha = isB(second.note - first.note, third.note - second.note) ? 1 : 0.25;
    const color = isP(second.note - first.note, third.note - second.note) ? `rgba(0,0,255,${alpha})` : `rgba(255,0,0,${alpha})`;
    triangle.style.stroke = color;
    triangle.style.fill = color;
    line.style.stroke = color;
    const svg = getGravitySVG2(triangle, line);
    const view = { svg, triangle, line };
    return { model, view, line_pos };
  };
  var getReconstructedArrow = (layer) => (delayed_melody) => (_, i) => {
    const first = delayed_melody[0][i];
    const second = delayed_melody[1][i];
    const third = delayed_melody[2][i];
    const fourth = delayed_melody[3][i];
    const implication = getRetrospectiveDestination(second.note - first.note, third.note - second.note);
    if (isB(second.note - first.note, third.note - second.note)) {
      return;
    }
    const is_V = isV(second.note - first.note, third.note - second.note);
    const IImplication = third?.note + implication.dst;
    const VImplication = third?.note - implication.dst;
    const line_pos = fourth && getLinePos3(
      { time: third.time, note: third.note },
      { time: fourth.time, note: is_V ? VImplication : IImplication }
    );
    const model = {
      ...second,
      archetype: second.melody_analysis.implication_realization,
      layer: layer || 0
    };
    const triangle = getTriangle2();
    const line = getLine2();
    const color = getArchetypeColor(model.archetype) || "rgba(0,0,0,.25)";
    triangle.style.stroke = color;
    triangle.style.fill = color;
    line.style.stroke = color;
    const svg = getGravitySVG2(triangle, line);
    const view = { svg, triangle, line };
    return { model, view, line_pos };
  };
  var getLayers4 = (melodies, layer) => {
    const delayed_melody = melodies.map((_, i) => melodies.slice(i));
    if (delayed_melody.length <= 3) {
      return;
    }
    const prospective = delayed_melody[2].map(getProspectiveArrow(layer)(delayed_melody)).filter((e) => e !== void 0);
    const retrospective = delayed_melody[2].map(getRetrospectiveArrow(layer)(delayed_melody)).filter((e) => e !== void 0);
    const reconstructed = delayed_melody[3].map(getReconstructedArrow(layer)(delayed_melody)).filter((e) => e !== void 0);
    const children = [
      prospective,
      retrospective,
      reconstructed
    ].flat().map((e) => ({ svg: e.view.svg, model: e.model, view: e.view, line_seed: e.line_pos }));
    const svg = getSVGG7(`layer-${layer}`, children.map((e) => e.svg));
    return {
      layer,
      svg,
      children,
      prospective,
      retrospective,
      reconstructed,
      show: children
    };
  };
  var onWindowResized_IRGravity = (e) => {
    e.svg.setAttribute("width", String(PianoRollConverter.scaled(e.model.time.duration)));
    e.svg.setAttribute("height", String(black_key_height));
    const line_pos = { x1: e.line_seed.x1 * NoteSize.get(), x2: e.line_seed.x2 * NoteSize.get(), y1: e.line_seed.y1 * 1, y2: e.line_seed.y2 * 1 };
    const angle = Math.atan2(line_pos.y2 - line_pos.y1, line_pos.x2 - line_pos.x1);
    const marginX = triangle_height * Math.cos(angle);
    const marginY = triangle_height * Math.sin(angle);
    e.view.triangle.setAttribute("transform", `translate(${line_pos.x2},${line_pos.y2}) rotate(${angle * 180 / Math.PI + 90})`);
    e.view.line.setAttribute("x1", String(line_pos.x1));
    e.view.line.setAttribute("y1", String(line_pos.y1));
    e.view.line.setAttribute("x2", String(line_pos.x2 - marginX));
    e.view.line.setAttribute("y2", String(line_pos.y2 - marginY));
  };
  var onAudioUpdate4 = (svg) => {
    svg.setAttribute("transform", `translate(${PianoRollTranslateX.get()})`);
  };
  var onChangedLayer3 = (ir_gravity) => (value) => {
    ir_gravity.show = ir_gravity.children.filter((e) => value === e.layer);
    ir_gravity.show.forEach((e) => onAudioUpdate4(e.svg));
    ir_gravity.svg.replaceChildren(...ir_gravity.show.map((e) => e.svg));
  };
  function buildIRGravity(h_melodies, controllers) {
    const children = h_melodies.map(getLayers4).filter((e) => e !== void 0);
    const svg = getSVGG7("ir_gravity", children.map((e) => e.svg));
    const ir_gravity = { svg, children, show: [] };
    controllers.window.addListeners(...ir_gravity.children.flatMap((e) => e.children).map((e) => () => onWindowResized_IRGravity(e)));
    controllers.time_range.addListeners(...ir_gravity.children.flatMap((e) => e.children).map((e) => () => onWindowResized_IRGravity(e)));
    controllers.implication.prospective_checkbox.addListeners(...ir_gravity.children.flatMap((e) => e.prospective).flatMap((e) => (value) => e.view.svg.setAttribute("visibility", value ? "visible" : "hidden")));
    controllers.implication.retrospective_checkbox.addListeners(...ir_gravity.children.flatMap((e) => e.retrospective).flatMap((e) => (value) => e.view.svg.setAttribute("visibility", value ? "visible" : "hidden")));
    controllers.implication.reconstructed_checkbox.addListeners(...ir_gravity.children.flatMap((e) => e.reconstructed).flatMap((e) => (value) => e.view.svg.setAttribute("visibility", value ? "visible" : "hidden")));
    controllers.hierarchy.addListeners(onChangedLayer3(ir_gravity));
    controllers.melody_color.addListeners(...ir_gravity.children.flatMap((e) => e.children).map((e) => (f) => e.svg.style.fill = f(e.model.archetype)));
    controllers.audio.addListeners(...ir_gravity.children.map((e) => () => onAudioUpdate4(e.svg)));
    ir_gravity.children.map((e) => onAudioUpdate4(e.svg));
    return ir_gravity.svg;
  }
  function createMelodyElements(hierarchical_melody, d_melodies, controllers) {
    const d_melody_collection = buildDMelody(d_melodies, controllers);
    const melody_hierarchy = buildMelody(hierarchical_melody, controllers);
    const ir_hierarchy = buildIRSymbol(hierarchical_melody, controllers);
    const ir_plot_svg = buildIRPlot(hierarchical_melody, controllers);
    const ir_gravity = buildIRGravity(hierarchical_melody, controllers);
    const chord_gravities = buildGravity("chord_gravity", hierarchical_melody, controllers);
    const scale_gravities = buildGravity("scale_gravity", hierarchical_melody, controllers);
    const time_span_tree = buildReduction(hierarchical_melody, controllers);
    const children = [
      d_melody_collection,
      melody_hierarchy,
      ir_hierarchy,
      ir_plot_svg,
      chord_gravities,
      scale_gravities,
      time_span_tree
    ];
    return {
      children,
      d_melody_collection,
      melody_hierarchy,
      ir_hierarchy,
      ir_plot_svg,
      ir_gravity,
      chord_gravities,
      scale_gravities,
      time_span_tree
    };
  }

  // ../../packages/UI/piano-roll/piano-roll/dist/index.mjs
  function createMusicStructureElements(beat_info, romans, hierarchical_melody, melodies, d_melodies, controllers) {
    const beat = createBeatElements(beat_info, melodies, controllers);
    const chord = createChordElements(romans, controllers);
    const melody = createMelodyElements(hierarchical_melody, d_melodies, controllers);
    return { beat, chord, melody };
  }
  function createAnalysisView(analysis) {
    const { beat, chord, melody } = analysis;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.appendChild(chord.chord_notes);
    svg.appendChild(chord.chord_names);
    svg.appendChild(chord.chord_romans);
    svg.appendChild(chord.chord_keys);
    svg.appendChild(melody.d_melody_collection);
    svg.appendChild(melody.melody_hierarchy);
    svg.appendChild(melody.ir_hierarchy);
    svg.appendChild(melody.ir_gravity);
    svg.appendChild(melody.chord_gravities);
    svg.appendChild(melody.scale_gravities);
    svg.appendChild(melody.time_span_tree);
    return { svg };
  }
  var createCurrentTimeLine = (visible, window_registry) => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "line");
    svg.id = "current_time";
    svg.style.strokeWidth = String(5);
    svg.style.stroke = "rgb(0, 0, 0)";
    svg.style.visibility = visible ? "visible" : "hidden";
    const onWindowResized23 = () => {
      svg.setAttribute("x1", `${CurrentTimeX.get()}`);
      svg.setAttribute("x2", `${CurrentTimeX.get()}`);
      svg.setAttribute("y1", "0");
      svg.setAttribute("y2", `${PianoRollHeight.get()}`);
    };
    window_registry.addListeners(onWindowResized23);
    return { svg };
  };
  var createRectangleView = (svg) => ({
    svg,
    setX: (x) => svg.setAttribute("x", String(x)),
    setY: (y) => svg.setAttribute("y", String(y)),
    setW: (w) => svg.setAttribute("width", String(w)),
    setH: (h) => svg.setAttribute("height", String(h))
  });
  var createRectangleModel = (y, w, h) => ({
    y,
    w,
    h,
    x: 0
  });
  var createRectangle = (model, view) => ({
    model,
    view,
    svg: view.svg
  });
  var bg_height = octave_height / 12;
  var createBG = (svg, i) => {
    const y = PianoRollConverter.midi2BlackCoordinate(i);
    const model = createRectangleModel(y, 1, bg_height);
    const view = createRectangleView(svg);
    const base = createRectangle(model, view);
    const onWindowResized23 = () => {
      view.setX(model.x);
      view.setY(model.y);
      view.setW(PianoRollWidth.get());
      view.setH(model.h);
    };
    return { ...base, onWindowResized: onWindowResized23 };
  };
  var isBlack = (i) => mod(i * 5 - 2, 12) < 5;
  var createBGs = (publisher) => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.id = `BGs`;
    const children = getRange(
      PianoRollBegin.get(),
      PianoRollEnd.get(),
      PianoRollBegin.get() < PianoRollEnd.get() ? 1 : -1
    ).map((i) => {
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.id = `BG-${i}`;
      rect.style.fill = isBlack(i) ? "rgb(192, 192, 192)" : "rgb(242, 242, 242)";
      rect.style.stroke = "rgb(0, 0, 0)";
      return createBG(rect, i);
    });
    children.forEach((e) => svg.appendChild(e.svg));
    const onWindowResized23 = () => children.forEach((c) => c.onWindowResized());
    publisher.addListeners(onWindowResized23);
    return { svg, children };
  };
  var key_width = 36;
  var black_key_width = key_width * 2 / 3;
  var white_key_width = key_width;
  var white_key_height = octave_height / 7;
  var createKey = (svg, i) => {
    const y = isBlack(i) ? PianoRollConverter.midi2BlackCoordinate(i) : [i].map((e) => PianoRollConverter.transposed(e)).map((e) => e + 1).map((e) => PianoRollConverter.convertToCoordinate(e)).map((e) => e + white_key_height).map((e) => e - mod(i, 12) * 2).map((e) => e + (mod(i, 12) > 4 ? 12 : 0)).map((e) => -e)[0];
    const model = createRectangleModel(
      y,
      isBlack(i) ? black_key_width : white_key_width,
      isBlack(i) ? black_key_height : white_key_height
    );
    const view = createRectangleView(svg);
    const base = createRectangle(model, view);
    return { ...base, isBlack: isBlack(i) };
  };
  var createKeys = () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.id = "keys";
    const sgn = PianoRollBegin.get() < PianoRollEnd.get() ? 1 : -1;
    const keys = getRange(
      PianoRollBegin.get() - sgn,
      PianoRollEnd.get() + sgn * 2,
      sgn
    ).map((i) => {
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.id = `key-${i}`;
      rect.style.fill = isBlack(i) ? "rgb(64, 64, 64)" : "rgb(255, 255, 255)";
      rect.style.stroke = "rgb(0, 0, 0)";
      return createKey(rect, i);
    });
    const children = [
      keys.filter((e) => !e.isBlack),
      keys.filter((e) => e.isBlack)
    ].flat();
    children.forEach((e) => svg.appendChild(e.svg));
    return { svg, children };
  };
  var appendChildren = (svg) => (...children) => {
    children.forEach((e) => svg.appendChild(e));
  };
  var onWindowResized4 = (svg) => () => {
    svg.setAttribute("x", String(0));
    svg.setAttribute("y", String(0));
    svg.setAttribute("width", String(PianoRollWidth.get()));
    svg.setAttribute("height", String(PianoRollHeight.get() + chord_text_size * 2 + chord_name_margin));
  };
  function createPianoRoll(analyzed, window2, show_current_time_line) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.id = "piano-roll";
    appendChildren(svg)(
      createBGs(window2).svg,
      createAnalysisView(analyzed).svg,
      createKeys().svg,
      createCurrentTimeLine(show_current_time_line, window2).svg
    );
    window2.addListeners(onWindowResized4(svg));
    return { svg };
  }

  // ../../packages/cognitive-theory-of-music/irm/dist/index.mjs
  var _sgn = (x) => x < 0 ? -1 : x && 1;
  var _abs = (x) => x < 0 ? -x : x;
  var M3 = get5("M3");
  var m32 = get5("m3");
  var getRegistralReturnForm = (notes) => {
    if (notes.length !== 3) {
      throw new Error(`Invalid argument length. Required 3 arguments but given was ${notes.length} notes: ${JSON.stringify(notes)}`);
    }
    if (get6(notes[0]) === get6("")) {
      const return_degree2 = "";
      return { is_null: true, return_degree: return_degree2 };
    }
    const return_degree = distance4(notes[0], notes[2]);
    const dir1 = Math.sign(
      semitones(distance4(notes[0], notes[1]))
    );
    const dir2 = Math.sign(
      semitones(distance4(notes[1], notes[2]))
    );
    const is_null = dir1 === dir2;
    return { is_null, return_degree };
  };
  var NULL_REGISTRAL_RETURN_FORM = getRegistralReturnForm(["", "", ""]);
  var getDirection = (name, value) => {
    if (name === "mL") {
      return { name, value, closure_degree: 1 };
    }
    if (name === "mN") {
      return { name, value, closure_degree: 0 };
    }
    if (name === "mR") {
      return { name, value, closure_degree: -1 };
    }
    throw new Error(`from getDirection: invalid direction name (${name}) reserved`);
  };
  var getMagnitude = (name, value) => {
    if (name === "AA") {
      return { name, value, closure_degree: 1 };
    }
    if (name === "AB") {
      return { name, value, closure_degree: 2 };
    }
    throw new Error(`from getMagnitude: invalid magnitude name (${name}) reserved`);
  };
  var getMotion = (dir, mgn) => ({
    direction: dir,
    magnitude: mgn,
    closure: dir.name === "mL" && mgn.name === "AB" ? 1 : 0
  });
  var getIntervallicMotion = (prev, curr) => {
    const dir_map = ["mL", "mN", "mR"];
    const pd = _sgn(prev.semitones);
    const cd = _sgn(curr.semitones);
    const C = (cd - pd ? m32 : M3).semitones;
    const p = _abs(prev.semitones);
    const c = _abs(curr.semitones);
    const d = c - p;
    const sgn = d < 0 ? -1 : d && 1;
    const abs = d < 0 ? -d : d;
    return getMotion(
      getDirection(dir_map[sgn + 1], sgn),
      getMagnitude(abs < C ? "AA" : "AB", abs)
    );
  };
  var getRegistralMotion = (prev, curr) => {
    const dir_map = ["mL", "mN", "mR"];
    const mgn_map = ["AB", "AA", "AA"];
    const p = _sgn(prev.semitones);
    const c = _sgn(curr.semitones);
    const d = c - p;
    const sgn = d ? -1 : p && 1;
    const abs = d ? -1 : p && 1;
    return getMotion(
      getDirection(dir_map[sgn + 1], sgn),
      getMagnitude(mgn_map[abs + 1], abs)
    );
  };
  var retrospectiveSymbol = (symbol) => {
    switch (symbol) {
      case "P":
        return "(P)";
      case "IP":
        return "(IP)";
      case "VP":
        return "(VP)";
      case "R":
        return "(R)";
      case "IR":
        return "(IR)";
      case "VR":
        return "(VR)";
      case "D":
        return "(D)";
      case "ID":
        return "(ID)";
      default:
        throw new Error(`Illegal symbol given.
Expected symbol: P, IP, VP, R, IR, VR, D, ID
 Given symbol:${symbol}`);
    }
  };
  var getReverse = (I, V) => {
    if (I !== "mL") {
      return "VR";
    } else if (V !== "mL") {
      return "IR";
    } else {
      return "R";
    }
  };
  var getDuplication = (V) => {
    if (V !== "mN") {
      return "ID";
    } else {
      return "D";
    }
  };
  var getProcessLike = (I, V) => {
    if (V === "mR") {
      return "P";
    } else if (I === "mN") {
      return getDuplication(V);
    } else {
      return "IP";
    }
  };
  var getTriadArchetypeSymbol = (Id, Im, V) => {
    if (Im === "AA") {
      return getProcessLike(Id, V);
    } else if (V === "mL") {
      return getReverse(Id, V);
    } else if (Id === "mL") {
      return "IR";
    } else {
      return "VP";
    }
  };
  var getTriadArchetype = (prev, curr, next) => {
    const notes = [prev || "", curr || "", next || ""];
    const intervals = [distance4(prev, curr), distance4(curr, next)];
    const initial = get5(intervals[0]);
    const follow = get5(intervals[1]);
    const registral = getRegistralMotion(initial, follow);
    const intervallic = getIntervallicMotion(initial, follow);
    const registral_return_form = getRegistralReturnForm(notes);
    const symbol = getTriadArchetypeSymbol(
      intervallic.direction.name,
      intervallic.magnitude.name,
      registral.direction.name
    );
    return {
      notes,
      intervals,
      registral,
      intervallic,
      registral_return_form,
      symbol
    };
  };
  var isRetrospective = (archetype) => {
    const initial = get5(archetype.intervals[0]);
    const init_mgn = Math.abs(initial.num) < 5 ? "aa" : "ab";
    switch (archetype.symbol) {
      case "R":
      case "IR":
      case "VR":
        return init_mgn === "aa";
      default:
        return init_mgn === "ab";
    }
  };
  var getTriad = (prev, curr, next) => {
    const archetype = getTriadArchetype(prev, curr, next);
    const { intervals, registral, intervallic, registral_return_form } = archetype;
    const retrospective = isRetrospective(archetype);
    return {
      length: 3,
      notes: [prev || "", curr || "", next || ""],
      archetype,
      intervals,
      registral,
      intervallic,
      registral_return_form,
      retrospective,
      symbol: retrospective ? retrospectiveSymbol(archetype.symbol) : archetype.symbol
    };
  };
  var getDyad = (prev, curr) => ({
    length: 2,
    symbol: "Dyad",
    notes: [prev, curr],
    intervals: [distance4(prev, curr)]
  });
  var getMonad = (note4) => ({
    length: 1,
    symbol: "M",
    notes: [note4]
  });
  var getNull_ad = () => ({
    length: 0,
    symbol: "",
    notes: []
  });
  var get_grb_on_parametric_scale = (archetype) => {
    const s = archetype.intervallic?.direction.name === "mL" ? -1 : 0;
    const v = archetype.intervallic?.direction.name === "mR" ? -1 : 0;
    const scale2 = archetype.intervallic?.magnitude.name === "AA" ? 0.25 : 0.5;
    const B = 120;
    switch (archetype.registral?.direction.name) {
      case "mL":
        return hsv2rgb(-120 + B, 1 + s * scale2, 1 + v * scale2);
      case "mN":
        return hsv2rgb(0 + B, 1 + s * scale2, 1 + v * scale2);
      case "mR":
        return hsv2rgb(120 + B, 1 + s * scale2, 1 + v * scale2);
    }
    return [64, 64, 64];
  };
  function get_color_on_parametric_scale(archetype) {
    if (archetype.symbol === "Dyad" || archetype.symbol === "M" || archetype.symbol === "") {
      return "rgb(64,64,64)";
    }
    return rgbToString(get_grb_on_parametric_scale(archetype));
  }
  var get_color_on_digital_intervallic_scale = (archetype) => {
    switch (archetype.symbol) {
      case "VP":
      case "(VP)":
        return "rgb(0, 0, 255)";
      case "P":
      case "(P)":
        return "rgb(0, 255, 0)";
      case "D":
      case "(D)":
        return "rgb(0, 255, 0)";
      case "IR":
      case "(IR)":
        return "rgb(255, 0, 0)";
      case "VR":
      case "(VR)":
        return "rgb(0, 0, 255)";
      case "IP":
      case "(IP)":
        return "rgb(0, 255, 0)";
      case "ID":
      case "(ID)":
        return "rgb(0, 255, 0)";
      case "R":
      case "(R)":
        return "rgb(255, 0, 0)";
      default:
        return "rgb(64, 64, 64)";
    }
  };
  var get_color_on_digital_parametric_scale = (archetype) => {
    switch (archetype.symbol) {
      case "VP":
      case "(VP)":
        return "rgb(0, 160, 255)";
      case "P":
      case "(P)":
        return "rgb(0, 0, 255)";
      case "D":
      case "(D)":
        return "rgb(0, 0, 255)";
      case "IR":
      case "(IR)":
        return "rgb(160, 0, 255)";
      case "VR":
      case "(VR)":
        return "rgb(0, 224, 0)";
      case "IP":
      case "(IP)":
        return "rgb(255, 160, 0)";
      case "ID":
      case "(ID)":
        return "rgb(255, 160, 0)";
      case "R":
      case "(R)":
        return "rgb(255, 0, 0)";
      default:
        return "rgb(64, 64, 64)";
    }
  };
  var get_color_of_implication_realization = (archetype) => {
    switch (archetype.symbol) {
      case "D":
        return "rgb(0,240,0)";
      case "ID":
        return "rgb(0, 0, 255)";
      case "VP":
        return "rgb(255, 0, 0)";
      case "P":
        return "rgb(0,240,0)";
      case "IP":
        return "rgb(0, 0, 255)";
      case "VR":
        return "rgb(255, 0, 0)";
      case "R":
        return "rgb(0,240,0)";
      case "IR":
        return "rgb(0, 0, 255)";
      case "(D)":
        return "rgb(0, 0, 0)";
      case "(ID)":
        return "rgb(255, 0, 0)";
      case "(VP)":
        return "rgb(0, 0, 0)";
      case "(P)":
        return "rgb(0, 0, 0)";
      case "(IP)":
        return "rgb(255, 0, 0)";
      case "(VR)":
        return "rgb(0, 0, 0)";
      case "(R)":
        return "rgb(0, 0, 0)";
      case "(IR)":
        return "rgb(255, 0, 0)";
      default:
        return "rgb(64, 64, 64)";
    }
  };
  var get_rgb_on_intervallic_angle = (n0, n1, n2) => {
    const intervals = [
      distance4(n0, n1),
      distance4(n1, n2)
    ].map((e) => get5(e).semitones);
    const dist = ((p) => Math.tanh(p[0] * p[0] + p[1] * p[1]))(intervals) || 0;
    const angle = Math.atan2(intervals[1], intervals[0]) || 0;
    return hsv2rgb(angle * 360 / Math.PI, 1, dist);
  };
  var _get_color_on_intervallic_angle = (n0, n1, n2) => rgbToString(
    get_rgb_on_intervallic_angle(n0 || "", n1 || "", n2 || "")
  );
  var get_color_on_intervallic_angle = (archetype) => _get_color_on_intervallic_angle(archetype.notes[0], archetype.notes[1], archetype.notes[2]);
  var get_color_of_Narmour_concept = (archetype) => {
    switch (archetype.symbol) {
      case "VP":
      case "(VP)":
        return "rgb(0, 160, 255)";
      case "P":
      case "(P)":
        return "rgb(0, 0, 255)";
      case "IP":
      case "(IP)":
        return "rgb(160, 0, 255)";
      case "VR":
      case "(VR)":
        return "rgb(255, 0, 160)";
      case "R":
      case "(R)":
        return "rgb(255, 0, 0)";
      case "IR":
      case "(IR)":
        return "rgb(255, 160, 0)";
      case "D":
      case "(D)":
        return "rgb(0, 242, 0)";
      case "ID":
      case "(ID)":
        return "rgb(0, 255, 160)";
      default:
        return "rgb(64, 64, 64)";
    }
  };
  var get_color_on_registral_scale = (archetype) => {
    switch (archetype.symbol) {
      case "VP":
      case "(VP)":
        return "rgb(0, 0, 255)";
      case "P":
      case "(P)":
        return "rgb(0, 0, 255)";
      case "D":
      case "(D)":
        return "rgb(0, 0, 255)";
      case "IR":
      case "(IR)":
        return "rgb(0, 0, 255)";
      case "VR":
      case "(VR)":
        return "rgb(255, 0, 0)";
      case "IP":
      case "(IP)":
        return "rgb(255, 0, 0)";
      case "ID":
      case "(ID)":
        return "rgb(255, 0, 0)";
      case "R":
      case "(R)":
        return "rgb(255, 0, 0)";
      default:
        return "rgb(64, 64, 64)";
    }
  };

  // ../../packages/music-structure/melody/melody-analyze/dist/index.mjs
  var createSerializedGravity = (destination, resolved) => ({ destination, resolved });
  var cloneSerializedGravity = (e) => createSerializedGravity(e.destination, e.resolved);
  var registerGravity = (pitch_class_set, curr, next) => {
    if (!pitch_class_set) {
      return void 0;
    }
    const name = pitch_class_set.name;
    const tonic = get6(pitch_class_set.tonic || "").chroma;
    if (curr === void 0) {
      return void 0;
    }
    const chroma3 = mod(curr - tonic - (name.includes("major") ? 0 : 3), 12);
    const destination = chroma3 === 11 ? curr + 1 : chroma3 === 5 ? curr - 1 : void 0;
    if (destination === void 0) {
      return void 0;
    }
    return createSerializedGravity(
      destination,
      destination && next === destination || void 0
    );
  };
  var createSerializedMelodyAnalysis = (scale_gravity, chord_gravity, implication_realization) => ({
    scale_gravity: scale_gravity && cloneSerializedGravity(scale_gravity),
    chord_gravity: chord_gravity && cloneSerializedGravity(chord_gravity),
    implication_realization
  });
  var cloneSerializedMelodyAnalysis = (e) => createSerializedMelodyAnalysis(e.scale_gravity, e.chord_gravity, e.implication_realization);
  var createSerializedTimeAndAnalyzedMelody = (time, head, note4, melody_analysis) => ({
    time: createTime(time),
    head: createTime(head),
    note: note4,
    melody_analysis: cloneSerializedMelodyAnalysis(melody_analysis)
  });
  var createTimeAndMelody = (time, head, note4) => ({
    time: createTime(time),
    head: createTime(head),
    note: note4
  });
  var getSome_ad = (prev, curr, next) => {
    const [p, c, n] = [prev, curr, next].map((e) => e ? fromMidi(e) : void 0);
    if (c !== void 0) {
      if (p !== void 0) {
        if (n !== void 0) {
          return getTriad(p, c, n);
        } else {
          return getDyad(p, c);
        }
      } else if (n !== void 0) {
        return getDyad(c, n);
      } else {
        return getMonad(c);
      }
    } else if (p !== void 0) {
      return getMonad(p);
    } else if (n !== void 0) {
      return getMonad(n);
    } else {
      return getNull_ad();
    }
  };
  var analyzeMelody = (melodies, romans) => {
    const prev = [void 0, ...melodies];
    const curr = [...melodies];
    const next = [...melodies.slice(1), void 0];
    return curr.map((e, i) => {
      const roman = romans.find((roman2) => roman2.time.begin <= e.time.end && e.time.begin < roman2.time.end);
      const time_and_melody = createTimeAndMelody(
        e.time,
        e.head,
        e.note
      );
      const melody_analysis = createSerializedMelodyAnalysis(
        registerGravity(roman && get8(roman.scale), prev[i]?.note, curr[i]?.note),
        registerGravity(roman && get4(roman.chord), prev[i]?.note, curr[i]?.note),
        getSome_ad(prev[i]?.note, curr[i]?.note, next[i]?.note)
      );
      return createSerializedTimeAndAnalyzedMelody(
        time_and_melody.time,
        time_and_melody.head,
        time_and_melody.note,
        melody_analysis
      );
    }).filter((e) => isNaN(0 * e.note) === false);
  };

  // ../../packages/music-structure/melody/melody-hierarchical-analysis/dist/index.mjs
  var getTime = (matrix, left, right) => createTime(
    matrix[left.measure][left.note].leftend,
    matrix[right.measure][right.note].rightend
  );
  var calcChroma = (pitch2) => 12 + pitch2.octave * 12 + (pitch2.alter || 0) + chroma(pitch2.step);
  var getTimeAndMelody = (element, matrix, musicxml) => {
    const leftend = element.getLeftEnd();
    const rightend = element.getRightEnd();
    const note4 = musicxml["score-partwise"].part.measure.find((e) => e.number === element.measure).note;
    const pitch2 = Array.isArray(note4) ? note4[element.note - 1].pitch : note4.pitch;
    return createTimeAndMelody(
      getTime(matrix, leftend, rightend),
      getTime(matrix, element, element),
      pitch2 ? calcChroma(pitch2) : NaN
    );
  };
  var createSerializedTimeAndAnalyzedMelodyAndIR = (e, IR) => ({
    time: e.time,
    head: e.head,
    note: e.note,
    melody_analysis: e.melody_analysis,
    IR
  });
  var appendIR = (e) => createSerializedTimeAndAnalyzedMelodyAndIR(
    e,
    e.melody_analysis.implication_realization.symbol
  );
  var analyzeAndScaleMelody = (measure, matrix, musicxml) => (element) => {
    const w = measure / 8;
    const b = 0;
    const e = getTimeAndMelody(element, matrix, musicxml);
    const time = e.time.map((e2) => e2 * w + b);
    const head = e.head.map((e2) => e2 * w + b);
    return createTimeAndMelody(
      time,
      head,
      e.note
    );
  };
  var getMapOntToHierarchicalMelodyFromLayer = (measure, reduction, matrix, musicxml, roman) => (_, layer) => {
    const melodies = reduction.getArrayOfLayer(layer).map(analyzeAndScaleMelody(measure, matrix, musicxml));
    return analyzeMelody(melodies, roman).map((e) => appendIR(e));
  };
  var getHierarchicalMelody = (measure, reduction, matrix, musicxml, roman) => {
    return [...Array(reduction.getDepthCount())].map(getMapOntToHierarchicalMelodyFromLayer(measure, reduction, matrix, musicxml, roman));
  };

  // ../../packages/UI/controllers/dist/index.mjs
  function createControllerView(type, id, label) {
    const input = document.createElement("input");
    input.type = type;
    input.id = id;
    input.name = id;
    const labelElement = document.createElement("label");
    labelElement.textContent = label;
    labelElement.htmlFor = input.id;
    labelElement.style.whiteSpace = "nowrap";
    const body = document.createElement("span");
    body.style.whiteSpace = "nowrap";
    body.appendChild(labelElement);
    body.appendChild(input);
    return { body, input, label: labelElement };
  }
  var createIRMColorSelector = (id, text, getColor5) => {
    const { body, input } = createControllerView("radio", id, text);
    const listeners = [];
    const update = () => {
      if (input.checked) {
        listeners.forEach((setColor3) => setColor3((triad) => getColor5(triad)));
      }
    };
    input.addEventListener("input", update);
    const addListeners = (...ls) => {
      listeners.push(...ls);
      update();
    };
    return { body, input, addListeners, getColor: getColor5 };
  };
  var createMelodyColorSelector = () => {
    const children = [
      createIRMColorSelector("Narmour_concept", "Narmour concept color", get_color_of_Narmour_concept),
      createIRMColorSelector(
        "implication_realization",
        "implication realization",
        get_color_of_implication_realization
      ),
      createIRMColorSelector(
        "digital_parametric_scale",
        "digital parametric scale color",
        get_color_on_digital_parametric_scale
      ),
      createIRMColorSelector(
        "digital_intervallic_scale",
        "digital intervallic scale color",
        get_color_on_digital_intervallic_scale
      ),
      createIRMColorSelector("registral_scale", "registral scale color", get_color_on_registral_scale),
      createIRMColorSelector("intervallic_angle", "intervallic angle color", get_color_on_intervallic_angle),
      createIRMColorSelector("analog_parametric_scale", "analog parametric scale color", get_color_on_parametric_scale)
    ];
    children.forEach((c) => {
      c.input.name = "melody-color-selector";
    });
    const body = document.createElement("div");
    body.id = "melody_color_selector";
    children.forEach((c) => body.appendChild(c.body));
    const defaultSelector = children[0];
    if (defaultSelector) {
      defaultSelector.input.checked = true;
    }
    const addListeners = (...listeners) => {
      children.forEach((c) => c.addListeners(...listeners));
      defaultSelector && defaultSelector.input.dispatchEvent(new Event("input"));
    };
    return { body, addListeners };
  };
  var createMelodyColorController = () => {
    const selector = createMelodyColorSelector();
    const view = document.createElement("div");
    view.id = "melody-color-selector";
    view.style.display = "inline";
    view.appendChild(selector.body);
    return {
      view,
      selector,
      addListeners: (...ls) => selector.addListeners(...ls)
    };
  };
  var createCheckbox = (id, label) => {
    const { body, input } = createControllerView("checkbox", id, label);
    const listeners = [];
    const update = () => {
      listeners.forEach((e) => e(input.checked));
    };
    input.checked = false;
    input.addEventListener("input", update);
    const addListeners = (...ls) => {
      listeners.push(...ls);
      update();
    };
    return { body, input, addListeners };
  };
  var createDMelodyController = () => {
    const checkbox = createCheckbox("d_melody_switcher", "detected melody before fix");
    const view = document.createElement("div");
    view.id = "d-melody";
    view.appendChild(checkbox.body);
    return {
      view,
      checkbox,
      addListeners: (...ls) => checkbox.addListeners(...ls)
    };
  };
  var createImplicationDisplayController = () => {
    const prospective_checkbox = createCheckbox("prospective_checkbox", "prospective implication");
    const retrospective_checkbox = createCheckbox("retrospective_checkbox", "retrospective implication");
    const reconstructed_checkbox = createCheckbox("reconstructed_checkbox", "reconstructed implication");
    const view = document.createElement("div");
    view.id = "prospective-implication";
    view.appendChild(prospective_checkbox.body);
    view.appendChild(retrospective_checkbox.body);
    view.appendChild(reconstructed_checkbox.body);
    return {
      view,
      prospective_checkbox,
      retrospective_checkbox,
      reconstructed_checkbox
    };
  };
  var createGravityController = (visible) => {
    const chord_gravity_switcher = createCheckbox("chord_gravity_switcher", "Chord Gravity");
    const scale_gravity_switcher = createCheckbox("scale_gravity_switcher", "Scale Gravity");
    const view = document.createElement("div");
    view.id = "gravity-switcher";
    view.style = visible ? "visible" : "hidden";
    view.appendChild(scale_gravity_switcher.body);
    view.appendChild(chord_gravity_switcher.body);
    return {
      view,
      chord_checkbox: chord_gravity_switcher,
      scale_checkbox: scale_gravity_switcher
    };
  };
  var createSlider = (ops) => {
    const view = createControllerView("range", ops.id, ops.label);
    const { body, input } = view;
    const display = document.createElement("span");
    body.appendChild(display);
    input.min = String(ops.min);
    input.max = String(ops.max);
    input.step = String(ops.step);
    if (ops.value !== void 0) input.value = String(ops.value);
    const listeners = [];
    const updateDisplay = () => ops.updateDisplay(input, display);
    const update = () => {
      const value = ops.getValue(input);
      listeners.forEach((e) => e(value));
    };
    input.addEventListener("input", () => {
      updateDisplay();
      update();
    });
    updateDisplay();
    update();
    return {
      body,
      input,
      display,
      addListeners: (...ls) => {
        listeners.push(...ls);
        update();
      },
      updateDisplay
    };
  };
  var createHierarchyLevel = () => {
    const slider = createSlider({
      id: "hierarchy_level_slider",
      label: "Melody Hierarchy Level",
      min: 0,
      max: 1,
      step: 1,
      updateDisplay: (input, display) => {
        display.textContent = `layer: ${input.value}`;
      },
      getValue: (input) => Number(input.value)
    });
    const setHierarchyLevelSliderValues = (max) => {
      slider.input.max = String(max);
      slider.input.value = String(max);
      slider.updateDisplay();
    };
    return { ...slider, setHierarchyLevelSliderValues };
  };
  var createHierarchyLevelController = (layer_count) => {
    const slider = createHierarchyLevel();
    const view = document.createElement("div");
    view.id = "hierarchy-level";
    view.appendChild(slider.body);
    slider.setHierarchyLevelSliderValues(layer_count);
    return {
      view,
      slider,
      addListeners: (...ls) => slider.addListeners(...ls)
    };
  };
  var createTimeRangeSlider = () => createSlider({
    id: "time_range_slider",
    label: "Time Range",
    min: 1,
    max: 10,
    step: 0.1,
    value: 10,
    updateDisplay: (input, display) => {
      const ratio = Math.pow(2, Number(input.value) - Number(input.max));
      display.textContent = `${Math.floor(ratio * 100)} %`;
    },
    getValue: (input) => {
      const ratio = Math.pow(2, Number(input.value) - Number(input.max));
      PianoRollRatio.set(ratio);
      return ratio;
    }
  });
  var createTimeRangeController = (length) => {
    const slider = createTimeRangeSlider();
    const view = document.createElement("div");
    view.id = "time-length";
    view.appendChild(slider.body);
    if (length > 30) {
      const window2 = 30;
      const ratio = window2 / length;
      const max = slider.input.max;
      const value = max + Math.log2(ratio);
      slider.input.value = String(value);
      slider.updateDisplay();
    }
    return {
      view,
      slider,
      addListeners: (...ls) => slider.addListeners(...ls)
    };
  };
  var createMelodyBeepVolume = () => createSlider({
    id: "melody_beep_volume",
    label: "",
    min: 0,
    max: 100,
    step: 1,
    updateDisplay: (input, display) => {
      display.textContent = `volume: ${input.value}`;
    },
    getValue: (input) => Number(input.value)
  });
  var createMelodyBeepSwitcher = (id, label) => createCheckbox(id, label);
  var createMelodyBeepController = () => {
    const melody_beep_switcher = createMelodyBeepSwitcher(
      "melody_beep_switcher",
      "Beep Melody"
    );
    const melody_beep_volume = createMelodyBeepVolume();
    const view = document.createElement("div");
    view.appendChild(melody_beep_switcher.body);
    view.appendChild(melody_beep_volume.body);
    view.id = "melody-beep-controllers";
    return {
      view,
      checkbox: melody_beep_switcher,
      volume: melody_beep_volume
    };
  };

  // index.ts
  var createControllers = (layer_count, length, gravity_visible) => {
    const div = document.createElement("div");
    div.id = "controllers";
    div.style.marginTop = "20px";
    const d_melody = createDMelodyController();
    const hierarchy = createHierarchyLevelController(layer_count);
    const time_range = createTimeRangeController(length);
    const implication = createImplicationDisplayController();
    const gravity = createGravityController(gravity_visible);
    const melody_beep = createMelodyBeepController();
    const melody_color = createMelodyColorController();
    melody_beep.checkbox.input.checked = true;
    implication.prospective_checkbox.input.checked = false;
    implication.retrospective_checkbox.input.checked = true;
    implication.reconstructed_checkbox.input.checked = true;
    [
      hierarchy,
      time_range,
      implication,
      melody_beep
    ].forEach((e) => div.appendChild(e.view));
    return {
      div,
      d_melody,
      hierarchy,
      time_range,
      implication,
      gravity,
      melody_beep,
      melody_color
    };
  };
  var createTitleInfo = (id, mode) => ({ id, mode });
  var createApplicationManager = (beat_info, romans, hierarchical_melody, melodies, d_melodies) => {
    const NO_CHORD = false;
    const FULL_VIEW = false;
    if (hierarchical_melody.length <= 0) {
      throw new Error(`hierarchical melody length must be more than 0 but it is ${hierarchical_melody.length}`);
    }
    const layer_count = hierarchical_melody.length - 1;
    const length = melodies.length;
    const controller = createControllers(layer_count, length, !NO_CHORD);
    const audio_time_mediator = createAudioReflectableRegistry();
    const window_size_mediator = createWindowReflectableRegistry();
    const controllers = {
      ...controller,
      audio: audio_time_mediator,
      window: window_size_mediator
    };
    const analyzed = createMusicStructureElements(
      beat_info,
      romans,
      hierarchical_melody,
      melodies,
      d_melodies,
      controllers
    );
    return {
      NO_CHORD,
      FULL_VIEW,
      analyzed,
      controller,
      audio_time_mediator,
      window_size_mediator
    };
  };
  var createEventLoop = (registry, audio_player) => {
    let last_audio_time = Number.MIN_SAFE_INTEGER;
    let old_time = Date.now();
    const fps_element = document.createElement("p");
    fps_element.id = "fps";
    fps_element.textContent = `fps:${0}`;
    document.body.insertAdjacentElement("beforeend", fps_element);
    const audioUpdate = () => {
      const now_at = audio_player.currentTime;
      if (audio_player.paused && now_at === last_audio_time) return;
      last_audio_time = now_at;
      NowAt.set(now_at);
      registry.onUpdate();
    };
    const onUpdate = () => {
      const now = Date.now();
      const fps = Math.floor(1e3 / (now - old_time));
      fps_element.textContent = `fps:${(" " + fps).slice(-3)}`;
      fps_element.style.color = fps < 30 ? "red" : fps < 60 ? "yellow" : "lime";
      old_time = now;
      audioUpdate();
    };
    const update = () => {
      onUpdate();
      requestAnimationFrame(update);
    };
    return { fps_element, registry, audio_player, update, onUpdate, audioUpdate };
  };
  var getG = (header_height) => {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("transform", `translate(${0},${header_height || 0})`);
    return g;
  };
  var getSVG = (header_height) => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", String(PianoRollWidth.get()));
    svg.setAttribute("height", String(PianoRollHeight.get() + (header_height || 0)));
    svg.setAttribute("viewBox", `0 0 ${PianoRollWidth.get()} ${PianoRollHeight.get() + (header_height || 0)}`);
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("xml:space", "preserve");
    svg.setAttribute("overflow", "hidden");
    return svg;
  };
  var getSVGwithoutTitle = (piano_roll_view) => {
    const g = getG();
    g.innerHTML = piano_roll_view.svg.getHTML();
    const svg = getSVG();
    svg.appendChild(g);
    return svg.outerHTML;
  };
  var getRawSaveButton = (tune_id, title, piano_roll_view) => {
    const save_button = document.createElement("input");
    save_button.value = "save analyzed result as SVG (without title)";
    save_button.setAttribute("type", "submit");
    function handleDownload() {
      const blob = new Blob([getSVGwithoutTitle(piano_roll_view)], { "type": "text/plain" });
      const download_link = document.createElement("a");
      download_link.setAttribute("download", `${tune_id}.svg`);
      download_link.setAttribute("href", window.URL.createObjectURL(blob));
      download_link.click();
    }
    save_button.onclick = (e) => {
      handleDownload();
    };
    return save_button;
  };
  var getSaveButtons = (title_info, titleHead, piano_roll_view) => {
    const getTitle = () => `${title_info.id}-${title_info.mode}`;
    const save_button = getRawSaveButton(getTitle(), titleHead, piano_roll_view);
    return [save_button];
  };
  var asParent = (parent) => ({
    appendChildren: (...children) => {
      children.forEach((e) => parent.appendChild(e));
      return parent;
    }
  });
  var setupUI = (title_info, audio_player, titleHead, piano_roll_place, manager) => {
    const audio_viewer = createAudioViewer(audio_player, manager.audio_time_mediator);
    const piano_roll_view = createPianoRoll(
      manager.analyzed,
      manager.window_size_mediator,
      !manager.FULL_VIEW
    );
    asParent(piano_roll_place).appendChildren(
      ...getSaveButtons(title_info, titleHead, piano_roll_view),
      piano_roll_view.svg,
      audio_player,
      new ColumnHTML(
        manager.controller.div
        //        manager.analyzed.melody.ir_plot_svg
      ).div
    );
  };
  var setFullView = (FULL_VIEW, audio_player) => {
    if (FULL_VIEW) {
      document.querySelector("#flex-div").classList.add("full-view");
      audio_player.style.position = "absolute";
      audio_player.style.zIndex = "3";
    } else {
      document.querySelector("#flex-div").classList.remove("full-view");
      audio_player.style.position = "relative";
      audio_player.style.zIndex = "0";
    }
  };
  var onLoad = async (select, titleHead, piano_roll_place, audio_player) => {
    const repo = process.env.REPO_ORIGIN || "https://github.com/Summer498";
    const res_beat_info = await fetch(`${repo}/auditory/resources/groove.wav.beat`);
    const beat_info = await res_beat_info.json();
    const res_roman = await fetch(`${repo}/auditory/resources/groove.wav.roman.json`);
    const roman = await res_roman.json();
    const res_melody = await fetch(`${repo}/auditory/resources/groove.wav.irm.json`);
    const melody = await res_melody.json();
    const midi_response = await fetch("../resources/groove.wav.xml");
    const midi = (void 0).parse(await midi_response.text());
    setCurrentTimeRatio(1 / 4);
    const { melody_hierarchy, melodies, d_melodies } = getHierarchicalMelody(melody);
    const containers = await createAnalyzedDataContainer(melody_hierarchy, roman, midi);
    const { gttm, tsa, pra } = containers;
    const app_manager = createApplicationManager(beat_info, pra, melody_hierarchy, melodies, d_melodies);
    setPianoRollParameters(app_manager.analyzed.melody.getHierarchicalMelody());
    setFullView(app_manager.FULL_VIEW, audio_player);
    setupUI(createTitleInfo("groove", "TSR"), audio_player, titleHead, piano_roll_place, app_manager);
    const registry = app_manager.audio_time_mediator;
    const event_loop = createEventLoop(registry, audio_player);
    event_loop.update();
  };
})();
