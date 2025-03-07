import argparse
import numpy as np
import json
import sys
from librosa import load, pyin, to_mono
from typing import List, Optional, Union
from numpy.typing import NDArray

def parse_arguments():
    parser = argparse.ArgumentParser(description="pYIN fundamental frequency estimation CLI tool")
    parser.add_argument("audio_file", type=str, help="Path to the audio file")
    parser.add_argument("--fmin", type=float, required=True, help="Minimum frequency in Hz")
    parser.add_argument("--fmax", type=float, required=True, help="Maximum frequency in Hz")
    parser.add_argument("--sr", type=int, default=22050, help="Sampling rate in Hz")
    parser.add_argument("--frame_length", type=int, default=2048, help="Frame length in samples")
    parser.add_argument("--win_length", type=int, default=None, help="Window length for autocorrelation in samples")
    parser.add_argument("--hop_length", type=int, default=None, help="Audio samples between adjacent pYIN predictions")
    parser.add_argument("--n_thresholds", type=int, default=100, help="Number of thresholds for peak estimation")
    parser.add_argument("--beta_parameters", type=float, nargs=2, default=(2, 18), help="Shape parameters for the beta distribution")
    parser.add_argument("--boltzmann_parameter", type=float, default=2, help="Shape parameter for the Boltzmann distribution")
    parser.add_argument("--resolution", type=float, default=0.1, help="Resolution of the pitch bins")
    parser.add_argument("--max_transition_rate", type=float, default=35.92, help="Maximum pitch transition rate in octaves per second")
    parser.add_argument("--switch_prob", type=float, default=0.01, help="Probability of switching from voiced to unvoiced")
    parser.add_argument("--no_trough_prob", type=float, default=0.01, help="Probability to add to global minimum if no trough is below threshold")
    parser.add_argument("--fill_na", default=np.nan, help="Default value for unvoiced frames")
    parser.add_argument("--center", type=bool, default=True, help="Center the signal or not")
    parser.add_argument("--pad_mode", type=str, default="constant", help="Mode for padding the signal")
    parser.add_argument("--outfile", "-o", type=str, default="./out.json", help="File to output estimation result")
    
    return parser.parse_args()

def replace_nan_with_none(x: Union[float, int]) -> Optional[Union[float, int]]:
    return None if np.isnan(x) else x

def replace_nan_with_none_in_ndarray(arr: NDArray[Union[np.int64, np.float64]]) -> List[Optional[Union[float, int]]]:
    return [replace_nan_with_none_in_ndarray(x) if isinstance(x, np.ndarray) else replace_nan_with_none(x) for x in arr]

def main():
    args = parse_arguments()

    # librosa.load を使ってオーディオデータとサンプリングレートを読み込む
    try:
        y, sr = load(args.audio_file, sr=None, mono=False)
        print(f"Audio loaded successfully: data type {type(y)}, shape {y.shape}, sampling rate {sr}", file=sys.stderr)
    except Exception as e:
        print(f"Failed to load audio: {e}")
        raise e
    if args.sr != None:
        sr = args.sr

    # pyin 関数の呼び出し
    f0, voiced_flag, voiced_prob = pyin(
        y=to_mono(y),
        fmin=args.fmin,
        fmax=args.fmax,
        sr=sr,
        frame_length=args.frame_length,
        win_length=args.win_length,
        hop_length=args.hop_length,
        n_thresholds=args.n_thresholds,
        beta_parameters=args.beta_parameters,
        boltzmann_parameter=args.boltzmann_parameter,
        resolution=args.resolution,
        max_transition_rate=args.max_transition_rate,
        switch_prob=args.switch_prob,
        no_trough_prob=args.no_trough_prob,
        fill_na=args.fill_na,
        center=args.center,
        pad_mode=args.pad_mode
    )

    assert isinstance(f0, np.ndarray) and isinstance(voiced_flag, np.ndarray) and isinstance(voiced_prob, np.ndarray), "pYIN output shapes are not ndarray"
    assert f0.shape == voiced_flag.shape == voiced_prob.shape, "pYIN output shapes are not identical"

    # 結果の出力
    if f0.ndim == 1:
        data = {
                "sampling_rate": sr,
                "f0": replace_nan_with_none_in_ndarray(f0),
                "voiced_flags": voiced_flag.tolist(),
                "voiced_prob": voiced_prob.tolist()
            }
    else:
        raise ValueError("Unsupported dimensionality: f0 must be 1 dimension.")

    with open(f"{args.outfile}", "w") as writefile:
        print(json.dumps(data, indent=2), file=writefile)

