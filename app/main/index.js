const { app,ipcMain } = require("electron");
const { createWindow, windowManager } = require("../common/windowManager");
const { LOAD_TYPE } = require("../common/utils/const");
const isDev = require("electron-is-dev");
const path = require('path');

// 创建窗口
function handleCreateWindow() {
    const config = isDev
        ? {
              loadType: LOAD_TYPE.Url,
              loadUrl: "http://localhost:3000",
          }
        : {
              loadType: LOAD_TYPE.File,
              loadUrl: path.resolve(__dirname, "../renderer/pages/main/index.html"),
          };
    createWindow({
        name: "win",
        with: 600,
        height: 480,
        loadType: config.loadType,
        loadUrl: config.loadUrl,
        isOpenDevTools: true,
    });
}


app.whenReady().then(() => { 
    handleCreateWindow();
})