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