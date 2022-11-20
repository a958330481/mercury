/**
 * 主进程
 */
const { app, BrowserWindow } = require("electron");
const handleIPC = require("./ipc");
const { createMainWindow, showMainWindow, closeMainWindow } = require("./windows/main");
const { windowManager } = require("../common/windowManager");
const { IPC_EVENTS_NAME } = require("../common/utils/enum");
const { ipcMain } = require("electron/main");
const handleRobot = require("./robot");
const trayAndMenuInit = require("./trayAndMenu/index");
const remoteMain = require("@electron/remote/main");
const handleAutoUpdater = require("./updater");
const gotTheLock = app.requestSingleInstanceLock();

if (gotTheLock) {
    app.on('second-instance', () => {
        showMainWindow();
    })
    app.on('will-finish-launching', () => {
        handleAutoUpdater();
    })
    app.whenReady().then(() => {
        app.allowRendererProcessReuse = false;
        remoteMain.initialize();
        trayAndMenuInit();
        createMainWindow();
        handleIPC();
        handleRobot();
        handleQueryWindowId();
        handleIPCForward();
    })
    app.on('before-quit', () => {
        closeMainWindow();
    })
    app.on('activate', () => {
        showMainWindow();
    })
} else {
    // 禁止多开
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