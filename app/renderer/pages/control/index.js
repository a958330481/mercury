/**
 * 播放视频流
 */
const { ipcRenderer } = require("electron");
const { IPC_EVENTS_NAME } = require("../../../common/utils/const");

// 获取sourceId
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
    let video = document.getElementById("screenVideo");
    video.srcObject = stream;
    video.onloadedmetadata = (e) => video.play();
}