import { default as express } from "express";

export const app = express();
export const HOME = "/MusicAnalyzer-server";
export const HOME_DIR = `/var/www/html${HOME}`; // process.cwd();
