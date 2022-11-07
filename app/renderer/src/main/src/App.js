/**
 * 傀儡端：用户侧
 */
import React, { useState, useEffect } from "react";
import { IPC_EVENTS_NAME } from "./utils/enum";
import { ipcRenderer } from "electron";
import "./utils/peer-puppet";
import "./index.scss";

//const { ipcRenderer } = window.require('electron');
const remote = window.require("@electron/remote");
const { Menu, MenuItem } = remote;
//const { ipcRenderer }  = window.electron;
//const { Menu, MenuItem } = remote;

function App() {
    const [remoteCode, setRemoteCode] = useState('');
    const [localCode, setLocalCode] = useState('');
    const [controlText,setControlText] = useState('')
    const login = async () => { 
        const code = await ipcRenderer.invoke(IPC_EVENTS_NAME.Login);
        setLocalCode(code);
    }

    // control remote
    const startControl = () => { 
        ipcRenderer.send(IPC_EVENTS_NAME.Control, remoteCode);
    }

    // tip text
    const handleControlState = (e, name, type) => { 
        let text = "";
        switch (type) {
            case 1:
                text = `正在远程控制 ${name}`;
                break;
            case 2:
                text = `正在被${name}控制`;
                break;
            default:
                throw new Error(`${type} not support yet!`);;
        }
        setControlText(text);
    }

    useEffect(() => { 
        login();
        ipcRenderer.on(
            IPC_EVENTS_NAME.ControlStateChange,
            handleControlState
        );

        return () => { 
            ipcRenderer.removeListener(
                IPC_EVENTS_NAME.ControlStateChange,
                handleControlState
            );
        }
    }, [])

    const handleContextMenu = (e)=>{
        e.preventDefault();
        const menu = new Menu();
        menu.append(new MenuItem({label: '复制', role: 'copy'}))
        menu.popup({
            window: remote.getCurrentWindow()
        });
    }
    
    return (
        <div className="link-container">
            <div className="link-container-con">
            { controlText ? 
                <h3 className='state'>当前状态: {controlText}</h3> 
                :
                <>
                    <h3 className="code">你的控制码:<span onContextMenu={(e) => handleContextMenu(e)}>{localCode}</span></h3>
                    <div className="link">
                        <input
                            type="text"
                            value={remoteCode}
                            placeholder="输入远程控制码"
                            onChange={(e) => {
                                setRemoteCode(e.target.value);
                            }}
                        />
                        <button onClick={startControl}>开始连接</button>
                    </div>
                </>
            }
            </div>
        </div>
    );
}

export default App;
