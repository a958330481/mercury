/**
 * 控制端：客服人员/研发人员
 */
const { ipcRenderer } = require("electron");
const peer = require("./peer-control");
const { IPC_EVENTS_NAME, ROBOT_TYPE, EVENT_NAMES } = require("../../../common/utils/enum");
const video = document.getElementById("screenVideo");

// 获取sourceId
// 没有实现信令以及WebRTC连接,所以用ipc 模拟
peer.on(EVENT_NAMES.AddStream, (stream) => {
    console.log("play stream", stream);
    play(stream);
});

// 播放流
function play(stream) {
    console.log("stream", stream);
    video.srcObject = stream;
    video.onloadedmetadata = (e) => video.play();
}

// 键盘事件
window.onkeydown = function(e) {
    // data {keyCode, meta, alt, ctrl, shift}
    const data = {
        keyCode: e.keyCode,
        shift: e.shiftKey,
        meta: e.metaKey,
        control: e.ctrlKey,
        alt: e.altKey,
    };
    ipcRenderer.send(IPC_EVENTS_NAME.Robot, ROBOT_TYPE.Keyboard, data);
};

// 鼠标事件
window.onmouseup = function(e) {
    // data {clientX, clientY, screen: {width, height}, video: {width, height}}
    const data = {
        clientX: e.clientX,
        clientY: e.clientY,
        video: {
            width: video.getBoundingClientRect().width,
            height: video.getBoundingClientRect().height,
        },
        screen: {
            width: window.screen.width,
            height: window.screen.height,
        },
    };
    ipcRenderer.send(IPC_EVENTS_NAME.Robot, ROBOT_TYPE.Mouse, data);
};