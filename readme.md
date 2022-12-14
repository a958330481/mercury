# Mercury
  远程工具助手
# 主要功能点
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


# 主要角色

- 控制端：客服人员/研发人员
- 傀儡端： 用户

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
|    -- windowManager.js 窗口管理器
|    -- utils
|       -- enum.js 常量枚举值
|  - main
|    - index.js 主进程
|    - windows
|      -- control.js 控制端窗体
|      -- main.js  傀儡端窗体
|    - trayAndMenu GUI模块
|      -- index.js 入口
|      -- icon 图标资源
|      -- darwin.js macos 逻辑
|      -- win32.js windos 逻辑
|    - ipc.js 通信模块
|    - robot.js 键鼠控制模块
|  - render
|      - pages
|       -- control 
|         -- index.html 控制端视图
|         -- index.js 控制端JS逻辑
|         -- peer-control.js 控制端webRtc逻辑
|      - src
|        -- main 基于React cra脚手架搭建的傀儡端视图
|           -- src
|              -- utils
|                 -- enum.js 常量枚举值
|                 -- peer-puppet.js 傀儡端webRtc逻辑
| ——— updater-server autoUpdater更新服务
|     -- public 新版本资源包
|     -- index.js node server
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

// 第一步：获取chromeMediaSourceId
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
  let video = document.getElementById('screen-video')C:\Users\N19287\AppData\Local\Temp
  video.srcObject = stream
  video.onloadedmetadata = (e) => video.play()
}

```


# robotjs

- Robotjs 是 nodejs 的第一个用于桌面自动化的库。他能自动化鼠标、键盘和读取屏幕，并且提供了 Mac, Windows, Linux 的跨平台支持。
- http://robotjs.io/
### win10 安装 robotjs 

> https://github.com/octalmage/robotjs/issues/398
```shell
npm install -g windows-build-tools 
# 如果出现`Python 2.7.6 is already installed, not installing again` 报错
# 参考这里处理：https://blog.csdn.net/wen673448067/article/details/120407303
# C:\Users\xxxx\AppData\Local\Temp
npm install -g node-gyp
npm install robotjs
```

### 编译原生模块（robotjs）
> 原生模块使用c++ 编写，不同平台、不同node版本都需要重新编译

### 手动编译

> 对照表：https://github.com/mapbox/node-pre-gyp/blob/master/lib/util/abi_crosswalk.json

```
npm rebuild —runtime=electron —disturl=https://atom.io/download/atom-shell \

 —target=<electron版本> —abi=<对应版本abi>

• process.versions.electron，可以看到electron版本

• process.versions.node 可以看到 node 版本，之后再 abi_crosswalk 查找 abi

npm rebuild --runtime=electron --disturl=https://atom.io/download/atom-shell --target=7.1.8 --abi=72
```

### 自动编译

```shell
yarn add electron-rebuild -D
npx electron-rebuild

# 必须是https://github.com/mapbox/node-pre-gyp/blob/master/lib/util/abi_crosswalk.json 包含的node版本才能自动编译成功
```

# 视频流传输

+ 最简单的建立p2p传输过程
 ![image](./images/rtc-arc.png)

+ STUN 过程
 ![image](./images//stun.png)

 # 提高原生体验

 + 关于窗口
   - 使用electron-about-window
   - 展示内容：logo+产品名字+版本号+版权
 + 禁止多开
   - app.requestSingleInstanceLock
 + 窗口假关闭
    - 点击窗口关闭，隐藏应用
    - 点击[退出应用]，才是真的关闭窗口

# 常见问题

# GUI

+ 与GUI相关的模块（如 dialog, menu 等)只存在于主进程，而不在渲染进程中 。为了能从渲染进程中使用它们，需要用ipc模块来给主进程发送进程间消息。使用 remote 模块， 可以调用主进程对象的方法，而无需显式地发送进程间消息 ，这类似于 Java 的 RMI



+ robot.js 报错
```
App threw an error during load
Error: The module 'xxxx/remote-control-app/node_modules/robotjs/build/Release/robotjs.node'
```
解决:
```shell
# 因为robotjs是node原生模块，需要先编译才能使用
npx electron-rebuild 
```

# 打包发布

+ mac icns文件生成
```shell
# 提供一张2048*2048的原图，icon.png
sips -z 16 16 icon.png --out icons.iconset/icon_16x16.png
icontil -c icns icons.iconset -o icon.icns
```

+ [生成证书](https://www.cnblogs.com/mmykdbc/p/11468908.html)

# TODO

- websocket信令服务
- [支持屏幕录制](https://github.com/Auax/electron-screen-recorder/blob/main/src/render.js)
- webrtc createDataChannel 传输数据