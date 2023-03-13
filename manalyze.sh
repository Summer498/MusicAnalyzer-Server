#!/bin/bash -e
# mimicopy is derived from 耳コピ (Japanese word meaning sound transcription)
# 文字コードは UTF-8
pushd `dirname "$0"` > /dev/null
. ./MUSIC_ANALYZER/bin/activate

red=[31m
green=[32m
defcol=[39m
filename=`basename "$1"`  # 引数1から 
songname=`basename "$1" | sed -e 's/\.[^\.]*$//'`  # 引数1から拡張子を取り除く
out_place="/dev/stdout"
export PYTHONPATH="./python:$PYTHONPATH"
debug_mode=1
force_reanalyze=0
melody_reanalyze=0
if [ "$2" = "--debug_mode=false" ]; then
    debug_mode=0
fi
if [ "$3" = "--force_reanalyze=true" ]; then
    force_reanalyze=1
fi
if [ "$4" = "--melody_reanalyze" ]; then
    melody_reanalyze=1
fi
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo $0 \[pathname\] --debug_mode=false --force_reanalyze=true --melody_reanalyze
    exit 0
fi

USE_ANALYZE_CACHE=$((! $force_reanalyze))

function debug_log (){
    if [ $debug_mode -eq 1 ]; then
        echo $@
    fi
}

# 音源分離
separate_src=$1  #"./resources/$filename"
separate_dst="./separated/htdemucs/$songname"
if [ ! -e "$separate_src" ]; then
    echo ${red}file $separate_src not exist$defcol > $out_place
    popd > /dev/null
    exit 1
fi
if [ $USE_ANALYZE_CACHE -eq 1 ] && [ -e "$separate_dst" ]; then
    debug_log ${green}folder $separate_dst already exist$defcol > $out_place
else
    # 本処理
    debug_log python -m demucs -d cuda \"$separate_src\" > $out_place
    python -m demucs -d cuda "$separate_src"
    chmod 757 "$separate_dst"
fi

# 音高推定
extract_src="./separated/htdemucs/$songname/vocals.wav"
extract_dst="./separated/htdemucs/$songname/vocals.f0.csv"
if [ ! -e "$extract_src" ]; then
    echo ${red}file $extract_src not exist$defcol > $out_place
    popd > /dev/null
    exit 1
fi
if [ $USE_ANALYZE_CACHE -eq 1 ] && [ -e "$extract_dst" ]; then
    debug_log ${green}file $extract_dst already exist$defcol > $out_place
else
    # 本処理
    debug_log python -m crepe \"$extract_src\" > $out_place
         python -m crepe "$extract_src"
    chmod 757 "$extract_dst"
fi


# 音高推定結果の処理
post_crepe_src="./separated/htdemucs/$songname/vocals.f0.csv"
post_crepe_dst="./analyzed/melody/$songname/vocals.csv"
post_crepe_dst_dir=`dirname "$post_crepe_dst"`
if [ ! -e "$post_crepe_src" ]; then
   echo ${red}file $post_crepe_src not exist$defcol > $out_place
   popd > /dev/null
   exit 1
fi
if [ $USE_ANALYZE_CACHE -eq 1 ] && [ -e "$post_crepe_dst" ]; then
    debug_log ${green}file $post_crepe_dst already exist$defcol > $out_place
else
    # 本処理
    if [ ! -e "$post_crepe_dst_dir" ]; then
        mkdir "$post_crepe_dst_dir"
    fi
    debug_log python -m post-crepe \"$post_crepe_src\" \"$post_crepe_dst_dir\" > $out_place
         python -m post-crepe "$post_crepe_src" "$post_crepe_dst_dir"
    chmod -R 757 "$post_crepe_dst_dir"
fi

# コード推定
chord_ext_src=$1  #"./resources/$filename"
chord_ext_dst="./analyzed/chord/$songname/chords.json"
chord_ext_dst_dir=`dirname "$chord_ext_dst"`

if [ ! -e "$chord_ext_src" ]; then
    debug_log ${red}file $chord_ext_src not exist$defcol > $out_place
    popd > /dev/null
    exit 1
fi
if [ $USE_ANALYZE_CACHE -eq 1 ] && [ -e "$chord_ext_dst" ]; then
    debug_log ${green}file $chord_ext_dst already exist$defcol > $out_place
else
    # 本処理
    if [ ! -e "$chord_ext_dst_dir" ]; then
        mkdir "$chord_ext_dst_dir"
    fi
    debug_log python -m chordExtract \"$chord_ext_src\" \"$chord_ext_dst\" > $out_place
         python -m chordExtract "$chord_ext_src" "$chord_ext_dst"
    chmod -R 757 "$chord_ext_dst_dir"
fi

# コードをローマ数字変換 (メロディ分析部でローマ数字の情報が必要になれば使う)
chord_to_roman_src=$chord_ext_dst
chord_to_roman_dst="./analyzed/chord/$songname/roman.json"
if [ ! -e "$chord_to_roman_src" ]; then
    debug_log ${red}file $chord_to_roman_src not exist$defcol > $out_place
    popd > /dev/null
    exit 1
fi
if [ $USE_ANALYZE_CACHE -eq 1 ] && [ -e "$chord_to_roman_dst" ]; then
    debug_log ${green}file $chord_to_roman_dst already exist$defcol > $out_place
else
    debug_log "node ./chordToRoman < \"$chord_to_roman_src\" > \"$chord_to_roman_dst\""
    node ./chordToRoman < "$chord_to_roman_src" > "$chord_to_roman_dst"
    chmod 757 "$chord_to_roman_dst"
fi

# コードとメロディの関係を求める
melody_analyze_melody_src=$post_crepe_dst
melody_analyze_chord_src=$chord_to_roman_dst
melody_analyze_dst="./analyzed/melody/$songname/manalyze.json"
if [ ! -e "$melody_analyze_melody_src" ]; then
    debug_log ${red}file $melody_analyze_melody_src not exist$defcol > $out_place
    popd > /dev/null
    exit 1
fi
if [ ! -e "$melody_analyze_chord_src" ]; then
    debug_log ${red}file $melody_analyze_chord_src not exist$defcol > $out_place
    popd > /dev/null
    exit 1
fi
if [ $USE_ANALYZE_CACHE -eq 1 ] && [ -e "$melody_analyze_dst" ]; then
    if [ $melody_reanalyze -eq 1 ]; then
        debug_log "node ./melodyAnalyze \"$melody_analyze_melody_src\"  \"$melody_analyze_chord_src\" > \"$melody_analyze_dst\"" > $out_place
        node ./melodyAnalyze "$melody_analyze_melody_src" "$melody_analyze_chord_src" > "$melody_analyze_dst"
    else
        debug_log ${green}file $melody_analyze_dst already exist$defcol > $out_place
    fi
else
    # 本処理
    debug_log "node ./melodyAnalyze \"$melody_analyze_melody_src\"  \"$melody_analyze_chord_src\" > \"$melody_analyze_dst\""
         node ./melodyAnalyze "$melody_analyze_melody_src" "$melody_analyze_chord_src" > "$melody_analyze_dst"
    chmod 757 "$melody_analyze_dst"
fi
cat "$melody_analyze_dst"

popd > /dev/null
