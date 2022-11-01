/**
 * 通信模块
 */

const { ipcMain } = require("electron");
const {
    IPC_EVENTS_NAME
} = require("../common/utils/const");
const { sendMainWindow } = require("./windows/main");
const { createControlWindow } = require("./windows/control");

module.exports = function () { 
    ipcMain.handle(IPC_EVENTS_NAME.Login, async () => {
        return Math.ceil(Math.random() * 100000000);
    });

    ipcMain.on(IPC_EVENTS_NAME.Control, (e, remoteCode) => {
        sendMainWindow(IPC_EVENTS_NAME.ControlStateChange, remoteCode, 1);
        createControlWindow();
    });
}
