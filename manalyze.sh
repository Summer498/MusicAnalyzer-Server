#!/bin/bash -e
# mimicopy is derived from 耳コピ (Japanese word meaning sound transcription)
# 文字コードは UTF-8
# -f, --force_reanalyze, ignore cache
# -h, --help, show help
# -q, --quiet, don't show success message
# -r, --melody_reanalyze, reanalyze melody
pushd `dirname "$0"` > /dev/null
. ./MUSIC_ANALYZER/bin/activate

red=[31m
green=[32m
defcol=[39m
export PYTHONPATH="./python:$PYTHONPATH"

help(){
    awk 'NR > 3 {                          # シバンは出力しない
    if (/^#/) { sub("^# ?", ""); print } # /^#/ にマッチしたら "^# ?" を取り除いて出力
    else { exit }                        # /^#/ にマッチしなくなったら終了
    }' $0 | column -t -s , # 実行スクリプト自身を引数に取る
    exit 0;
}
processOptions(){
    tgt=$1
    shift
    opts=($@)
    flag=0
    for i in ${!opts[@]}
    do
        if [[ "$tgt" =~ ${opts[$i]} ]]; then  # NOTE: $tgt includes ${opts[$i]}
            eval ${command[$i]}
            flag=1
            break
        fi
    done
    if [[ $flag -eq 0 ]]; then  # invalid option
        echo "invalid option $tgt" >&2
    fi
}

debug_mode=1
force_reanalyze=0
melody_reanalyze=0
while (( $# > 0 ))
do
    # 配列の番号を対応付けること
    short=(f h q r)
    long=(
        "--force_reanalyze"
        "--help"
        "--quiet"
        "--melody_reanalyze"
    )
    command=(
        "force_reanalyze=1"
        "help"
        "debug_mode=0"
        "melody_reanalyze=1"
    )
    if [[ "$1" =~ ^--.*  ]]; then  # long options
        processOptions $1 ${long[*]}
    elif [[ "$1" =~ ^-.* ]]; then  # short option
        processOptions $1 ${short[*]}
    elif [[ "$1" =~ .* ]]; then  # 引数
        filename=`basename "$1"`  # 引数のファイル名
        songname=`basename "$1" | sed -e 's/\.[^\.]*$//'`  # 引数から拡張子を取り除く
    fi
    shift
done

debug_log(){
    if [ $debug_mode -eq 1 ]; then
        echo $@ >&2
    fi
}
detectFile(){
    dst="$1"
    if [ ! -e "$dst" ]; then
        echo ${red}file $dst not exist$defcol >&2
        popd > /dev/null
        exit 1
    fi
}
runProcessWithCache(){
    dst="$1"
    process="$2"
    if [ $force_reanalyze -eq 0 ] && [ -e "$dst" ]; then
        debug_log ${green}$dst already exist$defcol
    else
        # 本処理
        debug_log "$process"
        eval $process
        chmod 757 "$dst"
    fi
}
makeNewDir(){
    dst_dir="$1"
    if [ ! -e "$dst_dir" ]; then
        mkdir "$dst_dir"
        chmod -R 757 "$dst_dir"    
    fi
}

# 音源分離
separate_src="./resources/$filename"
separate_dst="./separated/htdemucs/$songname"
detectFile "$separate_src"
runProcessWithCache "$separate_dst" "python -m demucs -d cuda \"$separate_src\""

# 音高推定
extract_src="$separate_dst/vocals.wav"
extract_dst="$separate_dst/vocals.f0.csv"
detectFile "$extract_src"
runProcessWithCache "$extract_dst" "python -m crepe \"$extract_src\""

# 音高推定結果の処理
post_crepe_src="$extract_dst"
post_crepe_dst="./analyzed/melody/$songname/vocals.csv"
post_crepe_dst_dir=`dirname "$post_crepe_dst"`
detectFile "$post_crepe_src"
makeNewDir "$post_crepe_dst_dir"
runProcessWithCache "$post_crepe_dst" "python -m post-crepe \"$post_crepe_src\" \"$post_crepe_dst_dir\""

# コード推定
chord_ext_src="./resources/$filename"
chord_ext_dst="./analyzed/chord/$songname/chords.json"
chord_ext_dst_dir=`dirname "$chord_ext_dst"`
detectFile "$chord_ext_src"
makeNewDir "$chord_ext_dst_dir"
runProcessWithCache "$chord_ext_dst" "python -m chordExtract \"$chord_ext_src\" \"$chord_ext_dst\""

# コードをローマ数字変換 (メロディ分析部でローマ数字の情報が必要になれば使う)
chord_to_roman_src=$chord_ext_dst
chord_to_roman_dst="./analyzed/chord/$songname/roman.json"
detectFile "$chord_to_roman_src"
runProcessWithCache "$chord_to_roman_dst" "node ./chordToRoman < \"$chord_to_roman_src\" > \"$chord_to_roman_dst\""

# コードとメロディの関係を求める
melody_analyze_melody_src=$post_crepe_dst
melody_analyze_chord_src=$chord_to_roman_dst
melody_analyze_dst="./analyzed/melody/$songname/manalyze.json"
detectFile "$melody_analyze_melody_src"
detectFile "$melody_analyze_chord_src"
runProcessWithCache "$melody_analyze_dst" "node ./melodyAnalyze \"$melody_analyze_melody_src\" \"$melody_analyze_chord_src\" > \"$melody_analyze_dst\""
# 最終処理だけ reanalyze option が on の場合は実行する.
if [ $force_reanalyze -eq 0 ] && [ -e "$melody_analyze_dst" ] && [ $melody_reanalyze -eq 1 ]; then
    debug_log "node ./melodyAnalyze \"$melody_analyze_melody_src\" \"$melody_analyze_chord_src\" > \"$melody_analyze_dst\""
    node ./melodyAnalyze "$melody_analyze_melody_src" "$melody_analyze_chord_src" > "$melody_analyze_dst"
    chmod 757 "$melody_analyze_dst"
fi
cat "$melody_analyze_dst"

popd > /dev/null
