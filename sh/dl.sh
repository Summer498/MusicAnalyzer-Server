#!/bin/bash -e
# 文字コードは UTF-8
# dl.sh song_URL
pushd `dirname "$0"` > /dev/null

readonly song_URL="$1"
readonly save_dir="videos"
yt-dlp -o "$save_dir/%(uploader)s/%(fulltitle)s.%(ext)s" -f "ba*" -S "+size" --merge-output-format webm --recode-video mp4 $song_URL

popd > /dev/null