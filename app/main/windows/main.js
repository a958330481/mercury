
/**
 * 主窗口
 */
const { createWindow } = require("../../common/windowManager");
const { LOAD_TYPE, WINDOW_NAME } = require("../../common/utils/const");
const isDev = require("electron-is-dev");
const path = require("path");

let mainWin;

// 创建窗口
function createMainWindow() {
    const config = isDev
        ? {
              loadType: LOAD_TYPE.Url,
              isOpenDevTools: true,
              loadUrl: "http://localhost:3000",
          }
        : {
              loadType: LOAD_TYPE.File,
              isOpenDevTools: false,
              loadUrl: path.resolve(
                  __dirname,
                  "../renderer/pages/main/index.html"
              ),
          };
    mainWin = createWindow({
        name: WINDOW_NAME.Main,
        with: 600,
        height: 480,
        loadType: config.loadType,
        loadUrl: config.loadUrl,
        isOpenDevTools: config.isOpenDevTools,
    });
}

function sendMainWindow(channel, ...args) {
    mainWin.webContents.send(channel, ...args);
}


module.exports = {
    createMainWindow,
    sendMainWindow,
};