/**
 * GUI
 */

const platform = process.platform;

const trayAndMenuInit = () => {
    switch (platform) {
        case 'darwin':
            require('./darwin.js');
            break;
        case 'win32':
            require('./win32.js');
            break;
        default:
            throw new Error(`${platform} not supported yet`);
    }
}

module.exports = trayAndMenuInit