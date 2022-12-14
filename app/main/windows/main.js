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


let mainWin, wiilQuitApp = false;

// 创建主窗体
function createMainWindow() {
    const config = isDev ? {
        loadType: LOAD_TYPE.Url,
        isOpenDevTools: true,
        loadUrl: "http://localhost:3000",
    } : {
        loadType: LOAD_TYPE.File,
        isOpenDevTools: false,
        loadUrl: path.resolve(
            __dirname,
            "../../renderer/pages/main/index.html"
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
    mainWin.on('close', (e) => {
        if (wiilQuitApp) {
            // 退出app
            mainWin = null;
        } else {
            // 点击窗口关闭，只做隐藏处理
            e.preventDefault();
            mainWin.hide();
        }
    })
}

// 主窗体ipc send
function sendMainWindow(channel, ...args) {
    mainWin.webContents.send(channel, ...args);
}

// 显示主窗体
function showMainWindow() {
    mainWin.show();
}

// 关闭主窗体
function closeMainWindow() {
    wiilQuitApp = true;
    mainWin.close();
}

async function getSources(channel, ...args) {
    const sources = await desktopCapturer.getSources({ types: ["screen"] });
    try {
        sendMainWindow(channel, sources[0].id, ...args);
    } catch (e) {
        console.error(e);
    }
}


module.exports = {
    createMainWindow,
    showMainWindow,
    closeMainWindow,
    sendMainWindow,
};