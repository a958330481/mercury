const { contextBridge, ipcRenderer } = require('electron');
const remote = require('@electron/remote');

// 如果想在前端环境中使用某些模块，一定要在 preload 选项配置的 js 中，
//通过 contextBridge.exposeInMainWorld 暴露给 window 给前端使用
const nameSpace = 'electron';
contextBridge.exposeInMainWorld(nameSpace, {
    ipcRenderer: {
        ...ipcRenderer,
        on: ipcRenderer.on,
        removeListener: ipcRenderer.removeListener
    },
    remote,
});

// 使用
// const { shell, remote, ipcRenderer }  = window.nameSpace;