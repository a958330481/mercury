/**
 * 主进程
 */
const { app } = require("electron");
const handleIPC = require("./ipc");
const { createMainWindow } = require("./windows/main");


app.whenReady().then(() => { 
    createMainWindow();
    handleIPC();
})
//app.allowRendererProcessReuse = false;