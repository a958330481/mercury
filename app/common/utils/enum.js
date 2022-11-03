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
    Control:"control"
}

// ipc event name
const IPC_EVENTS_NAME = {
    Login: "login",
    Control: "control",
    ControlStateChange: "control-state-change",
    AddStream: "add-stream",
    Robot: "robot",
    Offer: "offer",
    Answer: "answer",
    QueryWindowId: "query-window-id",
    Forward: "forward",
    Candidate:"candidate",
    ControlCandidate: "control-candidate",
    CuppetCandidate: "puppet-candidate",
};

// robot type
const ROBOT_TYPE = {
    Mouse: "mouse", // 鼠标事件
    Keyboard: "keyboard", // 键盘事件
};

// EventEmitter
const EVENT_NAMES = {
    AddStream: "add-stream",
};


module.exports = {
    LOAD_TYPE,
    WINDOW_NAME,
    IPC_EVENTS_NAME,
    ROBOT_TYPE,
    EVENT_NAMES,
};