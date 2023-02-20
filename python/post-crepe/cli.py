import pandas as pd
import numpy as np
import math
import soundfile as sf
import csv
import sys
import os.path as path
from copy import deepcopy


def band_pass(frequency: float, low: float, high: float):
    """band pass filter on frequency domain"""
    if low <= frequency and frequency < high:
        return frequency
    else:
        return math.nan


def hz_to_midi(frequencies):
    return 12 * (np.log2(np.asanyarray(frequencies)) - np.log2(440.0)) + 69


def midi_to_hz(notes):
    return 440.0 * (2.0 ** ((np.asanyarray(notes) - 69.0) / 12.0))


def round_on_midi_domain(frequency):
    """
    returns frequency(hz) rounded on midi domain
    """
    return midi_to_hz(round(hz_to_midi(frequency)))


class MedianFilter:
    def __init__(self, initializer: list, window_size):
        self.buff = deepcopy(initializer[0:window_size])
        self.array = initializer
        self.window_size = window_size

    def median(self, i: int):
        self.buff[i % self.window_size] = self.array[i]  # リングバッファに保存する
        return np.median(self.buff)
        

class freqToPhase:
    def __init__(self, s0, sampling_rate=44100) -> None:
        self.s = 0
        self.s0 = s0
        if math.isnan(self.s0):
            self.s0 = 0
        self.sampling_rate = sampling_rate

    def calc(self, freq):
        if math.isnan(freq):  # nan の時は前の位相をキープ
            return self.s + self.s0
        self.s += freq / self.sampling_rate
        return self.s + self.s0


def main():
    # csv の中身は 1 サンプル = 0.01 秒になっている
    #_csv_file_path = f"./separated/htdemucs/{filename}/vocals.f0.csv"
    csv_file_path = sys.argv[1]
    dictionary_from_csv = pd.read_csv(csv_file_path, header=0, index_col=None)
    CSV_SAMPLING_RATE = 100

    # 瞬間周波数 [rad/s]
    frequency_row = dictionary_from_csv[["frequency"]].squeeze()
    frequency_rounded = [round_on_midi_domain(freq) for freq in frequency_row]

    # 中央値を用いたフィルタ (ヘンペルフィルタ) を用いてスパイクノイズを除去する
    WINDOW_SIZE = 25  # 自分 + 前後のサンプル数で奇数にしておく
    median_filter = MedianFilter(frequency_rounded, WINDOW_SIZE)
    frequency_median_filtered = [median_filter.median(i) for i in range(len(frequency_rounded))]

    LOW = 220  # hz
    HIGH = 880  # hz
    # バンドパスで低すぎる/高すぎる音を除く
    frequency_001_band_passed = [band_pass(freq, LOW, HIGH) for freq in frequency_median_filtered]

    # 1/100[s] 刻みのデータをサンプリング周波数に合わせる
    SAMPLING_RATE = 22050
    N = SAMPLING_RATE / CSV_SAMPLING_RATE
    size = (len(frequency_001_band_passed) * SAMPLING_RATE) // CSV_SAMPLING_RATE
    frequency = [2 * np.pi * frequency_001_band_passed[int(i // N)] for i in range(size)]

    # Output
    out_filename = f"{sys.argv[2]}/vocals"
    # out_filename = f"{path.dirname(csv_file_path)}/vocals"
    with open(f"{out_filename}.midi.csv", 'w') as file:
        writer = csv.writer(file)
        writer.writerow(np.round(hz_to_midi(frequency_001_band_passed)))

    with open(f"{out_filename}.csv", 'w') as file:
        writer = csv.writer(file)
        writer.writerow(frequency_001_band_passed)

    # サイン波の音で確認するため, 瞬間周波数を積分して位相を求める
    freq_to_phase = freqToPhase(frequency[0], SAMPLING_RATE)
    phase = [freq_to_phase.calc(freq) for freq in frequency]
    sinoid = np.sin(phase) * 0.8

    # 音で確認する
    mini_sinoid = sinoid[17 * SAMPLING_RATE: 40 * SAMPLING_RATE]
    sf.write(f"{out_filename}.f0.wav", sinoid, SAMPLING_RATE, subtype="PCM_16")
    sf.write(f"{out_filename}mini.f0.wav", mini_sinoid, SAMPLING_RATE, subtype="PCM_16")
