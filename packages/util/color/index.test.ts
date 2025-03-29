import { noteChromaToColor } from "./src/note-chroma-to-color";
import { fifthChromaToColor } from "./src/fifth-chroma-to-color";
import { fifthToColor } from "./src/fifth-to-color";
import { noteToColor } from "./src/note-to-color";
import { rgbToString } from "./src/rgb-to-string";
import { hsv2rgb } from "./src/hsv2rgb";
import { map2rgbByHue } from "./src/util";

describe("test map2rgbByHue", () => {
  it('should return correct RGB sheed for H = 0 to 5', () => {
    expect(map2rgbByHue(0, 1, 0.5)).toEqual([1, 0.5, 0]);
    expect(map2rgbByHue(1, 1, 0.5)).toEqual([0.5, 1, 0]);
    expect(map2rgbByHue(2, 1, 0.5)).toEqual([0, 1, 0.5]);
    expect(map2rgbByHue(3, 1, 0.5)).toEqual([0, 0.5, 1]);
    expect(map2rgbByHue(4, 1, 0.5)).toEqual([0.5, 0, 1]);
    expect(map2rgbByHue(5, 1, 0.5)).toEqual([1, 0, 0.5]);
    expect(()=>map2rgbByHue(-1, 1, 0.5)).toThrow(`Unexpected value received. It should be in 0 <= h < 6, but h is ${-1}`);
    expect(()=>map2rgbByHue(6, 1, 0.5)).toThrow(`Unexpected value received. It should be in 0 <= h < 6, but h is ${6}`);
  });
});

describe("test hsv2rgb", () => {
  it('should return correct RGB values for h = 0', () => {
    expect(hsv2rgb(0, 1, 1)).toEqual([255, 0, 0]); // pure red
  });

  it('should return correct RGB values for h = 60', () => {
    expect(hsv2rgb(60, 1, 1)).toEqual([255, 255, 0]); // pure yellow
  });

  it('should return correct RGB values for h = 120', () => {
    expect(hsv2rgb(120, 1, 1)).toEqual([0, 255, 0]); // pure green
  });

  it('should return correct RGB values for h = 180', () => {
    expect(hsv2rgb(180, 1, 1)).toEqual([0, 255, 255]); // pure cyan
  });

  it('should return correct RGB values for h = 240', () => {
    expect(hsv2rgb(240, 1, 1)).toEqual([0, 0, 255]); // pure blue
  });

  it('should return correct RGB values for h = 300', () => {
    expect(hsv2rgb(300, 1, 1)).toEqual([255, 0, 255]); // pure magenta
  });

  it('should return shades of gray for s = 0', () => {
    expect(hsv2rgb(0, 0, 0.5)).toEqual([128, 128, 128]); // gray
  });

  it('should return black for v = 0', () => {
    expect(hsv2rgb(0, 1, 0)).toEqual([0, 0, 0]); // black
  });

  it('should handle edge values correctly', () => {
    expect(hsv2rgb(360, 1, 1)).toEqual([255, 0, 0]); // same as h = 0
    expect(hsv2rgb(0, 0, 1)).toEqual([255, 255, 255]); // white
  });

  it('should handle non-integer hue values correctly', () => {
    expect(hsv2rgb(30, 1, 1)).toEqual([255, 128, 0]); // halfway between red and yellow
    expect(hsv2rgb(90, 1, 1)).toEqual([128, 255, 0]); // halfway between yellow and green
  });

  // Additional cases for saturation and value at edge values
  it('should handle s = 1, v < 1 correctly', () => {
    expect(hsv2rgb(0, 1, 0.5)).toEqual([128, 0, 0]); // dark red
    expect(hsv2rgb(120, 1, 0.5)).toEqual([0, 128, 0]); // dark green
  });

  it('should handle s < 1, v = 1 correctly', () => {
    expect(hsv2rgb(240, 0.5, 1)).toEqual([128, 128, 255]); // light blue
    expect(hsv2rgb(60, 0.5, 1)).toEqual([255, 255, 128]); // light yellow
  });

  it('should handle boundary conditions correctly', () => {
    expect(hsv2rgb(359, 1, 1)).toEqual([255, 0, 4]); // near-red, just before 360
    expect(hsv2rgb(1, 1, 1)).toEqual([255, 4, 0]); // near-red, just after 0
  });

  it('should throw error', () => {
    expect(()=>hsv2rgb(0, 2, 1)).toThrow(`Unexpected value received. It should be in 0 <= s <= 1, but max is ${2}`);
    expect(()=>hsv2rgb(0, -1, 0)).toThrow(`Unexpected value received. It should be in 0 <= s <= 1, but max is ${-1}`);
    expect(()=>hsv2rgb(0, 1, 2)).toThrow(`Unexpected value received. It should be in 0 <= v <= 1, but mid is ${2}`);
    expect(()=>hsv2rgb(0, 0, -1)).toThrow(`Unexpected value received. It should be in 0 <= v <= 1, but mid is ${-1}`);
  });
});


// Mocking the hsv2rgb function
jest.mock("@music-analyzer/tonal-objects", () => ({
  _Note: {
    chroma: jest.fn((note) => {
      // Mock implementation of _Note.chroma
      // Example: return a chroma value based on note
      const chromaMap: { [key: string]: number } = {
        'C': 0, 'Db': 1, 'D': 2, 'Eb': 3, 'E': 4, 'F': 5,
        'Gb': 6, 'G': 7, 'Ab': 8, 'A': 9, 'Bb': 10, 'B': 11
      };
      return chromaMap[note] || 0;
    }),
  }
}));

describe('rgbToString', () => {
  it('should convert RGB array to hex string correctly', () => {
    expect(rgbToString([255, 0, 0])).toBe('#ff0000'); // red
    expect(rgbToString([0, 255, 0])).toBe('#00ff00'); // green
    expect(rgbToString([0, 0, 255])).toBe('#0000ff'); // blue
    expect(rgbToString([255, 255, 255])).toBe('#ffffff'); // white
    expect(rgbToString([0, 0, 0])).toBe('#000000'); // black
  });
});

describe('noteChromaToColor', () => {
  it('should convert note chroma to color correctly', () => {
    expect(noteChromaToColor(0, 1, 1)).toBe('#00ff00'); // C
    expect(noteChromaToColor(4, 1, 1)).toBe('#0000ff'); // E
    expect(noteChromaToColor(8, 1, 1)).toBe('#ff0000'); // Ab
  });
});

describe('noteToColor', () => {
  it('should convert note to color correctly', () => {
    expect(noteToColor('C', 1, 1)).toBe('#00ff00'); // C
    expect(noteToColor('E', 1, 1)).toBe('#0000ff'); // E
    expect(noteToColor('Ab', 1, 1)).toBe('#ff0000'); // Ab
    expect(noteToColor('', 1, 1)).toBe('rgb(64, 64, 64)'); // Default color for empty note
  });
});

describe('fifthChromaToColor', () => {
  it('should convert fifth chroma to color correctly', () => {
    expect(fifthChromaToColor(0, 1, 1)).toBe('#00ff00'); // C
    expect(fifthChromaToColor(4, 1, 1)).toBe('#0000ff'); // E
    expect(fifthChromaToColor(8, 1, 1)).toBe('#ff0000'); // Ab
  });
});

describe('fifthToColor', () => {
  it('should convert note to color correctly in fifths', () => {
    expect(fifthToColor('C', 1, 1)).toBe('#00ff00'); // C
    expect(fifthToColor('E', 1, 1)).toBe('#0000ff'); // E
    expect(fifthToColor('Ab', 1, 1)).toBe('#ff0000'); // Ab
    expect(fifthToColor('', 1, 1)).toBe('rgb(64, 64, 64)'); // Default color for empty note
  });
});

afterAll(() => {
  jest.resetModules();
});
