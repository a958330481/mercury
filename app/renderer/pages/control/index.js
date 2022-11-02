/**
 * 播放视频流
 */
const { ipcRenderer } = require("electron");
const { IPC_EVENTS_NAME } = require("../../../common/utils/const");

// 获取sourceId
// 没有实现信令以及WebRTC连接,所以用ipc 模拟
ipcRenderer.on("add-stream", async (event, sourceId) => {
    alert(sourceId);
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