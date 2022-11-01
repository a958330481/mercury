/**
 * 常量集合
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
};


module.exports = {
    LOAD_TYPE,
    WINDOW_NAME,
    IPC_EVENTS_NAME,
};