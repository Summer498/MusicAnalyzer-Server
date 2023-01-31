import sys
import io
import json
import autochord
import os

def main():
    file_path = f"{sys.argv[1]}"
    file_name = os.path.basename(file_path)
    file_out = f"./resources/{file_name}.chords.json"
    file_joint = f"./resources/{file_name}.chords.txt"

    chords_with_time = autochord.recognize(file_path)
    with open(file_out, "w+") as f:
        f.write(json.dumps(chords_with_time))
    chords_only = ["".join(e[2].split(":")) for e in chords_with_time]  # e: [begin_time:float, end_time:float, chord:string]
    with open(file_joint, "w+") as f:
        f.write(" ".join(chords_only))
    exit(0)

if __name__ == '__main__':
    main()
