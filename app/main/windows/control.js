/**
 * 远程控制窗口
 */
const { createWindow } = require("../../common/windowManager");
const { LOAD_TYPE, WINDOW_NAME } = require("../../common/utils/const");
const path = require("path");

let mainWin;

// 创建窗口
function createControlWindow() {
    const config = {
        loadType: LOAD_TYPE.File,
        isOpenDevTools: false,
        loadUrl: path.resolve(
            __dirname,
            "../../renderer/pages/control/index.html"
        ),
    };
    mainWin = createWindow({
        name: WINDOW_NAME.Control,
        with: 600,
        height: 480,
        loadType: config.loadType,
        loadUrl: config.loadUrl,
        isOpenDevTools: config.isOpenDevTools,
    });
}

function sendControlWindow(channel, ...args) {
    mainWin.webContents.send(channel, ...args);
}

module.exports = {
    createControlWindow,
    sendControlWindow,
};
