export const asParent = (node: HTMLElement) => {
  return {
    setChildren: (children: (HTMLElement | SVGSVGElement)[]) => {
      children.forEach(e => node.appendChild(e))
    }
  }
}
