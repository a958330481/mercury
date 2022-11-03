/**
 * 窗口管理
 * 窗口的增删改查
 */

const { BrowserWindow } = require("electron");
const { LOAD_TYPE } = require('./utils/enum');
const idsMap = new Map();

// 窗口管理
const windowManager = {
    // 创建
    create: (props) => {
        const { name, width, height, loadType, loadUrl, isOpenDevTools } =
            props;
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

        // 打开调试工具
        isOpenDevTools && window.webContents.openDevTools();
        return window;
    },
    // 注册
    register: (key, id, send) => {
        if (!idsMap.has(key)) {
            idsMap.set(key, {
                id,
                send,
            });
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
        return {
            id: null,
            send: null,
        };
    },
};

// 创建窗口
function createWindow(props) {
    const { name,send } = props;
    const window = windowManager.create(props);

    window.webContents.on("did-finish-load", () => {
        // 注册window id
        windowManager.register(name, window.webContents.id, send);
    });

    window.webContents.on("destroyed", () => {
        // 销毁window id
        windowManager.unregister(name);
    });

    return window;
}

module.exports = {
    createWindow,
    windowManager,
};
