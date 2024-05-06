#!/bin/bash -e
# 文字コードは UTF-8
# -f, --force_reanalyze, ignore cache
# -h, --help, show help
# -q, --quiet, don't show success message

readonly working_dir=$(dirname "$0")
readonly red=$(echo [31m)
readonly green=$(echo [32m)
readonly def_col=$(echo [39m)
export PYTHONPATH="./python:"

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
    if [[ $flag -eq 0 ]]; then echo "invalid option $tgt" >&2; fi
}

debug_mode=1
force_reanalyze=0
# 配列の番号を対応付けること
readonly short=(f h q)
readonly local=(
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
    if [[ "$1" =~ ^--.*  ]]; then processOptions $1 ${local[*]}; # local options
    elif [[ "$1" =~ ^-.* ]]; then processOptions $1 ${short[*]}; # short option
    elif [[ "$1" =~ .* ]]; then  # 引数
        readonly filepath="$1"
        readonly filename=$(basename "$1")  # 引数のファイル名
        readonly songname=$(basename "$1" | sed -e 's/\.[^\.]*$//')  # 引数から拡張子を取り除く
    fi
    shift
done

debug_log(){ if [ $debug_mode -eq 1 ]; then echo $@ >&2; fi; }
detectFile(){
    local -r dst="$1"
    if [ ! -e "$dst" ]; then
        echo ${red}file $dst not exist${def_col} >&2
        popd > /dev/null
        exit 1
    fi
}
makeNewDir(){
    local -r dir="$1"
    if [ ! -e "$dir" ]; then
        mkdir -p "$dir"
        chmod -R 757 "$dir"
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
        chmod 757 "$dst"
    fi
}

rename(){
    local -r src="$1"
    local -r dst="$2"
    if [ -e "$dst" ]; then rmdir "$dst"; fi
    mv "$src" "$dst"
}

renameTmpFile(){
    local -r force=$1    #force を個別に操作できるようにする
    local -r dst="$2"
    local -r tmp_dst="$3"
    local -r process="$4"

    runProcessWithCache $force "$tmp_dst" "$process"
    rename "$tmp_dst" "$dst"
}


main(){
    # コード推定
    local -r chord_ext_src="$filepath"
    local -r chord_ext_dst="./resources/$songname/analyzed/chord/chords.json"
    detectFile "$chord_ext_src"
    runProcessWithCache $force_reanalyze "$chord_ext_dst" "python -m chordExtract \"$chord_ext_src\" \"$chord_ext_dst\""

    # コードをローマ数字変換 (メロディ分析部でローマ数字の情報が必要になれば使う)
    local -r chord_to_roman_src="$chord_ext_dst"
    local -r chord_to_roman_dst="./resources/$songname/analyzed/chord/roman.json"
    detectFile "$chord_to_roman_src"
    runProcessWithCache $force_reanalyze "$chord_to_roman_dst" "node ./packages/chordToRoman < \"$chord_to_roman_src\" > \"$chord_to_roman_dst\""



    # 音源分離
    local -r demucs_src="$filepath"
    local -r demucs_dst="./separated/htdemucs/$songname"
    local -r separate_dst="./resources/$songname/demucs/vocals.wav"
    local -r separate_dir="$(dirname "$separate_dst")"
    detectFile "$demucs_src"
    runProcessWithCache $force_reanalyze "$separate_dir" "renameTmpFile $force_reanalyze \"$separate_dir\" \"$demucs_dst\" \"python -m demucs -d cuda \\\"$demucs_src\\\" >&2\""
    #TODO: 出力先ファイル名が勝手に決まるのを直して引数から指定できるようにしたい


    local -r pitch_est="pYIN"
    # 音高推定 (CREPE)
    if [ "CREPE" = $pitch_est ]; then
        local -r crepe_src="$separate_dst"
        local -r crepe_dst="./resources/$songname/analyzed/melody/crepe/vocals.f0.csv"
        local -r tmp_dst="$(dirname "$separate_dst")/vocals.f0.csv"
        detectFile "$crepe_src"
        runProcessWithCache $force_reanalyze "$crepe_dst" "renameTmpFile $force_reanalyze \"$crepe_dst\" \"$tmp_dst\" \"python -m crepe \\\"$crepe_src\\\" >&2\""
        #TODO: 出力先ファイル名が勝手に決まるのを直して引数から指定できるようにしたい

        # 音高推定結果の処理 (CREPE 系)
        local -r post_crepe_src="$crepe_dst"
        local -r post_crepe_dst="./resources/$songname/analyzed/melody/crepe/vocals.json"
        detectFile "$post_crepe_src"
        runProcessWithCache $force_reanalyze "$post_crepe_dst" "python -m post-crepe \"$post_crepe_src\" -o \"$post_crepe_dst\""
        # TODO: これを node の post-crepe にする

        # コードとメロディの関係を求める (CREPE 系)
        local -r melody_analyze_melody_src="$post_crepe_dst"
        local -r melody_analyze_chord_src="$chord_to_roman_dst"
        local -r melody_analyze_dst="./resources/$songname/analyzed/melody/crepe/manalyze.json"
        detectFile "$melody_analyze_melody_src"
        detectFile "$melody_analyze_chord_src"
        runProcessWithCache $force_reanalyze "$melody_analyze_dst" "node ./packages/melodyAnalyze -m \"$melody_analyze_melody_src\" -r \"$melody_analyze_chord_src\" -o \"$melody_analyze_dst\" --sampling_rate 100"
    fi

    # 音高推定 (pYIN)
    if [ "pYIN" = $pitch_est ]; then
        echo "call pYIN" >&2
        local -r pyin_src="$separate_dst"
        local -r pyin_dst="./resources/$songname/analyzed/melody/pyin/vocals.f0.json"
        detectFile "$pyin_src"
        runProcessWithCache $force_reanalyze "$pyin_dst" "python -m pyin \"$pyin_src\" --fmin 128 --fmax 4096 -o \"$pyin_dst\""
        local -r img_src="$pyin_dst"
        local -r img_dst="$(dirname $pyin_dst)/vocals.f0.png"
        runProcessWithCache $force_reanalyze "$img_dst" "python -m pyin2img \"$img_src\" --audio_file \"$pyin_src\" -o \"$img_dst\""

        # 音高推定結果の処理 (pYIN 系)
        echo "call post-pYIN" >&2
        local -r post_pyin_src="$pyin_dst"
        local -r post_pyin_dst="./resources/$songname/analyzed/melody/pyin/vocals.json"
        detectFile "$post_pyin_src"
        runProcessWithCache $force_reanalyze "$post_pyin_dst" "node ./packages/postPYIN \"$post_pyin_src\" \"$(dirname "$post_pyin_dst")\""

        # コードとメロディの関係を求める (pYIN 系)
        echo "call melody analyze (from pYIN)" >&2
        local -r melody_analyze_melody_src="$post_pyin_dst"
        local -r melody_analyze_chord_src="$chord_to_roman_dst"
        local -r melody_analyze_dst="./resources/$songname/analyzed/melody/pyin/manalyze.json"
        detectFile "$melody_analyze_melody_src"
        detectFile "$melody_analyze_chord_src"
        local -r sr=$((22050/1024))
        runProcessWithCache $force_reanalyze "$melody_analyze_dst" "node ./packages/melodyAnalyze -m \"$melody_analyze_melody_src\" -r \"$melody_analyze_chord_src\" -o \"$melody_analyze_dst\" --sampling_rate $sr"
    fi

    cat "$melody_analyze_dst"
}
main

popd > /dev/null
