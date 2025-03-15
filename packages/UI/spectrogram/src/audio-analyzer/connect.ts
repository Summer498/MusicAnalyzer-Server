export const connect = (...node: AudioNode[]) => {
  const next = node.slice(1);
  next.forEach((e, i) => node[i].connect(e))
}
