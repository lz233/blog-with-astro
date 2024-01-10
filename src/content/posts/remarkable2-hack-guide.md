---
title: reMarkable 2 Hack 不完全指北
pubDate: 2021-07-12 20:14:12
description: "reMarkable 2 是一款用于笔记与批注的水墨屏设备，因其的高颜值、低延迟和高开放性等优点，而深受我的喜爱。rM 在国内的知名度很低，相关中文资料很少，故有此文。"
categories: [reMarkable, Linux]
---

> 进行下列操作前务必明确你在干什么。**任何**操作都请记得备份，否则后果自负。
>
> 本文最后更新于 2021.11.6。

---

reMarkable 2 是一款用于笔记与批注的水墨屏设备，因其的高颜值、低延迟和高开放性等优点，而深受我的喜爱。

rM 在国内的知名度很低，相关中文资料很少，故有此文。

## SSH

rM 默认开启了 SSH 端口，转到 Settings -> Help -> Copyrights and licenses -> GPLv3 Compliance 查看可用的 IP 地址和密匙，并用如下命令连接设备：

```bash
ssh root@IP
```

先来借助 neofetch 查看一下 rM2 的技术细节吧！

```
        #####           root@reMarkable
       #######          ---------------
       ##O#O##          OS: Codex Linux 3.1.5 (dunfell) armv7l
       #######          Host: reMarkable 2.0
     ###########        Kernel: 4.14.78
    #############       Uptime: 28 mins
   ###############      Packages: 46 (opkg)
   ################     Shell: sh
  #################     Terminal: /dev/pts/0
#####################   CPU: Freescale i.MX7 Dual (Device Tree) (2) @ 1.200GHz
#####################   Memory: 170MiB / 1003MiB
  #################
```

## 中文字体

rM 在其市场定位的选择中并没有将中国大陆包含在内，故无自带中文。

Linux 的字体存放在 `/usr/share/fonts`，将字体通过 SCP 移入即可：

```bash
scp your_font(s) root@IP:/usr/share/fonts/ttf
```

个人比较常用的字体是[未来荧黑](https://github.com/welai/glow-sans)和[更纱黑体](https://github.com/be5invis/Sarasa-Gothic)，下载完毕后须删除等宽体等变体，因为 rM 不会让你选择字体，`.otf`  文件应放在 `/usr/share/fonts/opentype`。

如提示无储存空间，可通过建立符号链接解决，示例如下：

```bash
mkdir ~/fonts # on rM
scp ./glow root@10.11.99.1:~/fonts # on PC
ln -s ~/fonts /usr/share/fonts/opentype # on rM
```

完成操作后重启生效。

## 休眠壁纸

有关开机、关机、休眠状态下的图片都在 `/usr/share/remarkable` 下，重启后生效，怎么处理都随你啦！

## 设备时区

通过以下命令可以更改设备时区，设备支持的时区列表参看[这里](https://github.com/ddvk/remarkable-hacks/blob/master/docs/timezones.md)。

```bash
timedatectl set-timezone "Asia/Hong_Kong"
```

## Opkg

多亏了 rM 的高度开放性，社区已经提供了[一键安装脚本](https://github.com/toltec-dev/toltec)，使用如下脚本完成 Opkg 的部署，然后，你就可以使用来自 [Entware](http://bin.entware.net/armv7sf-k3.2) 和 [Toltec](https://toltec-dev.org/stable) 的软件包。

```bash
wget http://toltec-dev.org/bootstrap
echo "9195122984700c76ccdc58e25d09d0fca486324e8fc55ba781f6e1b812cc186c  bootstrap" | sha256sum -c && bash bootstrap
```

如果更新了系统，你可能需要通过以下命令重新激活 Opkg。

```bash
toltecctl reenable
```

## rm2fb

rM2 需要使用 [rm2fb](https://github.com/ddvk/remarkable2-framebuffer) 驱动帧缓冲区，使用以下命令完成部署。

```bash
opkg install rm2fb-client
```

rm2fb 的偏移量配置可以存放在[以下位置](https://github.com/ddvk/remarkable2-framebuffer/blob/master/src/shared/config.cpp#L196-L202)，如果当前的 rm2fb 没有适配当前设备版本的偏移量，在以下位置手动添加。

```c++
constexpr std::array config_locations = { 
  "/usr/share/rm2fb.conf", 
  "/opt/share/rm2fb.conf", 
  "/etc/rm2fb.conf", 
  "/opt/etc/rm2fb.conf", 
  "rm2fb.conf", 
}; 
```

下面是一个可行的配置示例：

```
!20211014151303
version str 2.10.2.356
update addr 0x398aac
updateType str QRect
create addr 0x39aec0
shutdown addr 0x39ae64
wait addr 0x39a3e4
getInstance addr 0x38f394
```

请记住，安装一个错误的 rm2fb 不会使设备变砖，你只需要通过 Opkg 卸载它并且等待新版本发布即可。

## remux

[remux](https://rmkit.dev/apps/remux) 是为 rM 设计的多任务应用启动器。安装重启后在屏幕左侧或右侧向上划（幅度大点）即可打开启动器。

修改 `~/.config/remux/remux.conf` 可自定义唤起方式，例如，下方配置代表三指点击（有很大的误触几率）唤起启动器。

```bash
launch_gesture=gesture=tap;fingers=3
```

## Java

目前可以从 [AdoptOpenJDK](https://adoptopenjdk.net) 获取到 arm 架构的 [jdk 16](https://github.com/AdoptOpenJDK/openjdk16-binaries/releases/download/jdk-16.0.1%2B9/OpenJDK16U-jdk_arm_linux_hotspot_16.0.1_9.tar.gz) 和 [jre 16](https://github.com/AdoptOpenJDK/openjdk16-binaries/releases/download/jdk-16.0.1%2B9/OpenJDK16U-jre_arm_linux_hotspot_16.0.1_9.tar.gz)。下载解压后在 `~/.bashrc` 最后一行配置 PATH 变量即可。

```bash
PATH=/opt/bin:/opt/sbin:$PATH:/home/root/your_java_dir/bin
```

## FileZilla

[FileZilla](https://filezilla-project.org) 是一款通过 FTP/SFTP 传输文件的工具，你可以使用它代替上文提到的 SCP，使用图形化界面进行操作。

## 其他

上文提到的 Toltec 源是专门为 rM 提供的，你还可以尝试源中的其他软件。这里说一些需要特别注意的地方：

- [remarkable-hacks](https://github.com/ddvk/remarkable-hacks) 很大概率上会造成 xochitl 极其不稳定（至少在我这是这样）。
- 使用第三方启动器后，建议取消 PIN，因为这可能会造成 rM 失控。
- 终端推荐使用 [yaft](https://github.com/timower/rM2-stuff/tree/master/apps/yaft)。这比 fingerterm 快且易用。
- 一份更加丰富的社区指南已经为你呈现：[awesome-reMarkable](https://github.com/reHackable/awesome-reMarkable)。

