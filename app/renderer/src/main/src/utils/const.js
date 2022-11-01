/*
 * @Description: 
 * @Author: zhangkai14@corp.netease.com
 * @Date: 2022-11-01 15:53:14
 * @LastEditors: zhangkai14@corp.netease.com
 * @LastEditTime: 2022-11-01 16:11:09
 */
/**
 * 常量集合
 */

const LOAD_TYPE = {
    Url: "url", 
    File: "file",
};

// window name
const WINDOW_NAME = {
    Main:"main"
}

// ipc event name
const IPC_EVENTS_NAME = {
    Login: "login",
    Control: "control",
    ControlStateChange: "control-state-change",
};


export {
    LOAD_TYPE,
    WINDOW_NAME,
    IPC_EVENTS_NAME,
};