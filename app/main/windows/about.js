/**
 * 关于窗口
 */

const aboutWin = require('electron-about-window').default;
const path = require('path');

const createAboutWin = () => aboutWin({
    icon_path: path.join(__dirname, 'icon.png'),
    package_json_dir: path.resolve(__dirname, '../../../'),
    cropyright: 'Copyright (c) 2022 kevinInsight',
    homepage: 'https://github.com/a958330481/remote-control-app',
})

module.exports = createAboutWin