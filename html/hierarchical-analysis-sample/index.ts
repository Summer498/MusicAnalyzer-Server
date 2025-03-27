import { handleGttmExampleIDs } from "@music-analyzer/music-analyzer-application/src/handle-gttm-example-IDs";

const main = () => {
  fetch("/MusicAnalyzer-server/api/gttm-example/")
    .then(e => e.json() as Promise<string[]>)
    .then(handleGttmExampleIDs);
};
main();