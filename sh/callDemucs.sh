(
  export PYTHONPATH="./python:"
  . ./MUSIC_ANALYZER/bin/activate

  readonly filepath="$1"
  readonly song_name="$(basename "$1" | sed -e 's/\.[^\.]*$//')"  # 引数から拡張子を取り除く

  readonly demucs_src="$filepath"
  readonly demucs_tmp="./separated/htdemucs/$song_name"
  readonly demucs_dir="./resources/$song_name/demucs/"
  readonly demucs_dst="./resources/$song_name/demucs/vocals.wav"

  python -m demucs -d cuda "$demucs_src" >&2
  if [ -e "$demucs_dst" ]; then rmdir "$demucs_dir"; fi
  mv "$demucs_tmp" "$demucs_dir"
)