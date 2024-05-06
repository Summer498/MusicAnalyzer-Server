import argparse
import json
import numpy as np
import sys
from librosa import amplitude_to_db, display, load, stft, times_like, to_mono
import matplotlib.pyplot as plt

def parse_arguments():
    parser = argparse.ArgumentParser(description="pYIN result to image")
    parser.add_argument("f0_file", type=str, help="Path to the f0.json")
    parser.add_argument("--audio_file", type=str, help="Path to the audio file")
    parser.add_argument("--outfile", "-o", type=str, default="./out.json", help="File to output estimation result")

    return parser.parse_args()

def load_f0(filepath:str):
    with open(filepath, 'r') as f:
        load_data = json.load(f)
    return load_data

def main():
    args = parse_arguments()
    
    data = load_f0(args.f0_file)
    f0 = np.array(data["f0"])
    sr = data["sampling_rate"]

    y0, sr = load(args.audio_file, sr=sr, mono=False)
    y = to_mono(y0)

    # 画像で確認
    times = times_like(f0, sr=sr*2)
    stft_res = stft(y)
    D = amplitude_to_db(np.abs(stft_res), ref=np.max)

    fig, ax = plt.subplots()
    img = display.specshow(D, x_axis='time', y_axis='log', ax=ax)
    ax.set(title='pYIN fundamental frequency estimation')
    fig.colorbar(img, ax=ax, format="%+2.f dB")
    ax.plot(times, f0, label='f0', color='cyan', linewidth=1)
    ax.legend(loc='upper right')
    plt.savefig(f"{args.outfile}")  # PNG形式で保存