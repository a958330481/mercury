const { app,ipcMain } = require("electron");
const { createWindow, windowManager } = require("../common/windowManager");
const { LOAD_TYPE } = require("../common/utils/const");

// 创建窗口
function createWindowOne() {
    createWindow({
        name: "win1",
        with: 600,
        height: 480,
        loadType:LOAD_TYPE.Url,
        loadUrl: "http://localhost:3000",
        isOpenDevTools: true,
    });
}


app.whenReady().then(() => { 
    createWindowOne();
})