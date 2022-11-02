/**
 * 远程控制窗口
 */
const { desktopCapturer } = require("electron");
const { createWindow } = require("../../common/windowManager");
const { LOAD_TYPE, WINDOW_NAME,IPC_EVENTS_NAME } = require("../../common/utils/const");
const path = require("path");

let win;

// 创建窗口
function createControlWindow() {
    const config = {
        loadType: LOAD_TYPE.File,
        isOpenDevTools: true,
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
    });

     win.webContents.on("did-finish-load", () => {
        // 获取窗口流
        desktopCapturer
            .getSources({ types: ["screen"] })
            .then(async (sources) => {
                for (const source of sources) {
                    if (source.name.includes(1)) {
                        sendControlWindow(
                            IPC_EVENTS_NAME.AddStream,
                            source.id
                        );
                        return;
                    }
                }
            });
     });
}

function sendControlWindow(channel, ...args) {
    console.log("+++++channel", channel, args);
    win.webContents.send(channel, ...args);
}

module.exports = {
    createControlWindow,
    sendControlWindow,
};
