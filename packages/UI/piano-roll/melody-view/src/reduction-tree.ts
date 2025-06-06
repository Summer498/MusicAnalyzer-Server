import { PianoRollConverter } from "@music-analyzer/view-parameters";
import { DMelodyController, GravityController, HierarchyLevelController, MelodyBeepController, MelodyColorController, TimeRangeController } from "@music-analyzer/controllers";
import { AudioReflectableRegistry, WindowReflectableRegistry } from "@music-analyzer/view";
import { SerializedTimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";

interface RequiredByMelodyElements {
  readonly gravity: GravityController
  readonly audio: AudioReflectableRegistry,
  readonly d_melody: DMelodyController,
  readonly window: WindowReflectableRegistry
  readonly time_range: TimeRangeController

  readonly melody_beep: MelodyBeepController
  readonly melody_color: MelodyColorController
  readonly hierarchy: HierarchyLevelController,
}

class Line {
  constructor(
    readonly pos1: { x: number, y: number },
    readonly pos2: { x: number, y: number },
  ) { }
}

interface RequiredByTreeHierarchy {
  readonly hierarchy: HierarchyLevelController,
  readonly audio: AudioReflectableRegistry,
  readonly window: WindowReflectableRegistry,
  readonly time_range: TimeRangeController
}

export interface TreeHierarchy {
  readonly svg: SVGGElement;
  onChangedLayer(value: number): void;
  onAudioUpdate(): void;
  onWindowResized(): void;
  onTimeRangeChanged(): void;
}
export const createTreeHierarchy = (svg: SVGGElement): TreeHierarchy => ({
  svg,
  onChangedLayer: () => {},
  onAudioUpdate: () => {},
  onWindowResized: () => {},
  onTimeRangeChanged: () => {},
});

export function buildTree(
    h_melodies: SerializedTimeAndAnalyzedMelody[][],
    controllers: RequiredByMelodyElements,
  ): TreeHierarchy {

  const root = { x: 0, y: Math.ceil(200 / h_melodies.length) * h_melodies.length };
  const leafY = 0;
  const height = leafY - root.y;

  const layerY = h_melodies.map((_, i) => root.y + i * height / h_melodies.length);
  const leafXs = h_melodies.map(layer => layer.map(e => PianoRollConverter.scaled(e.head.begin)));

  const startPos: { x: number, y: number }[] = [root]

  const ly = leafY
  const getNextPos = (i: number) => {
    const s = startPos[i];
    return leafXs[i].map(lx => {
      const D = s.x - lx
      const b = s.x * ly - lx * s.y
      const x = (layerY[i] * D - b) / (s.y - ly);
      const y = layerY[i];

      startPos[i + 1] = { x, y };
      return new Line(
        { x, y },
        { x: lx, y: ly },
      )
    })
  }

  const lines = [...Array(h_melodies.length)].map((e, i) => getNextPos(i));

  const children = [...Array(h_melodies.length)].map((e, i) => {
    return lines[i].map((line, j) => {
      const l = document.createElementNS("http://www.w3.org/2000/svg", "line");
      l.id = `line-${i}-${j}`;
      l.setAttribute("stroke", "#222")
      l.setAttribute("strokeWidth", "2");
      l.setAttribute("x1", String(line.pos1.x))
      l.setAttribute("x2", String(line.pos2.x))
      l.setAttribute("y1", String(line.pos1.y))
      l.setAttribute("y2", String(line.pos2.y))
      l.setAttribute("visibility", "hidden")
      return l
    })
  })
  
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svg.id = "reduction-tree";

  const hierarchy = createTreeHierarchy(svg)

  controllers.hierarchy.addListeners(hierarchy.onChangedLayer);
  controllers.audio.addListeners(hierarchy.onAudioUpdate);
  controllers.window.addListeners(hierarchy.onWindowResized);
  controllers.time_range.addListeners(hierarchy.onTimeRangeChanged)

  return hierarchy;

}


