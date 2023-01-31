#!/bin/bash -e
# mimicopy is derived from 耳コピ (Japanese word meaning sound transcription)
# 文字コードは UTF-8
pushd `dirname "$0"` > /dev/null

red=[31m
green=[32m
defcol=[39m
filename=`basename "$1"`  # 引数1から 
songname=`basename "$1" | sed -e 's/\.[^\.]*$//'`  # 引数1から拡張子を取り除く
out_place="/dev/stderr"
export PYTHONPATH="./python:$PYTHONPATH"

# 音源分離
separate_src=$1  #"./resources/$filename"
separate_dst="./separated/htdemucs/$songname"
if [ ! -e "$separate_src" ]; then
    echo ${red}file $separate_src not exist$defcol > $out_place
    popd > /dev/null
    exit 1
fi
if [ -e "$separate_dst" ]; then
    echo ${green}folder $separate_dst already exist$defcol > $out_place
else
    # 本処理
    echo python -m demucs -d cuda \"$separate_src\" > $out_place
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
if [ -e "$extract_dst" ]; then
    echo ${green}file $extract_dst already exist$defcol > $out_place
else
    # 本処理
    echo python -m crepe \"$extract_src\" > $out_place
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
if [ -e "$post_crepe_dst" ]; then
   echo ${green}file $post_crepe_dst already exist$defcol > $out_place
else
    # 本処理
    echo python -m post-crepe \"$post_crepe_src\" > $out_place
         python -m post-crepe "$post_crepe_src"
fi

# コード推定
chord_ext_src=$1  #"./resources/$filename"
chord_ext_dst_withtime="./resources/$filename.chords.json"
chord_ext_dst="./resources/$filename.chords.txt"

if [ ! -e "$chord_ext_src" ]; then
    echo ${red}file $chord_ext_src not exist$defcol > $out_place
    popd > /dev/null
    exit 1
fi
if [ -e "$chord_ext_dst_withtime" ] && [ -e "$chord_ext_dst" ]; then
    echo ${green}file $chord_ext_dst_withtime already exist$defcol > $out_place
    echo ${green}file $chord_ext_dst already exist$defcol > $out_place
else
    # 本処理
    echo python -m chordExtract \"$chord_ext_src\" > $out_place
         python -m chordExtract "$chord_ext_src"
fi

# コードをローマ数字変換
chord_to_roman_src=$chord_ext_dst
chord_to_roman_dst="./resources/$filename.roman.json"
if [ ! -e "$chord_to_roman_src" ]; then
    echo ${red}file $chord_to_roman_src not exist$defcol > $out_place
    popd > /dev/null
    exit 1
fi
if [ -e "$chord_to_roman_dst" ]; then
    echo ${green}file $chord_to_roman_dst already exist$defcol > $out_place
else
    echo "node ./chordToRoman < \"$chord_ext_dst\" > \"$chord_to_roman_dst\""
    node ./chordToRoman < "$chord_ext_dst" > "$chord_to_roman_dst"
fi

popd > /dev/null
