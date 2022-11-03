
/**
 * 傀儡端主窗口
 */
const { desktopCapturer } = require("electron");
const { createWindow } = require("../../common/windowManager");
const {
    LOAD_TYPE,
    WINDOW_NAME,
    IPC_EVENTS_NAME,
} = require("../../common/utils/enum");
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
        send: (channel, ...args) => {
            if (channel === IPC_EVENTS_NAME.Offer) { 
                getSources(channel, ...args);
                return;
            }
            sendMainWindow(channel, ...args);
        },
    });
}

function sendMainWindow(channel, ...args) {
    mainWin.webContents.send(channel, ...args);
}

async function getSources(channel, ...args) {
    const sources = await desktopCapturer.getSources({ types: ["screen"] });
    try {
        for (const source of sources) {
            if (source.name === "Screen 1") {
                sendMainWindow(channel, source.id, ...args);
                return;
            }
        }
    } catch (e) {
        console.error(e);
    }
}


module.exports = {
    createMainWindow,
    sendMainWindow,
};