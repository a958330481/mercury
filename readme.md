# 需求关键点
  + 傀儡端告知控制端本机控制码
    - 建立端和控制码的联系 -> 服务端需求
  + 控制端输入控制码连接傀儡端
    - 通过控制吗找到用户 -> 服务端需求
    - 建立用户间的连接 -> 服务端 or 客户端需求
  + 傀儡端将捕获的画面传送至控制端
    - 捕获画面、播放画面 -> 客户端需求
    - 用户间画面传输 -> 服务端 or 客户端需求
  + 控制端的鼠标和键盘指令传送至傀儡端
    - 捕获指令 -> 客户端
    - 用户间指令传输 -> 服务端 or 客户端需求
  + 傀儡端响应控制指令
    - 响应指令 -> 客户端需求

# 技术关键点

+ 怎么捕获画面？ 

```javascript
Electron desktopCapture
navagator.mediaDevices.getUserMedia // 可以访问用户桌面上捕获的音视频信息
```

+ 怎么完成用户间的连接，画面+指令传输？ 
```
WebRTC(1v1场景) // 客户端传输，不占用服务端资源

getUserMedia // 获取多媒体数据（音视频）
RTCPeerConnection // 建立P2P连接，传输多媒体数据
RTCDataChannel // 传输数据
```

+ 怎么响应控制指令？ 
```
robotjs(Node.js)
```

# 目录结构
```
| ——— package.json
| ——— app
|  - common
|    - ipc-channel.js
|    - util.js
|  - main
|    - index.js
|    - windows
|      - control.js
|      - main.js
|  - render
|      - pages
|       - control
|         - index.html
|       - main
|      - src
| ——— resource 
| ——— release 
| ——— dist  
```


# WebRTC

+ getUserMedia 获取多媒体数据（音视频）

    - navigator.mediaDevices.getUserMedia  获取媒体流
      + 返回Promise,成功后resolve回调一个MediaStream 实例对象

```javascript
// 获取流
navigator.mediaDevices.getUserMedia({
    audio:true,
    video:{
        width:{min:1024,ideal:1280,max:1920},
        height:{min:576,ideal:720,max:1080},
        frameRate:{max:30}
    }
}).then((stream)=>{
    // 播放流
    const video = document.querySelector('#video')
    video.srcObject = stream
    video.onloadedmetadata = ()=>{
        video.play();
    }
}).catch(err=>{
    console.error(err)
})
```

## 如何捕获桌面、窗口流？

```javascript
// Electron 17开始desktopCapturer.getSources只能写在主进程里
// app/main/windows/control.js

win.loadFile(path.resolve(__dirname, '../../renderer/pages/control/index.html'))

desktopCapturer.getSources({ types: ['screen'] }).then(async sources => {
    console.log(sources)
    for (const source of sources) {
    if (source.name === 'Screen 1') {
        console.log(source.id)
        win.webContents.send('add-stream', source.id)
        return
    }
    }
})

// app/renderer/pages/control/app.js

const { ipcRenderer } = require('electron')

ipcRenderer.on('add-stream', async (event, sourceId) => {
  try {
    console.log(window.screen.width)
    // navigator.webkitGetUserMedia
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: sourceId,
          maxWidth: window.screen.width,
          maxHeight: window.screen.height
        }
      }
    })
    console.log(stream)
    play(stream)
  } catch (e) {
    handleError(e)
  }
})

function handleError (e) {
  console.log(e)
}

function play(stream){
  let video = document.getElementById('screen-video')
  video.srcObject = stream
  video.onloadedmetadata = (e) => video.play()
}

```