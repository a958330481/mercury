/**
 * 枚举值
 */

const LOAD_TYPE = {
    Url: "url", 
    File: "file",
};

// window name
const WINDOW_NAME = {
    Main: "main",
    Control: "control",
};

// ipc event name
const IPC_EVENTS_NAME = {
    Login: "login",
    Control: "control",
    ControlStateChange: "control-state-change",
    AddStream: "add-stream",
    Offer: "offer",
    Answer: "answer",
    Forward: "forward",
    Candidate: "candidate",
    ControlCandidate: "control-candidate",
    PuppetCandidate: "puppet-candidate",
};

// EventEmitter
const EVENT_NAMES = {
    AddStream: "add-stream",
};

export { LOAD_TYPE, WINDOW_NAME, IPC_EVENTS_NAME, EVENT_NAMES };