shopt -s globstar  # ** の有効化

draw(){
  echo "$1"
  npx depcruise "$(dirname "$1")" --output-type dot | dot -T svg > "$(dirname "$1")/dependency-graph.svg"
}

draw ./packages &

for dist in packages/**/package.json; do
    if echo "$dist" | grep -q "node_modules"; then
        : #
    else
        draw $dist &
    fi
done

wait
exit