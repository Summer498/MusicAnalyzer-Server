export interface HierarchyLevelSubscriber {
  children: { length: number }
  onChangedLayer(value: number): void
}