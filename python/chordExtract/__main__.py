import sys
import io
import json
import autochord

def main():
    file_dir = f"{sys.argv[1]}"
    file_out = f"{file_dir}.chords.json"
    file_joint = f"{file_dir}.chords.txt"

    chords_with_time = autochord.recognize(file_dir)
    with open(file_out, "w+") as f:
        f.write(json.dumps(chords_with_time))
    chords_only = ["".join(e[2].split(":")) for e in chords_with_time]  # e: [begin_time:float, end_time:float, chord:string]
    with open(file_joint, "w+") as f:
        f.write(" ".join(chords_only))
    exit(0)

if __name__ == '__main__':
    main()
