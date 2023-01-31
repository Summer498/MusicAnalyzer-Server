"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const url_1 = __importDefault(require("url"));
const app = (0, express_1.default)();
const HOST_NAME = '127.0.0.1';
const PORT = 3000;
const HOME_DIR = `${HOST_NAME}:${PORT}`;
const CWD = process.cwd();
const POST_DATA_PATH = `${CWD}/posted`;
const POST_API_PATH = `html/api.js`;
const upload = (0, multer_1.default)({ dest: POST_DATA_PATH }); // multer が POST_DATA_PATH にファイルを作成
const send404NotFound = (req, res) => {
    res.status(404).send("404: Not Found...");
};
const send300Redirect = (res, pathname) => {
    res.redirect(300, `${path_1.default.dirname(pathname)}`);
};
const sendFile = (req, res, fullpath) => {
    if (!fs_1.default.existsSync(fullpath)) {
        const err = `File not Found: ${fullpath}`;
        console.error(err);
        res.status(404).send(`<html lang="ja"><head><meta http-equiv="content-lang" content="ja" charset="utf-8"><title>404 Not Found</title></head><h1>404 Not Found...<h1><p>${url_1.default.parse(req.url, true, true).pathname} is not on server directory<p></html>`);
    }
    else {
        res.sendFile(fullpath);
        console.log(`Accessed on ${fullpath}`);
    }
};
const sendRequestedFile = (req, res) => {
    if (req.url == undefined) {
        throw TypeError(`requested URL is null`);
    }
    const pathname = url_1.default.parse(req.url, true, true).pathname;
    if (pathname == null) {
        throw TypeError(`path is null`);
    }
    const filepath = path_1.default.extname(pathname) == "" ? pathname + "/index.html" : pathname;
    const fullpath = `${CWD}/html${filepath}`;
    // パスの指定先が見つからないとき
    if (0) { }
    else if (path_1.default.basename(pathname) == "index.html") {
        send300Redirect(res, pathname);
    }
    else {
        sendFile(req, res, fullpath);
    }
};
const main = (argv) => {
    // URLの部分が一致するもののうち一番上にある関数の処理をする
    app.post("/*", upload.single("upload"), function (req, res, next) {
        // CAUTION: upload.fields の中で指定していない name は受け付けなくなる.
        // ファイルの処理
        if (req.file == undefined) {
            console.log(`File uploaded on "undefined", "undefined"`);
        }
        else {
            const filepath = req.file.path;
            const originalname = req.file.originalname;
            console.log(`File uploaded on ${filepath} ${originalname}`);
        }
        sendRequestedFile(req, res);
        sendFile(req, res, `${CWD}/${POST_API_PATH}`); //
    });
    app.get("/*", sendRequestedFile);
    app.post("*", send404NotFound);
    app.get("*", send404NotFound);
    const server = app.listen(PORT, () => {
        if (server == null) {
            throw TypeError("Error: Server is null");
        }
        const address = server.address();
        if (address == null) {
            throw TypeError("Error: Server.address() is null");
        }
        if (typeof (address) == "string") {
            console.log(`Server listening at address ${address}`);
            return;
        }
        const port = address.port;
        console.log(`Server listening at ${address.address}:${port}`);
    });
};
main(process.argv);
