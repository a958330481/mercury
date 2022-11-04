const { app, Menu, Tray } = require('electron');
const { showMainWindow } = require('../../main/windows/main');
const createAboutWindow = require("../windows/about");
const path = require('path');
let tray = null; // 避免被垃圾回收

// 设置menu
function setAppMenu() {
    let appMenu = Menu.buildFromTemplate([{
            label: app.name,
            submenu: [{
                    label: '关于',
                    click: createAboutWindow
                },
                { type: 'separator' },
                { role: 'services' },
                { type: 'separator' },
                { role: 'hide' },
                { role: 'hideothers' },
                { role: 'unhide' },
                { type: 'separator' },
                { role: 'quit' }
            ],

        },
        { role: 'fileMenu' },
        { role: 'windowMenu' },
        { role: 'editMenu' }
    ]);
    app.applicationMenu = appMenu
}



// 设置tray
function setAppTray() {
    tray = new Tray(path.resolve(__dirname, './icon/icon_darwin.png'))
    tray.on('click', () => {
        // 点击托盘，展示主窗体
        showMainWindow()
    })
    tray.on('right-click', () => {
        // 右击
        const contextMenu = Menu.buildFromTemplate([{
            label: '关于',
            click: createAboutWindow
        }, {
            label: '显示',
            click: () => {
                showMainWindow()
            }
        }, {
            label: '退出',
            click: () => {
                app.quit()
            }
        }]);
        tray.popUpContextMenu(contextMenu);
    })
}


setAppTray();
setAppMenu();