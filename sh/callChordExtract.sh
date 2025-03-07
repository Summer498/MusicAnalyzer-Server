readonly working_dir=$(dirname "$0")
readonly red=$(echo [31m)
readonly green=$(echo [32m)
readonly def_col=$(echo [39m)
export PYTHONPATH="./python:"

pushd "$working_dir" > /dev/null
. ./MUSIC_ANALYZER/bin/activate

local -r filepath="$1"
local -r song_name="$(basename "$1" | sed -e 's/\.[^\.]*$//')"  # 引数から拡張子を取り除く

local -r chord_ext_src="$filepath"
local -r chord_ext_dst="./resources/$song_name/analyzed/chord/chords.json"

python -m chordExtract "$chord_ext_src" "$chord_ext_dst"

popd > /dev/null
