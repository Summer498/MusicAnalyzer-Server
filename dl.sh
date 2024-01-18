#!/bin/bash -e
# mimicopy is derived from 耳コピ (Japanese word meaning sound transcription)
# 文字コードは UTF-8
# dl.sh song_URL
pushd `dirname "$0"` > /dev/null

red=[31m
green=[32m
defcol=[39m

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


song_URL="$1"
save_dir="videos"
yt-dlp -o "$save_dir/%(uploader)s/%(fulltitle)s.%(ext)s" -f "ba*" -S "+size" --merge-output-format webm --recode-video mp4 $song_URL
