green=[32m
defcol=[39m


echo ./html
npx depcheck ./html
echo ""

echo ./html/analyze
npx depcheck ./html/analyze
echo ""

echo ./html/hierarchical-analysis-sample
npx depcheck ./html/hierarchical-analysis-sample
echo ""

if find packages/**/package.json -type f > /dev/null 2>&1; then
    for dist in packages/**/package.json; do
        echo $(dirname $dist)
        npx depcheck $(dirname $dist)
        echo ""
    done
fi

