green=[32m
defcol=[39m

shopt -s globstar  # ** の有効化

depCheck(){
    local -r dist="$1"
    local -r res="$(npx depcheck $(dirname $dist))"
    echo -e "$(dirname $dist)\r\n$res\r\n\r\n"
}


for dist in packages/**/package.json; do
    if echo "$dist" | grep -q "node_modules"; then
        : #
    else
        depCheck $dist &
    fi
done

depCheck ./html/package.json &
depCheck ./html/analyze/package.json &
depCheck ./html/hierarchical-analysis-sample/package.json &

wait
exit
