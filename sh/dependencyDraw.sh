shopt -s globstar  # ** の有効化

draw(){
  npx depcruise "$(dirname "$1")" --output-type dot | neato -T svg > "$(dirname "$1")/dependency-graph.svg"
#  npx depcruise "$(dirname "$1")" --output-type dot | dot -T svg > "$(dirname "$1")/dependency-graph.svg"
  echo "$1"
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