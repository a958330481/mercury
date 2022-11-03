/**
 * 控制端 webrtc 逻辑
 */
const { ipcRenderer } = require("electron/renderer");
const EventEmitter = require("events");
const { EVENT_NAMES, IPC_EVENTS_NAME,WINDOW_NAME } = require("../../../common/utils/enum");
const peer = new EventEmitter();

// 创建 RTCPeerConnection 实例
const peerConnection = new window.RTCPeerConnection();
const candidateQueue = [];


// 获取icecandidate，并发送给傀儡端
peerConnection.onicecandidate = (e) => { 
    console.log("candidate", JSON.stringify(e.candidate));
    // 发送给傀儡端
    ipcRenderer.send(
        IPC_EVENTS_NAME.Forward,
        IPC_EVENTS_NAME.Candidate,
        WINDOW_NAME.Main,
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
    if (peerConnection.remoteDescription && peerConnection.remoteDescription?.type) {
        for (let candidate of candidateQueue) {
            try {
                const rtcIceCandidate = new RTCIceCandidate(candidate);
                await peerConnection.addIceCandidate(rtcIceCandidate);
                candidateQueue.shift();
            } catch (e) { 
                console.error(e)
            }
        }
    }
};

// 创建offer
const createOffer = async () => { 
    // 获取offer
    const offer = await peerConnection.createOffer({
        offerToReceiveAudio: false, // 交换音频数据
        offerToReceiveVideo:true,   // 交换视频数据 
    });
    // 设置offer sdp
    await peerConnection.setLocalDescription(offer);

    //console.log("peerConnection offer", JSON.stringify(offer));

    return peerConnection.localDescription;
}

// 接受傀儡端的answer,并设置answer SDP
const setRemoteAnswer = async (answer) => { 
    await peerConnection.setRemoteDescription(answer);
} 

// 监听addstream
peerConnection.onaddstream = (e) => {
    console.log("addstream", e);
    peer.emit(EVENT_NAMES.AddStream, e.stream);
};

// 监听answer
ipcRenderer.on(IPC_EVENTS_NAME.Answer, (e,answer) => {
    setRemoteAnswer(answer);
});

createOffer().then(offer => { 
    const { type, sdp } = offer;
    ipcRenderer.send(IPC_EVENTS_NAME.Forward, IPC_EVENTS_NAME.Offer,WINDOW_NAME.Main, {type,sdp});
});


window.addIceCandidate = addIceCandidate;
window.setRemoteAnswer = setRemoteAnswer;


module.exports = peer;