/**
 * 主进程
 */
const { app } = require("electron");
const handleIPC = require("./ipc");
const { createMainWindow } = require("./windows/main");
const { windowManager } = require("../common/windowManager");
const { IPC_EVENTS_NAME } = require("../common/utils/enum");
const { ipcMain } = require("electron/main");
const handleRobot = require("./robot");


app.allowRendererProcessReuse = false;
app.whenReady().then(() => {
    createMainWindow();
    handleIPC();
    handleRobot();
    handleQueryWindowId();
    handleIPCForward();
})


// 获取window ID
function handleQueryWindowId() {
    ipcMain.on(IPC_EVENTS_NAME.QueryWindowId, (e, arg) => {
        e.returnValue = windowManager.get(arg).id;
    });
}

// ipc转发
function handleIPCForward() {
    ipcMain.on(IPC_EVENTS_NAME.Forward, (e, event, channel, data) => {
        const send = windowManager.get(channel).send;
        if (send) {
            send(event, data);
        }
    })
}