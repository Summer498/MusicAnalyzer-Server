green=[32m
defcol=[39m

# js ファイルを消すことで直接 ts ファイルをテストする
# js ファイル内には依存先パッケージも複製されて含まれているので, js ファイルが存在する状態でテストをすると正確なコードカバレッジが計れない
# また, 余計な処理を省くことでテストの高速化も図れる
if find packages/*/dist/*.js -type f > /dev/null 2>&1; then
    for dist in packages/*/dist; do
        echo ${green}remove $dist$defcol
        rm -R $dist
    done
fi

for dist in packages/*/.turbo; do
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
