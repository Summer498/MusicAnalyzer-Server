import sys
import json
import autochord
import os


def main():
    file_path = f"{sys.argv[1]}"
    file_name = os.path.basename(file_path)
    file_out = f"./resources/{file_name}.chords.json"

    chords_with_time = autochord.recognize(file_path)
    with open(file_out, "w+") as f:
        f.write(json.dumps(chords_with_time))
    exit(0)


if __name__ == '__main__':
    main()
