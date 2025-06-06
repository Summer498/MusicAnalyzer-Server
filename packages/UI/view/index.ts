import { CurrentTimeX } from "@music-analyzer/view-parameters";
import { NoteSize } from "@music-analyzer/view-parameters";
import { NowAt } from "@music-analyzer/view-parameters";

export interface AudioReflectableRegistry {
  addListeners(...listeners: (() => void)[]): void
  onUpdate(): void
}

let audioRegistryCount = 0
export const createAudioReflectableRegistry = (): AudioReflectableRegistry => {
  if (audioRegistryCount >= 1) {
    throw new Error("this constructor should not be called twice (singleton)")
  }
  audioRegistryCount++
  const listeners: (() => void)[] = []
  return {
    addListeners: (...ls: (() => void)[]) => { listeners.push(...ls) },
    onUpdate: () => { listeners.forEach(e => e()) },
  }
}

export interface WindowReflectableRegistry {
  addListeners(...listeners: (() => void)[]): void
  onUpdate(): void
}

let windowRegistryCount = 0
export const createWindowReflectableRegistry = (): WindowReflectableRegistry => {
  if (windowRegistryCount >= 1) {
    throw new Error("this constructor should not be called twice (singleton)")
  }
  windowRegistryCount++
  const listeners: (() => void)[] = []
  return {
    addListeners: (...ls: (() => void)[]) => { listeners.push(...ls) },
    onUpdate: () => { listeners.forEach(e => e()) },
  }
}

export const PianoRollTranslateX = {
  get() {
    return CurrentTimeX.get() - NowAt.get() * NoteSize.get()
  },
}
