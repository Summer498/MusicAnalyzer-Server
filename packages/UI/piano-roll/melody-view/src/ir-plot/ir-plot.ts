import { IRPlotHierarchy } from "./ir-plot-hierarchy";

export const getIRPlot = (g: IRPlotHierarchy) => {
  const ir_plot = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  ir_plot.appendChild(g.svg);
  ir_plot.id = "IR-plot";
  ir_plot.setAttribute("width", String(g.width));
  ir_plot.setAttribute("height", String(g.height));
  return ir_plot;
};