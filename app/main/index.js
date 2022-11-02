/**
 * 主进程
 */
const { app } = require("electron");
const handleIPC = require("./ipc");
const { createMainWindow } = require("./windows/main");
const handleRobot = require("./robot");


app.whenReady().then(() => { 
    createMainWindow();
    handleIPC();
    handleRobot();
})
app.allowRendererProcessReuse = false;