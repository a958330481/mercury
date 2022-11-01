/**
 * 窗口管理
 * 窗口的增删改查
 */

const { BrowserWindow } = require("electron");
const { LOAD_TYPE } = require('./utils/const');
const idsMap = new Map();

// 窗口管理
const windowManager = {
    // 创建
    create: (props) => {
        const { name, width, height, loadType, loadUrl } = props;
        console.log("loadType", loadType);
        console.log("loadUrl", loadUrl);
        const window = new BrowserWindow({
            name,
            width,
            height,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            },
        });
        loadType === LOAD_TYPE.File
            ? window.loadFile(loadUrl)
            : window.loadURL(loadUrl);
        return window;
    },
    // 注册
    register: (key, value) => {
        if (!idsMap.has(key)) {
            idsMap.set(key, value);
        }
    },
    // 解除注册
    unregister: (key) => {
        if (idsMap.has(key)) {
            idsMap.delete(key);
        }
    },
    // 获取ID
    get: (key) => {
        if (idsMap.has(key)) {
            return idsMap.get(key);
        }
        return null
    }
};

// 创建窗口
function createWindow(props) {
    const { name } = props;
    const window = windowManager.create(props);

    window.webContents.on("did-finish-load", () => {
        // 注册window id
        windowManager.register(name, window.webContents.id);
    });

    window.webContents.on("destroyed", () => {
        // 销毁window id
        windowManager.unregister(name);
    });

    // 打开调试工具
    isOpenDevTools && window.webContents.openDevTools();
}

module.exports = {
    createWindow,
    windowManager,
};
