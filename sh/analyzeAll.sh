green=[32m
defcol=[39m

for file in resources/*/*.*; do
    echo ${green}analyze $file${defcol}
    #./ranalyze.sh "$file" 0 0 --roman_reanalyze > /dev/null
    #./manalyze.sh "$file" 0 0 --melody_reanalyze > /dev/null
    ./ranalyze.sh "$file" -q > /dev/null
    ./manalyze.sh "$file" -q > /dev/null
done