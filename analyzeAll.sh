green=[32m
defcol=[39m

for file in resources/*; do
    echo $green$file$defcol
    ./mimicopy.sh "$file" > /dev/null
    ./manalyze.sh "$file" > /dev/null
done