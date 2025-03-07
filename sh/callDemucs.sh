readonly working_dir=$(dirname "$0")
readonly red=$(echo [31m)
readonly green=$(echo [32m)
readonly def_col=$(echo [39m)
export PYTHONPATH="./python:"

pushd "$working_dir" > /dev/null
. ./MUSIC_ANALYZER/bin/activate

local -r filepath="$1"
local -r song_name="$(basename "$1" | sed -e 's/\.[^\.]*$//')"  # 引数から拡張子を取り除く

local -r demucs_src="$filepath"
local -r demucs_dst="./separated/htdemucs/$song_name"
local -r separate_dir="./resources/$song_name/demucs/"
local -r separate_dst="./resources/$song_name/demucs/vocals.wav"

python -m demucs -d cuda "$demucs_src" >&2
rename "$separate_dir" "$demucs_dst"

popd > /dev/null
