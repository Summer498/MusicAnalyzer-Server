green=[32m
defcol=[39m

# js ファイルを消すことで直接 ts ファイルをテストする
# js ファイル内には依存先パッケージも複製されて含まれているので, js ファイルが存在する状態でテストをすると正確なコードカバレッジが計れない
# また, 余計な処理を省くことでテストの高速化も図れる
if find packages/*/dist/*.js -type f > /dev/null 2>&1; then
    for dist in packages/*/dist; do
        echo $green$dist$defcol
        rm -R $dist
    done
fi

yarn test