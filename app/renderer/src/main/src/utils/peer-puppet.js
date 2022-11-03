/**
 * 傀儡端webrtc 逻辑
 */
import { ipcRenderer } from "electron";
import { IPC_EVENTS_NAME,WINDOW_NAME } from "./enum";
const pc = new window.RTCPeerConnection();
const candidateQueue = [];


// 获取icecandidate，并发送给傀儡端
pc.onicecandidate = (e) => { 
    console.log("candidate", JSON.stringify(e.candidate));
    // 发送给傀儡端
    ipcRenderer.send(
        IPC_EVENTS_NAME.Forward,
        IPC_EVENTS_NAME.Candidate,
        WINDOW_NAME.Control,
        JSON.stringify(e.candidate)
    );
};

// 监听傀儡端icecandidate，收到之后设置
ipcRenderer.on(IPC_EVENTS_NAME.Candidate, (e, candidate) => {
    addIceCandidate(JSON.parse(candidate));
});

// 设置 addIceCandidate
const addIceCandidate = async (candidate) => {
    // 依赖remoteDescription,等其设置成功后才会生效
    candidate && candidateQueue.push(candidate);
    if (pc.remoteDescription && pc.remoteDescription?.type) {
        for (let candidate of candidateQueue) {
            try {
                const rtcIceCandidate = new RTCIceCandidate(candidate);
                await pc.addIceCandidate(rtcIceCandidate);
                candidateQueue.shift();
            } catch (e) { 
                console.error(e)
            }
        }
    }
};

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


window.addIceCandidate = addIceCandidate;