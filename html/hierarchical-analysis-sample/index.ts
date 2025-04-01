import { handleGttmExampleIDs } from "@music-analyzer/music-analyzer-application";

const main = () => {
  fetch("/MusicAnalyzer-server/api/gttm-example/")
    .then(e => e.json() as Promise<string[]>)
    .then(handleGttmExampleIDs);
};
main();