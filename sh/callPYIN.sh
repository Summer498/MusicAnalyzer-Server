readonly working_dir=$(dirname "$0")
readonly red=$(echo [31m)
readonly green=$(echo [32m)
readonly def_col=$(echo [39m)
export PYTHONPATH="./python:"

pushd "$working_dir" > /dev/null
. ./MUSIC_ANALYZER/bin/activate

local -r filepath="$1"
local -r song_name="$(basename "$1" | sed -e 's/\.[^\.]*$//')"  # 引数から拡張子を取り除く

local -r pyin_src="./resources/$song_name/demucs/vocals.wav"
local -r pyin_dst="./resources/$song_name/analyzed/melody/pyin/vocals.f0.json"
python -m pyin "$pyin_src" --fmin 128 --fmax 4096 -o "$pyin_dst"

popd > /dev/null
