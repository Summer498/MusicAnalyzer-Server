export const getG = (header_height?: number) => {
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.setAttribute("transform", `translate(${0},${header_height || 0})`);
  return g;
};
