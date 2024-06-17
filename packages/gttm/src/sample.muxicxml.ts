import { MusicXML } from "./MusicXML";

export const do_re_mi_musicXml: MusicXML = {
  score_partwise: [
    {},
    {
      version: 3.1,
      work: {
        work_title: "Title"
      },
      identification: {
        creator: {
          type: "composer",
          text: "Composer"
        },
        encoding: {
          software: "MuseScore 3.6.2",
          encoding_date: "2024-02-07",
          supports: [
            {
              element: "accidental",
              type: "yes"
            },
            {
              element: "beam",
              type: "yes"
            },
            {
              element: "print",
              attribute: "new-page",
              type: "no"
            },
            {
              element: "print",
              attribute: "new-system",
              type: "no"
            },
            {
              element: "stem",
              type: "yes"
            }
          ]
        }
      },
      defaults: {
        scaling: {
          millimeters: 6.99912,
          tenths: 40
        },
        page_layout: {
          page_height: 1696.93,
          page_width: 1200.48,
          page_margins: [
            {
              type: "even",
              left_margin: 85.7251,
              right_margin: 85.7251,
              top_margin: 85.7251,
              bottom_margin: 85.7251
            },
            {
              type: "odd",
              left_margin: 85.7251,
              right_margin: 85.7251,
              top_margin: 85.7251,
              bottom_margin: 85.7251
            }
          ]
        },
        word_font: {
          font_family: "Edwin",
          font_size: 10
        },
        lyric_font: {
          font_family: "Edwin",
          font_size: 10
        }
      },
      credit: {
        page: 1,
        credit_type: "title",
        credit_words: {
          default_x: 600.241, default_y: 1611.21,
          justify: "center",
          valign: "top",
          font_size: 22,
          text: "ドレミの歌"
        }
      },
      part_list: {
        score_part: {
          id: "P1",
          part_name: "Piano",
          part_abbreviation: "Pno.",
          score_instrument: {
            id: "P1-I1",
            instrument_name: "Piano"
          },
          midi_device: {
            id: "P1-I1",
            port: 1
          },
          midi_instrument: {
            id: "P1-I1",
            midi_channel: 1,
            midi_program: 1,
            volume: 78.7402,
            pan: 0
          }
        }
      },
      part: {
        id: "P1",
        measure: [
          {
            number: 1, width: 230.72,
            print: { system_layout: { system_margins: { left_margin: 0.00, right_margin: 0.00 }, top_system_distance: 113.18 } },
            attributes: { divisions: 2, key: { fifths: 0 }, time: { beats: 4, beat_type: 4 }, clef: { sign: "G", line: 2 } },
            note: [
              { default_x: 84.22, default_y: -50.00, pitch: { step: "C", octave: 4 }, duration: 3, voice: 1, type: "quarter", dot: {}, stem: "up" },
              { default_x: 123.51, default_y: -45.00, pitch: { step: "D", octave: 4 }, duration: 1, voice: 1, type: "eighth", stem: "up" },
              { default_x: 150.07, default_y: -40.00, pitch: { step: "E", octave: 4 }, duration: 3, voice: 1, type: "quarter", dot: {}, stem: "up" },
              { default_x: 189.36, default_y: -50.00, pitch: { step: "C", octave: 4 }, duration: 1, voice: 1, type: "eighth", stem: "up" }
            ]
          },
          {
            number: 2, width: 89.16,
            note: [
              { default_x: 10.00, default_y: -40.00, pitch: { step: "E", octave: 4 }, duration: 2, voice: 1, type: "quarter", stem: "up" },
              { default_x: 31.49, default_y: -50.00, pitch: { step: "C", octave: 4 }, duration: 2, voice: 1, type: "quarter", stem: "up" },
              { default_x: 52.98, default_y: -40.00, pitch: { step: "E", octave: 4 }, duration: 4, voice: 1, type: "half", stem: "up" }
            ]
          },
          {
            number: 3, width: 167.82,
            note: [
              { default_x: 10.00, default_y: -45.00, pitch: { step: "D", octave: 4 }, duration: 3, voice: 1, type: "quarter", dot: {}, stem: "up" },
              { default_x: 49.98, default_y: -40.00, pitch: { step: "E", octave: 4 }, duration: 1, voice: 1, type: "eighth", stem: "up" },
              { default_x: 76.54, default_y: -35.00, pitch: { step: "F", octave: 4 }, duration: 1, voice: 1, type: "eighth", stem: "up", beam: { number: 1, text: "begin" } },
              { default_x: 97.03, default_y: -35.00, pitch: { step: "F", octave: 4 }, duration: 1, voice: 1, type: "eighth", stem: "up", beam: { number: 1, text: "continue" } },
              { default_x: 117.53, default_y: -40.00, pitch: { step: "E", octave: 4 }, duration: 1, voice: 1, type: "eighth", stem: "up", beam: { number: 1, text: "continue" } },
              { default_x: 138.02, default_y: -45.00, pitch: { step: "D", octave: 4 }, duration: 1, voice: 1, type: "eighth", stem: "up", beam: { number: 1, text: "end" } }
            ]
          },
          {
            number: 4, width: 63.76,
            note: { default_x: 10.00, default_y: -35.00, pitch: { step: "F", octave: 4 }, duration: 8, voice: 1, type: "whole" }
          },
          {
            number: 5, width: 156.50,
            note: [
              { default_x: 10.00, default_y: -40.00, pitch: { step: "E", octave: 4 }, duration: 3, voice: 1, type: "quarter", dot: {}, stem: "up" },
              { default_x: 49.29, default_y: -35.00, pitch: { step: "F", octave: 4 }, duration: 1, voice: 1, type: "eighth", stem: "up" },
              { default_x: 75.85, default_y: -30.00, pitch: { step: "G", octave: 4 }, duration: 3, voice: 1, type: "quarter", dot: {}, stem: "up" },
              { default_x: 115.14, default_y: -40.00, pitch: { step: "E", octave: 4 }, duration: 1, voice: 1, type: "eighth", stem: "up" }
            ]
          },
          {
            number: 6, width: 89.16,
            note: [
              { default_x: 10.00, default_y: -30.00, pitch: { step: "G", octave: 4 }, duration: 2, voice: 1, type: "quarter", stem: "up" },
              { default_x: 31.49, default_y: -40.00, pitch: { step: "E", octave: 4 }, duration: 2, voice: 1, type: "quarter", stem: "up" },
              { default_x: 52.98, default_y: -30.00, pitch: { step: "G", octave: 4 }, duration: 4, voice: 1, type: "half", stem: "up" }
            ]
          },
          {
            number: 7, width: 167.82,
            note: [
              { default_x: 10.00, default_y: -35.00, pitch: { step: "F", octave: 4 }, duration: 3, voice: 1, type: "quarter", dot: {}, stem: "up" },
              { default_x: 49.98, default_y: -30.00, pitch: { step: "G", octave: 4 }, duration: 1, voice: 1, type: "eighth", stem: "up" },
              { default_x: 76.54, default_y: -25.00, pitch: { step: "A", octave: 4 }, duration: 1, voice: 1, type: "eighth", stem: "up", beam: { number: 1, text: "begin" } },
              { default_x: 97.03, default_y: -25.00, pitch: { step: "A", octave: 4 }, duration: 1, voice: 1, type: "eighth", stem: "up", beam: { number: 1, text: "continue" } },
              { default_x: 117.53, default_y: -30.00, pitch: { step: "G", octave: 4 }, duration: 1, voice: 1, type: "eighth", stem: "up", beam: { number: 1, text: "continue" } },
              { default_x: 138.02, default_y: -35.00, pitch: { step: "F", octave: 4 }, duration: 1, voice: 1, type: "eighth", stem: "up", beam: { number: 1, text: "end" } }
            ]
          },
          {
            number: 8, width: 63.76,
            note: { default_x: 10.00, default_y: -25.00, pitch: { step: "A", octave: 4 }, duration: 8, voice: 1, type: "whole" }
          },
          {
            number: 9, width: 217.38,
            note: [
              { default_x: 58.59, default_y: -30.00, pitch: { step: "G", octave: 4 }, duration: 3, voice: 1, type: "quarter", dot: {}, stem: "up" },
              { default_x: 98.96, default_y: -50.00, pitch: { step: "C", octave: 4 }, duration: 1, voice: 1, type: "eighth", stem: "up" },
              { default_x: 125.51, default_y: -45.00, pitch: { step: "D", octave: 4 }, duration: 1, voice: 1, type: "eighth", stem: "up", beam: { number: 1, text: "begin" } },
              { default_x: 146.20, default_y: -40.00, pitch: { step: "E", octave: 4 }, duration: 1, voice: 1, type: "eighth", stem: "up", beam: { number: 1, text: "continue" } },
              { default_x: 166.89, default_y: -35.00, pitch: { step: "F", octave: 4 }, duration: 1, voice: 1, type: "eighth", stem: "up", beam: { number: 1, text: "continue" } },
              { default_x: 187.58, default_y: -30.00, pitch: { step: "G", octave: 4 }, duration: 1, voice: 1, type: "eighth", stem: "up", beam: { number: 1, text: "end" } }
            ]
          },
          {
            number: 10, width: 64.72,
            note: { default_x: 10.00, default_y: -25.00, pitch: { step: "A", octave: 4 }, duration: 8, voice: 1, type: "whole" }
          },
          {
            number: 11, width: 186.13,
            note: [
              { default_x: 10.00, default_y: -25.00, pitch: { step: "A", octave: 4 }, duration: 3, voice: 1, type: "quarter", dot: {}, stem: "up" },
              { default_x: 54.60, default_y: -45.00, pitch: { step: "D", octave: 4 }, duration: 1, voice: 1, type: "eighth", stem: "up" },
              { default_x: 81.16, default_y: -40.00, pitch: { step: "E", octave: 4 }, duration: 1, voice: 1, type: "eighth", stem: "up", beam: { number: 1, text: "begin" } },
              { default_x: 110.61, default_y: -35.00, pitch: { step: "F", alter: 1, octave: 4 }, duration: 1, voice: 1, type: "eighth", accidental: "sharp", stem: "up", beam: { number: 1, text: "continue" } },
              { default_x: 133.48, default_y: -30.00, pitch: { step: "G", octave: 4 }, duration: 1, voice: 1, type: "eighth", stem: "up", beam: { number: 1, text: "continue" } },
              { default_x: 156.34, default_y: -25.00, pitch: { step: "A", octave: 4 }, duration: 1, voice: 1, type: "eighth", stem: "up", beam: { number: 1, text: "end" } }
            ]
          },
          {
            number: 12, width: 64.53,
            note: { default_x: 10.96, default_y: -20.00, pitch: { step: "B", octave: 4 }, duration: 8, voice: 1, type: "whole" }
          },
          {
            number: 13, width: 203.49,
            note: [
              { default_x: 10.00, default_y: -20.00, pitch: { step: "B", octave: 4 }, duration: 3, voice: 1, type: "quarter", dot: {}, stem: "down" },
              { default_x: 56.03, default_y: -40.00, pitch: { step: "E", octave: 4 }, duration: 1, voice: 1, type: "eighth", stem: "up" },
              { default_x: 97.05, default_y: -35.00, pitch: { step: "F", alter: 1, octave: 4 }, duration: 1, voice: 1, type: "eighth", accidental: "sharp", stem: "up", beam: { number: 1, text: "begin" } },
              { default_x: 126.50, default_y: -30.00, pitch: { step: "G", alter: 1, octave: 4 }, duration: 1, voice: 1, type: "eighth", accidental: "sharp", stem: "up", beam: { number: 1, text: "continue" } },
              { default_x: 150.09, default_y: -25.00, pitch: { step: "A", octave: 4 }, duration: 1, voice: 1, type: "eighth", stem: "up", beam: { number: 1, text: "continue" } },
              { default_x: 173.69, default_y: -20.00, pitch: { step: "B", octave: 4 }, duration: 1, voice: 1, type: "eighth", stem: "up", beam: { number: 1, text: "end" } }
            ]
          },
          {
            number: 14, width: 118.27,
            note: [
              { default_x: 10.00, default_y: -15.00, pitch: { step: "C", octave: 5 }, duration: 6, voice: 1, type: "half", dot: {}, stem: "down" },
              { default_x: 59.02, default_y: -20.00, pitch: { step: "B", octave: 4 }, duration: 1, voice: 1, type: "eighth", stem: "up", beam: { number: 1, text: "begin" } },
              { default_x: 88.48, default_y: -25.00, pitch: { step: "A", alter: 1, octave: 4 }, duration: 1, voice: 1, type: "eighth", accidental: "sharp", stem: "up", beam: { number: 1, text: "end" } }
            ]
          },
          {
            number: 15, width: 108.12,
            note: [
              { default_x: 10.00, default_y: -25.00, pitch: { step: "A", octave: 4 }, duration: 2, voice: 1, type: "quarter", stem: "up" },
              { default_x: 32.78, default_y: -35.00, pitch: { step: "F", octave: 4 }, duration: 2, voice: 1, type: "quarter", stem: "up" },
              { default_x: 55.55, default_y: -20.00, pitch: { step: "B", octave: 4 }, duration: 2, voice: 1, type: "quarter", stem: "down" },
              { default_x: 78.33, default_y: -30.00, pitch: { step: "G", octave: 4 }, duration: 2, voice: 1, type: "quarter", stem: "up" }
            ]
          },
          {
            number: 16, width: 66.06,
            note: { default_x: 10.96, default_y: -15.00, pitch: { step: "C", octave: 5 }, duration: 8, voice: 1, type: "whole" },
            barline: {
              location: "right",
              bar_style: "light-heavy"
            }
          }
        ]
      }
    }
  ]
};