/**
 * 远程控制窗口
 */
const { createWindow } = require("../../common/windowManager");
const { LOAD_TYPE, WINDOW_NAME } = require("../../common/utils/enum");
const path = require("path");

let win;

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
    win = createWindow({
        name: WINDOW_NAME.Control,
        with: 600,
        height: 480,
        loadType: config.loadType,
        loadUrl: config.loadUrl,
        isOpenDevTools: config.isOpenDevTools,
        send: (channel, ...args) => {
            sendControlWindow(channel, ...args);
        },
    });
}

function sendControlWindow(channel, ...args) {
    win.webContents.send(channel, ...args);
}

module.exports = {
    createControlWindow,
    sendControlWindow,
};