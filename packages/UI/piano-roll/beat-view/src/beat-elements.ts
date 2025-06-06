import { BeatInfo } from "@music-analyzer/beat-estimation";
import { Time, createTime } from "@music-analyzer/time-and";
import {
  AudioReflectableRegistry,
  PianoRollTranslateX,
  WindowReflectableRegistry,
} from "@music-analyzer/view";
import { TimeRangeController } from "@music-analyzer/controllers";
import { NowAt, PianoRollConverter } from "@music-analyzer/view-parameters";
import { PianoRollHeight } from "@music-analyzer/view-parameters";
import { reservation_range } from "@music-analyzer/view-parameters";
import { play } from "@music-analyzer/synth";

export interface BeatBarModel {
  readonly time: Time
}

const createBeatBarModel = (beat_info: BeatInfo, i: number): BeatBarModel => ({
  time: createTime(
    (i * 60) / beat_info.tempo,
    ((i + 1) * 60) / beat_info.tempo,
  ),
})

export interface BeatBarView {
  readonly svg: SVGLineElement
}

const updateX_BeatBarView = (svg: SVGLineElement) => (x1: number, x2: number) => {
  svg.setAttribute("x1", String(x1))
  svg.setAttribute("x2", String(x2))
}

const updateY_BeatBarView = (svg: SVGLineElement) => (y1: number, y2: number) => {
  svg.setAttribute("y1", String(y1))
  svg.setAttribute("y2", String(y2))
}

const createBeatBarView = (svg: SVGLineElement): BeatBarView => ({ svg })

export interface BeatBar {
  readonly model: BeatBarModel
  readonly view: BeatBarView
  readonly onWindowResized: () => void
  readonly onTimeRangeChanged: () => void
  readonly onAudioUpdate: () => void
}

const updateX = (svg: SVGLineElement) => (model: BeatBarModel) => {
  updateX_BeatBarView(svg)(
    PianoRollConverter.scaled(model.time.begin),
    PianoRollConverter.scaled(model.time.begin),
  )
}

const updateY = (svg: SVGLineElement) => (y1: number, y2: number) => {
  updateY_BeatBarView(svg)(y1, y2)
}

const createBeatBar = (beat_info: BeatInfo, i: number): BeatBar => {
  const model = createBeatBarModel(beat_info, i)
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "line")
  svg.id = "bar"
  svg.style.stroke = "rgb(0, 0, 0)"
  svg.style.display = "none" // NOTE: 一旦非表示
  const view = createBeatBarView(svg)

  let sound_reserved = false
  const y1 = 0
  const y2 = PianoRollHeight.get()
  updateX(svg)(model)
  updateY(svg)(y1, y2)

  const beepBeat = () => {
    const model_is_in_range = createTime(0, reservation_range)
      .map((e) => e + NowAt.get())
      .has(model.time.begin)
    if (model_is_in_range) {
      if (sound_reserved === false) {
        play([220], model.time.begin - NowAt.get(), 0.125)
        sound_reserved = true
        setTimeout(() => {
          sound_reserved = false
        }, reservation_range * 1000)
      }
    }
  }

  const onWindowResized = () => {
    updateX(svg)(model)
  }
  const onTimeRangeChanged = onWindowResized
  const onAudioUpdate = () => {
    // NOTE: うるさいので停止中
    0 && beepBeat()
  }

  return { model, view, onWindowResized, onTimeRangeChanged, onAudioUpdate }
}

export interface RequiredByBeatBarsSeries {
  readonly audio: AudioReflectableRegistry
  readonly window: WindowReflectableRegistry
  readonly time_range: TimeRangeController
}

export interface BeatBarsSeries {
  readonly children: BeatBar[]
  readonly svg: SVGGElement
  readonly children_model: { readonly time: Time }[]
  readonly show: BeatBar[]
  readonly onAudioUpdate: () => void
}

const createBeatBarsSeries = (children: BeatBar[]): BeatBarsSeries => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "g")
  svg.id = "beat-bars"
  children.forEach((e) => svg.appendChild(e.view.svg))

  const onAudioUpdate = () => {
    svg.setAttribute("transform", `translate(${PianoRollTranslateX.get()})`)
  }

  return {
    children,
    svg,
    children_model: children.map((e) => e.model),
    show: children,
    onAudioUpdate,
  }
}

export interface RequiredByBeatElements {
  readonly audio: AudioReflectableRegistry
  readonly window: WindowReflectableRegistry
  readonly time_range: TimeRangeController
}

export interface BeatElements {
  readonly children: BeatBarsSeries[]
  readonly beat_bars: SVGGElement
}

export const createBeatElements = (
  beat_info: BeatInfo,
  melodies: { time: Time }[],
  controllers: RequiredByBeatElements,
): BeatElements => {
  const N = Math.ceil(
    beat_info.tempo * melodies[melodies.length - 1].time.end,
  ) + beat_info.phase
  const seed = [...Array(N)]

  const beat_bar = seed.map((_, i) => createBeatBar(beat_info, i))

  const beat_bars = createBeatBarsSeries(beat_bar)
  controllers.audio.addListeners(
    ...beat_bars.children.map((e) => e.onAudioUpdate),
  )
  controllers.window.addListeners(
    ...beat_bars.children.map((e) => e.onWindowResized),
  )
  controllers.time_range.addListeners(
    ...beat_bars.children.map((e) => e.onTimeRangeChanged),
  )

  return { children: [beat_bars], beat_bars: beat_bars.svg }
}
