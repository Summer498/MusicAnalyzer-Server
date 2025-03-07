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
local -r img_src="./resources/$song_name/analyzed/melody/pyin/vocals.f0.json"
local -r img_dst="./resources/$song_name/analyzed/melody/pyin/vocals.f0.png"
python -m pyin2img "$img_src" --audio_file "$pyin_src" -o "$img_dst"

popd > /dev/null
