#!/bin/bash -e
# 文字コードは UTF-8
# -f, --force_reanalyze, ignore cache
# -h, --help, show help
# -q, --quiet, don't show success message
# -r, --melody_reanalyze, reanalyze melody
pushd $(dirname "$0") > /dev/null
. ./MUSIC_ANALYZER/bin/activate

red=[31m
green=[32m
defcol=[39m
export PYTHONPATH="./python:$PYTHONPATH"

help(){
    awk 'NR > 2 {                          # シバンは出力しない
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
        filepath="$1"
        filename=$(basename "$1")  # 引数のファイル名
        songname=$(basename "$1" | sed -e 's/\.[^\.]*$//')  # 引数から拡張子を取り除く
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
        echo ${red}file $dst not exist${defcol} >&2
        popd > /dev/null
        exit 1
    fi
}
runProcessWithCache(){
    dst="$1"
    process="$2"
    force=$3
    if [ $force -eq 0 ] && [ -e "$dst" ]; then
        debug_log ${green}$dst already exist$defcol
    else
        # 本処理
        makeNewDir "$(dirname "$dst")"
        debug_log "$process"
        eval $process
        chmod 757 "$dst"
    fi
}
makeNewDir(){
    dir="$1"
    if [ ! -e "$dir" ]; then
        mkdir -p "$dir"
        chmod -R 757 "$dir"    
    fi
}



# コード推定
chord_ext_src="$filepath"
chord_ext_dst="./resources/$songname/analyzed/chord/chords.json"
detectFile "$chord_ext_src"
runProcessWithCache "$chord_ext_dst" "python -m chordExtract \"$chord_ext_src\" \"$chord_ext_dst\"" $force_reanalyze

# コードをローマ数字変換 (メロディ分析部でローマ数字の情報が必要になれば使う)
chord_to_roman_src="$chord_ext_dst"
chord_to_roman_dst="./resources/$songname/analyzed/chord/roman.json"
detectFile "$chord_to_roman_src"
runProcessWithCache "$chord_to_roman_dst" "node ./packages/chordToRoman < \"$chord_to_roman_src\" > \"$chord_to_roman_dst\"" $force_reanalyze



# 音源分離
demucs_src="$filepath"
demucs_dst="./separated/htdemucs/$songname"
separate_dst="./resources/$songname/demucs/vocals.wav"
detectFile "$demucs_src"
if [ $force_reanalyze -eq 0 ] && [ -e "$separate_dst" ]; then
    debug_log ${green}$separate_dst already exist${defco}l
else
    runProcessWithCache "$demucs_dst" "python -m demucs -d cuda \"$demucs_src\" >&2" $force_reanalyze
    mv "$demucs_dst" "$(dirname "$separate_dst")"
    chmod -R 757 "$(dirname "$separate_dst")"
fi
#TODO: 出力先ファイル名が勝手に決まるのを直して引数から指定できるようにしたい


pitch_est="CREPE"
# 音高推定 (CREPE)
if [ "CREPE" = $pitch_est ]; then
    crepe_src="$separate_dst"
    tmp_dst="$(dirname "$separate_dst")/vocals.f0.csv"
    crepe_dst="./resources/$songname/analyzed/melody/crepe/vocals.f0.csv"
    detectFile "$crepe_src"
    if [ $force_reanalyze -eq 0 ] && [ -e "$crepe_dst" ]; then
        debug_log ${green}$crepe already exist${defcol}
    else
        runProcessWithCache "$tmp_dst" "python -m crepe \"$crepe_src\" >&2" $force_reanalyze
        makeNewDir "$(dirname "$crepe_dst")"
        mv "$tmp_dst" "$crepe_dst"
        chmod 757 "$crepe_dst"
    fi
    #TODO: 出力先ファイル名が勝手に決まるのを直して引数から指定できるようにしたい

    # 音高推定結果の処理 (CREPE 系)
    post_crepe_src="$crepe_dst"
    post_crepe_dst="./resources/$songname/analyzed/melody/crepe/vocals.json"
    detectFile "$post_crepe_src"
    runProcessWithCache "$post_crepe_dst" "python -m post-crepe \"$post_crepe_src\" -o \"$post_crepe_dst\"" $force_reanalyze
    # TODO: これを node の post-crepe にする

    # コードとメロディの関係を求める (CREPE 系)
    melody_analyze_melody_src="$post_crepe_dst"
    melody_analyze_chord_src="$chord_to_roman_dst"
    melody_analyze_dst="./resources/$songname/analyzed/melody/crepe/manalyze.json"
    detectFile "$melody_analyze_melody_src"
    detectFile "$melody_analyze_chord_src"
    runProcessWithCache "$melody_analyze_dst" "node ./packages/melodyAnalyze -m \"$melody_analyze_melody_src\" -r \"$melody_analyze_chord_src\" -o \"$melody_analyze_dst\" --sampling_rate 100" $force_reanalyze

    # 最終処理だけ reanalyze option が on の場合は実行する.
    if [ $force_reanalyze -eq 0 ] && [ -e "$melody_analyze_dst" ] && [ $melody_reanalyze -eq 1 ]; then
        debug_log "node ./packages/melodyAnalyze -m \"$melody_analyze_melody_src\" -r \"$melody_analyze_chord_src\" -o \"$melody_analyze_dst\" --sampling_rate 100"
        node ./packages/melodyAnalyze -m "$melody_analyze_melody_src" -r "$melody_analyze_chord_src" -o "$melody_analyze_dst" --sampling_rate 100
        chmod 757 "$melody_analyze_dst"
    fi
fi

# 音高推定 (pYIN)
if [ "pYIN" = $pitch_est ]; then
    echo "call pYIN" >&2
    pyin_src="$separate_dst"
    pyin_dst="./resources/$songname/analyzed/melody/pyin/vocals.f0.json"
    detectFile "$pyin_src"
    runProcessWithCache "$pyin_dst" "python -m pyin \"$pyin_src\" --fmin 128 --fmax 4096 -o \"$pyin_dst\"" $force_reanalyze
    img_src="$pyin_dst"
    img_dst="$separate_dst/vocals.f0.png"
    runProcessWithCache "$img_dst" "python -m pyin2img \"$img_src\" --audio_file \"$pyin_src\" -o \"$img_dst\"" $force_reanalyze

    # 音高推定結果の処理 (pYIN 系)
    echo "call post-pYIN" >&2
    post_pyin_src="$pyin_dst"
    post_pyin_dst="./resources/$songname/analyzed/melody/pyin/vocals.json"
    post_pyin_dst_dir=$(dirname "$post_pyin_dst")
    detectFile "$post_pyin_src"
    runProcessWithCache "$post_pyin_dst" "node ./packages/postPYIN \"$post_pyin_src\" \"$post_pyin_dst_dir\"" $force_reanalyze

    # コードとメロディの関係を求める (pYIN 系)
    echo "call melody analyze (from pYIN)" >&2
    melody_analyze_melody_src="$post_pyin_dst"
    melody_analyze_chord_src="$chord_to_roman_dst"
    melody_analyze_dst="./resources/$songname/analyzed/melody/pyin/manalyze.json"
    detectFile "$melody_analyze_melody_src"
    detectFile "$melody_analyze_chord_src"
    sr=$((22050/1024))
    runProcessWithCache "$melody_analyze_dst" "node ./packages/melodyAnalyze -m \"$melody_analyze_melody_src\" -r \"$melody_analyze_chord_src\" -o \"$melody_analyze_dst\" --sampling_rate $sr" $force_reanalyze


    # 最終処理だけ reanalyze option が on の場合は実行する.
    if [ $force_reanalyze -eq 0 ] && [ -e "$melody_analyze_dst" ] && [ $melody_reanalyze -eq 1 ]; then
        debug_log "node ./packages/melodyAnalyze -m \"$melody_analyze_melody_src\" -r \"$melody_analyze_chord_src\" -o \"$melody_analyze_dst\" --sampling_rate $sr"
        node ./packages/melodyAnalyze -m "$melody_analyze_melody_src" -r "$melody_analyze_chord_src" -o "$melody_analyze_dst" --sampling_rate $sr
        chmod 757 "$melody_analyze_dst"
    fi
fi

cat "$melody_analyze_dst"

popd > /dev/null
