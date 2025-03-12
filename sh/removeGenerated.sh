green=[32m
defcol=[39m

if find packages/**/dist/*.js -type f > /dev/null 2>&1; then
    for dist in packages/**/dist; do
        echo ${green}remove $dist$defcol
        rm -R $dist
    done
fi

for dist in packages/**/.turbo; do
    echo ${green}remove $dist$defcol
    rm -R $dist
done

echo ${green}remove .turbo$defcol
rm -R .turbo

echo ${green}remove html/dist$defcol
rm -R html/dist

echo ${green}remove html/.turbo$defcol
rm -R html/.turbo

echo ${green}remove html/analyze/dist$defcol
rm -R html/analyze/dist

echo ${green}remove html/analyze/.turbo$defcol
rm -R html/analyze/.turbo

echo ${green}remove html/hierarchical-analysis-sample/dist$defcol
rm -R html/hierarchical-analysis-sample/dist

echo ${green}remove html/hierarchical-analysis-sample/.turbo$defcol
rm -R html/hierarchical-analysis-sample/.turbo

echo ${green}remove ServerProgram/.turbo$defcol
rm -R ServerProgram/.turbo
