"use strict";
const server_max_file_size_mega = 64;
const file_size_is_too_lerge_area = this.document.getElementsByName("fileSizeIsTooLarge")[0];
const printFileSize = (e) => {
    const size = e.target.files[0].size;
    console.log(size);
    if (size >= server_max_file_size_mega * 1024 * 1024) {
        printFileSizeIsTooLarge(size);
    }
};
const getFileSizeStr = (file_size) => {
    if (file_size < 1024) {
        return `${file_size}B`;
    }
    else {
        const kilo = file_size / 1024;
        if (kilo < 1024) {
            return `${kilo}KB`;
        }
        else {
            const mega = kilo / 1024;
            return `${mega}MB`;
        }
    }
};
const printFileSizeIsTooLarge = (file_size) => {
    const old_messages = file_size_is_too_lerge_area.children;
    const message = (old_messages.length > 0) ? old_messages[0] : document.createElement("p");
    message.textContent = `ファイルサイズ${getFileSizeStr(file_size)}は大きすぎます. 最大サイズは${server_max_file_size_mega} MBです`;
    file_size_is_too_lerge_area.insertAdjacentElement("afterbegin", message);
};
window.addEventListener("DOMContentLoaded", function () {
    var _a;
    (_a = this.document
        .getElementById("upload_file")) === null || _a === void 0 ? void 0 : _a.addEventListener("change", printFileSize);
});
