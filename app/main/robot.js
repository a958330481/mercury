
const { ipcMain } = require("electron");
const robot = require("robotjs");
const vkey = require("vkey");
const { ROBOT_TYPE,IPC_EVENTS_NAME } = require("../common/utils/enum");

/**
 * 鼠标事件
 * data 数据结构
 * {
 *   clientX,
 *   clientY,
 *   screen: {width,height},
 *   video: {width,height}
 * }
 * @param {*} data 
 */

function handleMouse(data) {
    const { clientX, clientY, screen, video } = data;
    const x = clientX * (screen.width / video.width);
    const y = clientY * (screen.height / video.height);
    console.log("+++mouse-data", data);
    robot.moveMouse(x, y);
    robot.mouseClick();
}

/**
 * 键盘事件
 * data 数据结构
 * {
 *   keyCode,
 *   meta,
 *   alt,
 *   ctrl,
 *   shift
 * }
 * @param {*} data 
 */
function handleKeyboard(data) {
     console.log("+++keyboard-data", data);
    const { keyCode, meta, alt, ctrl, shift } = data;
    const modifiers = [];
    meta && modifiers.push("meta");
    alt && modifiers.push("alt");
    ctrl && modifiers.push("ctrl");
    shift && modifiers.push("shift");

    const key = vkey[keyCode].toLowerCase();
    robot.keyTap(key, modifiers);
}

 function handleRobot() { 
     ipcMain.on(IPC_EVENTS_NAME.Robot, (e, type, data) => {
        console.log(type,data);
        switch (type) {
            case ROBOT_TYPE.Mouse:
                handleMouse(data);
                break;
            case ROBOT_TYPE.Keyboard:
                handleKeyboard();
                break;
            default:
                throw new Error(`robot type ${type} not supported yet! `);
        }
    });
}

module.exports = handleRobot;