green=[32m
defcol=[39m

for file in resources/*; do
    echo $green$file$defcol
    #./mimicopy.sh "$file" 0 0 --roman_reanalyze > /dev/null
    #./manalyze.sh "$file" 0 0 --melody_reanalyze > /dev/null
    ./mimicopy.sh "$file" > /dev/null
    ./manalyze.sh "$file" > /dev/null
done