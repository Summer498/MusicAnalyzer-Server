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
if [ "$2" = "--debug_mode=false" ]; then
    debug_mode=0
fi
if [ "$3" = "--force_reanalyze=true" ]; then
    force_reanalyze=1
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
fi

# 音高推定結果の処理
post_crepe_src="./separated/htdemucs/$songname/vocals.f0.csv"
post_crepe_dst="./separated/htdemucs/$songname/vocals.csv"
if [ ! -e "$post_crepe_src" ]; then
   echo ${red}file $post_crepe_src not exist$defcol > $out_place
   popd > /dev/null
   exit 1
fi
if [ $USE_ANALYZE_CACHE -eq 1 ] && [ -e "$post_crepe_dst" ]; then
    debug_log ${green}file $post_crepe_dst already exist$defcol > $out_place
else
    # 本処理
    debug_log python -m post-crepe \"$post_crepe_src\" > $out_place
         python -m post-crepe "$post_crepe_src"
fi

# コード推定
chord_ext_src=$1  #"./resources/$filename"
chord_ext_dst="./resources/$filename.chords.json"

if [ ! -e "$chord_ext_src" ]; then
    echo ${red}file $chord_ext_src not exist$defcol > $out_place
    popd > /dev/null
    exit 1
fi
if [ $USE_ANALYZE_CACHE -eq 1 ] && [ -e "$chord_ext_dst" ]; then
    debug_log ${green}file $chord_ext_dst already exist$defcol > $out_place
else
    # 本処理
    debug_log python -m chordExtract \"$chord_ext_src\" > $out_place
         python -m chordExtract "$chord_ext_src"
fi

# コードをローマ数字変換
chord_to_roman_src=$chord_ext_dst
chord_to_roman_dst="./resources/$filename.roman.json"
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
fi
cat "$chord_to_roman_dst"

# TODO: メロディ分析結果を得る

popd > /dev/null
