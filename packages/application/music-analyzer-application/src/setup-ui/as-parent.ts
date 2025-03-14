export const asParent = (node: HTMLElement) => {
  return {
    appendChildren: (...children: (HTMLElement | SVGSVGElement)[]) => {
      children.forEach(e => node.appendChild(e))
    }
  }
}
