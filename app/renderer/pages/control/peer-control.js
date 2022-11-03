/**
 * 控制端 webrtc 逻辑
 */
const { ipcRenderer } = require("electron/renderer");
const EventEmitter = require("events");
const { EVENT_NAMES, IPC_EVENTS_NAME,WINDOW_NAME } = require("../../../common/utils/enum");
const peer = new EventEmitter();

// 创建 RTCPeerConnection 实例
const peerConnection = new window.RTCPeerConnection();

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
    console.log("+++++++++++++++++++answer11111", answer);
    setRemoteAnswer(answer);
});

window.setRemoteAnswer = setRemoteAnswer;
createOffer().then(offer => { 
    const { type, sdp } = offer;
    ipcRenderer.send(IPC_EVENTS_NAME.Forward, IPC_EVENTS_NAME.Offer,WINDOW_NAME.Main, {type,sdp});
});

module.exports = peer;