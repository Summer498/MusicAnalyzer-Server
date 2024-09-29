import { HTML } from "@music-analyzer/html";

console.log("this is hierarchical analysis list");

declare const tunes: HTMLUListElement;

(async () => {
  const gttm_examples: string[] = await (await fetch("/MusicAnalyzer-server/api/gttm-example/")).json();
  const srt_gttm_examples = gttm_examples.sort((a, b) => a.localeCompare(b, [], { numeric: true }));  //  Natural sort order

  srt_gttm_examples.forEach(gttm_example => {
    const anchor = HTML.a();
    anchor.textContent = gttm_example;
    anchor.setAttribute("href", `/MusicAnalyzer-server/html/hierarchical-analysis-sample/view?tune=${gttm_example}`);
    const item = HTML.li();
    item.appendChild(anchor);
    tunes.insertAdjacentElement("beforeend", item);
  });
  console.log(srt_gttm_examples);
})();