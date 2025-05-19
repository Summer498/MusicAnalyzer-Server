import { SerializedTimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { AudioReflectableRegistry, PianoRollTranslateX } from "@music-analyzer/view";
import { WindowReflectableRegistry } from "@music-analyzer/view";
import { DMelodySeries } from "./d-melody-series";
import { ReductionHierarchy } from "./reduction-hierarchy";
import { GravityHierarchy } from "./gravity-hierarchy";
import { IRPlotSVG } from "./ir-plot-svg";
import { HierarchyBuilder } from "./hierarchy-builder";
import { IRSymbolHierarchy } from "./ir-symbol-hierarchy";
import { MelodyHierarchy } from "./melody-hierarchy";
import { DMelodyController, GravityController, HierarchyLevelController, MelodyBeepController, MelodyColorController, TimeRangeController } from "@music-analyzer/controllers";
import { insertMelody } from "./melody-editor/insert";

interface Controllers {
  readonly d_melody: DMelodyController,
  readonly melody_beep: MelodyBeepController,
  readonly time_range: TimeRangeController,
  readonly window: WindowReflectableRegistry,
  readonly melody_color: MelodyColorController,
  readonly audio: AudioReflectableRegistry,
  readonly hierarchy: HierarchyLevelController,
  readonly gravity: GravityController,
}

const setControllers = (
  d_melodies: DMelodySeries,
  melody: MelodyHierarchy,
  ir_symbol: IRSymbolHierarchy,
  ir_plot: IRPlotSVG,
  chord_gravity: GravityHierarchy,
  scale_gravity: GravityHierarchy,
  reduction: ReductionHierarchy,
) => (
  controllers: Controllers,
) => {
    const onAudioUpdate = (svg: SVGGElement) => { svg.setAttribute("transform", `translate(${PianoRollTranslateX.get()})`); }

    const audioListeners = [
      ...[melody, ir_symbol, reduction, scale_gravity, chord_gravity, ...ir_plot.children, d_melodies]
        .flatMap(e => e.children.map(e => e))
        .map(e => () => e.onAudioUpdate()),
    ]
    controllers.audio.addListeners(...audioListeners);
    audioListeners.forEach(f=>f())

    const windowListeners = [...[melody, ir_symbol, reduction, scale_gravity, chord_gravity, ...ir_plot.children]
      .flatMap(e => e.children.map(e => e)), d_melodies]
      .flatMap(e => e.children.map(e => e))
      .map(e => e.onWindowResized.bind(e))
    controllers.window.addListeners(...windowListeners);

    const hierarchyListeners = [melody, ir_symbol, reduction, chord_gravity, scale_gravity, ...ir_plot.children,]
      .map(e => e.onChangedLayer.bind(e))
    controllers.hierarchy.addListeners(...hierarchyListeners);

    const timeRangeListeners = [...[melody, ir_symbol, reduction, chord_gravity, scale_gravity]
      .flatMap(e => e.children.map(e => e)), d_melodies]
      .flatMap(e => e.children.map(e => e))
      .map(e => e.onTimeRangeChanged.bind(e))
    controllers.time_range.addListeners(...timeRangeListeners);

    const melodyColorListeners = [
      ...melody.children,
      ...ir_symbol.children,
      ...reduction.children,
      ...ir_plot.children.flatMap(e => e.children),
    ]
      .flatMap(e => e.children.flatMap(e => e))
      .map(e => e.setColor.bind(e))
    controllers.melody_color.addListeners(...melodyColorListeners);

    controllers.d_melody.addListeners(d_melodies.onDMelodyVisibilityChanged.bind(d_melodies));
    const melodyBeepCheckBoxListeners = melody.children.flatMap(e => e.children)
      .flatMap(e => e.onMelodyBeepCheckChanged.bind(e))
    controllers.melody_beep.checkbox.addListeners(...melodyBeepCheckBoxListeners);

    const melodyBeepVolumeListeners = melody.children.flatMap(e => e.children)
      .flatMap(e => e.onMelodyVolumeBarChanged.bind(e))
    controllers.melody_beep.volume.addListeners(...melodyBeepVolumeListeners)

    controllers.gravity.chord_checkbox.addListeners(chord_gravity.onUpdateGravityVisibility.bind(chord_gravity));
    controllers.gravity.scale_checkbox.addListeners(scale_gravity.onUpdateGravityVisibility.bind(scale_gravity));
  }

export class MelodyElements {
  readonly children: unknown[];
  readonly d_melody_collection: SVGGElement;
  readonly melody_hierarchy: SVGGElement;
  readonly ir_hierarchy: SVGGElement;
  readonly ir_plot_svg: SVGGElement;
  readonly chord_gravities: SVGGElement;
  readonly scale_gravities: SVGGElement;
  readonly time_span_tree: SVGGElement;
  constructor(
    hierarchical_melody: SerializedTimeAndAnalyzedMelody[][],
    d_melodies: SerializedTimeAndAnalyzedMelody[],
    controllers: Controllers
  ) {
    const builder = new HierarchyBuilder(d_melodies, hierarchical_melody, controllers)
    const d_melody_collection = builder.buildDMelody(d_melodies);
    const melody_hierarchy = builder.buildMelody(hierarchical_melody);
    const ir_hierarchy = builder.buildIRSymbol(hierarchical_melody);
    const ir_plot_svg = builder.buildIRPlot(hierarchical_melody);
    const chord_gravities = builder.buildGravity("chord_gravity", hierarchical_melody);
    const scale_gravities = builder.buildGravity("scale_gravity", hierarchical_melody);
    const time_span_tree = builder.buildReduction(hierarchical_melody);

    this.d_melody_collection = d_melody_collection.svg
    this.melody_hierarchy = melody_hierarchy.svg
    this.ir_hierarchy = ir_hierarchy.svg
    this.ir_plot_svg = ir_plot_svg.svg
    this.chord_gravities = chord_gravities.svg
    this.scale_gravities = scale_gravities.svg
    this.time_span_tree = time_span_tree.svg

    setControllers(
      d_melody_collection,
      melody_hierarchy,
      ir_hierarchy,
      ir_plot_svg,
      chord_gravities,
      scale_gravities,
      time_span_tree,
    )(controllers);

    this.children = [
      this.d_melody_collection,
      this.melody_hierarchy,
      this.ir_hierarchy,
      this.ir_plot_svg,
      this.chord_gravities,
      this.scale_gravities,
      this.time_span_tree,
    ];
  }
}
