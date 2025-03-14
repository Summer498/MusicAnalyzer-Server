green=[32m
defcol=[39m

shopt -s globstar  # ** の有効化

for dist in packages/**/package.json; do
    if echo "$dist" | grep -q "node_modules"; then
        : #
    else
        echo $(dirname $dist)
        npx depcheck $(dirname $dist)
        echo ""
    fi
done

exit

echo ./html
npx depcheck ./html
echo ""

echo ./html/analyze
npx depcheck ./html/analyze
echo ""

echo ./html/hierarchical-analysis-sample
npx depcheck ./html/hierarchical-analysis-sample
echo ""

