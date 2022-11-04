const { app, Menu, Tray } = require('electron');
const path = require('path');
const { showMainWindow } = require('../../main/windows/main');
const createAboutWindow = require("../windows/about");

let tray;

function setTrayAndMenu() {
    tray = new Tray(path.resolve(__dirname, './icon/icon_win32.png'))
    const contextMenu = Menu.buildFromTemplate([
        { label: '打开' + app.name, click: showMainWindow },
        { label: '关于' + app.name, click: createAboutWindow },
        { type: 'separator' },
        { label: '退出', click: () => { app.quit() } }
    ])
    tray.setContextMenu(contextMenu)
    menu = Menu.buildFromTemplate([])
    app.applicationMenu = menu;
}

setTrayAndMenu();