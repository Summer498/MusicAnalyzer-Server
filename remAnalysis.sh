#!/bin/bash -e
# 文字コードは UTF-8
# -m, --melody, remove melody analysis
# -c, --chord, remove chord analysis
# -r, --roman, remove roman analysis

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
melody=0
chord=0
roman=0
while (( $# > 0 ))
do
    # 配列の番号を対応付けること
    short=(m c r)
    long=(
        "--melody"
        "--chord"
        "--roman"
    )
    command=(
        "melody=1"
        "chord=1"
        "roman=1"
    )
    if [[ "$1" =~ ^--.*  ]]; then  # long options
        processOptions $1 ${long[*]}
        elif [[ "$1" =~ ^-.* ]]; then  # short option
        processOptions $1 ${short[*]}
        elif [[ "$1" =~ .* ]]; then  # 引数
        filepath="$1"
        filename=`basename "$1"`  # 引数のファイル名
        songname=`basename "$1" | sed -e 's/\.[^\.]*$//'`  # 引数から拡張子を取り除く
    fi
    shift
done

removeAll(){
    targets=$1
    for filename in $targets; do
        echo "$filename"
        cat "$filename"
    done
    echo ""
    echo 誤削除防止のセーフガードをかけています。
}

if [ $melody -eq 1 ]; then
    removeAll "./resources/*/analyzed/melody/manalyze.json"
fi

if [ $chord -eq 1 ]; then
    removeAll "./resources/*/analyzed/chord/chords.json"
fi

if [ $roman -eq 1 ]; then
    removeAll "./resources/*/analyzed/chord/roman.json"
fi
