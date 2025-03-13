green=[32m
defcol=[39m

if find packages/**/package.json -type f > /dev/null 2>&1; then
    for dist in packages/**/package.json; do
        echo $(dirname $dist)
        npx depcheck $(dirname $dist)
        echo ""
    done
fi

