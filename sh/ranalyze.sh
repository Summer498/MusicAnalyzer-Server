#!/bin/bash -e
# 文字コードは UTF-8
# -f, --force_reanalyze, ignore cache
# -h, --help, show help
# -q, --quiet, don't show success message

readonly working_dir=$(dirname "$0")
readonly red=$(echo [31m)
readonly green=$(echo [32m)
readonly def_col=$(echo [39m)
export PYTHONPATH="./python:$PYTHONPATH"

pushd "$working_dir" > /dev/null
. ./MUSIC_ANALYZER/bin/activate

show_help(){
    awk 'NR > 2 {                          # シバンは出力しない
    if (/^#/) { sub("^# ?", ""); print } # /^#/ にマッチしたら "^# ?" を取り除いて出力
    else { exit }                        # /^#/ にマッチしなくなったら終了
    }' $0 | column -t -s , # 実行スクリプト自身を引数に取る
    exit 0;
}
processOptions(){
    local -r tgt=$1
    shift
    local -r opts=($@)
    local flag=0
    for i in ${!opts[@]}
    do
        if [[ "$tgt" =~ ${opts[$i]} ]]; then  # NOTE: $tgt includes ${opts[$i]}
            eval ${command[$i]}
            local flag=1
            break
        fi
    done
    if [[ $flag -eq 0 ]]; then  # invalid option
        echo "invalid option $tgt" >&2
    fi
}

debug_mode=1
force_reanalyze=0
# 配列の番号を対応付けること
readonly short=(f h q)
readonly long=(
    "--force_reanalyze"
    "--help"
    "--quiet"
)
readonly command=(
    "force_reanalyze=1"
    "show_help"
    "debug_mode=0"
)
while (( $# > 0 ))
do
    if [[ "$1" =~ ^--.*  ]]; then processOptions $1 ${long[*]}; # long options
    elif [[ "$1" =~ ^-.* ]]; then processOptions $1 ${short[*]}; # short option
    elif [[ "$1" =~ .* ]]; then  # 引数
        readonly filepath="$1"
        readonly filename=$(basename "$1")  # 引数のファイル名
        readonly song_name=$(basename "$1" | sed -e 's/\.[^\.]*$//')  # 引数から拡張子を取り除く
    fi
    shift
done

debug_log (){ if [ $debug_mode -eq 1 ]; then echo $@ >&2; fi }
detectFile(){
    local -r dst="$1"
    if [ ! -e "$dst" ]; then
        echo ${red}file $dst not exist$def_col >&2
        popd > /dev/null
        exit 1
    fi
}
makeNewDir(){
    local -r dst_dir="$1"
    if [ ! -e "$dst_dir" ]; then
        mkdir -p "$dst_dir"
        chmod -R 775 "$dst_dir"    
    fi
}
runProcessWithCache(){
    local -r force=$1    #force を個別に操作できるようにする
    local -r dst="$2"
    local -r process="$3"
    if [ $force -eq 0 ] && [ -e "$dst" ]; then debug_log ${green}$dst already exist$def_col;
    else
        # 本処理
        makeNewDir "$(dirname "$dst")"
        debug_log "$process"
        eval $process
        chmod 775 "$dst"
    fi
}

main(){
    # コード推定
    local -r chord_ext_src="$filepath"
    local -r chord_ext_dst="./resources/$song_name/analyzed/chord/chords.json"
    detectFile "$chord_ext_src"
    runProcessWithCache $force_reanalyze "$chord_ext_dst" "python -m chordExtract \"$chord_ext_src\" \"$chord_ext_dst\""

    # コードをローマ数字変換
    local -r chord_to_roman_src=$chord_ext_dst
    local -r chord_to_roman_dst="./resources/$song_name/analyzed/chord/roman.json"
    detectFile "$chord_to_roman_src"
    runProcessWithCache $force_reanalyze "$chord_to_roman_dst" "node ./packages/chord-analyze-cli < \"$chord_to_roman_src\" > \"$chord_to_roman_dst\""
    cat "$chord_to_roman_dst"
}
main

popd > /dev/null
