/**
 * 傀儡端webrtc 逻辑
 */
import { ipcRenderer } from "electron";
import { IPC_EVENTS_NAME,WINDOW_NAME } from "./enum";
const pc = new window.RTCPeerConnection();
// 获取屏幕视频流
async function getScreenStream(sourceId) {
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
        return stream;
    } catch (e) {
        console.error(e);
    }
}
async function createAnswer(sourceId, offer) {
    const stream = await getScreenStream(sourceId);
    console.log("stream", stream);
    pc.addStream(stream);
    await pc.setRemoteDescription(offer);
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    return { answer: pc.localDescription, stream };
}

ipcRenderer.on(IPC_EVENTS_NAME.Offer, (e, sourceId, offer) => {
    createAnswer(sourceId, offer).then(({ answer, stream }) => {
        console.log("streamstream", stream);
        const { type, sdp } = answer;
        // 发起ipc通信，由主进程转发到控制端
        ipcRenderer.send(
            IPC_EVENTS_NAME.Forward,
            IPC_EVENTS_NAME.Answer,
            WINDOW_NAME.Control,
            {
                type,
                sdp,
            }
        );
    });
});