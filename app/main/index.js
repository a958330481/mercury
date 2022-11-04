/**
 * 主进程
 */
const { app } = require("electron");
const handleIPC = require("./ipc");
const { createMainWindow, showMainWindow, closeMainWindow } = require("./windows/main");
const { windowManager } = require("../common/windowManager");
const { IPC_EVENTS_NAME } = require("../common/utils/enum");
const { ipcMain } = require("electron/main");
const handleRobot = require("./robot");
const createAboutWin = require("./windows/about");

const gotTheLock = app.releaseSingleInstanceLock();

if (gotTheLock) {
    app.on('second-instance', () => {
        showMainWindow();
    })
    app.whenReady().then(() => {
        app.allowRendererProcessReuse = false;
        createMainWindow();
        handleIPC();
        handleRobot();
        handleQueryWindowId();
        handleIPCForward();
        createAboutWin();
    })
    app.on('before-quit', () => {
        closeMainWindow();
    })
    app.on('activate', () => {
        showMainWindow();
    })
} else {
    app.quit();
}


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