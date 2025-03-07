#!/bin/bash

# 01から100までループ
for i in $(seq -w 1 99); do
  # コピーするためのファイル
  src_file=$(find ./resources/gttm-example/${i}/ -maxdepth 1 -type f -name "${i}_*.xml" | head -n 1)
  # src_file="./resources/${i}/${i}_song name"
  dest_file="./resources/gttm-example/${i}/MSC-${i}.xml"

  # コピー元のファイルが存在するか確認
  if [ -d $dest_file ]; then
    rm -R $dest_file
  fi

  if [ -n "$src_file" ]; then
    # コピー先のディレクトリが存在しない場合は作成
    # mkdir -p "$dest_file"
    
    # コピーを実行
    cp "$src_file" "$dest_file"
    
    echo "ファイルを ${dest_file} にコピーしました。"
  else
    echo "ファイル ${src_file} が見つかりません。"
  fi
done