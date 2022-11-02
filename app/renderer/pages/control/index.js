/**
 * 播放视频流
 */
const { ipcRenderer } = require("electron");
const { IPC_EVENTS_NAME,ROBOT_TYPE } = require("../../../common/utils/enum");

const video = document.getElementById("screenVideo");

// 获取sourceId
// 没有实现信令以及WebRTC连接,所以用ipc 模拟
ipcRenderer.on(IPC_EVENTS_NAME.AddStream, async (event, sourceId) => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                mandatory: {
                    chromeMediaSource: "desktop",
                    chromeMediaSourceId: sourceId,
                    maxWidth: window.screen.width,
                    maxHeight: window.screen.height,
                },
            },
        });
        play(stream);
    } catch (e) {
        handleError(e);
    }
});

// 播放流
function play(stream) {
    video.srcObject = stream;
    video.onloadedmetadata = (e) => video.play();
}

// 键盘事件
window.onkeydown = function (e) {
    // data {keyCode, meta, alt, ctrl, shift}
    console.log(e);
    const data = {
        keyCode: e.keyCode,
        shift: e.shiftKey,
        meta: e.metaKey,
        control: e.ctrlKey,
        alt: e.altKey,
    };
    console.log(data);
    ipcRenderer.send(IPC_EVENTS_NAME.Robot, ROBOT_TYPE.Keyboard, data);
};

// 鼠标事件
window.onmouseup = function (e) {
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