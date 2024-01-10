---
title: WearOS 无痛更换配对设备
pubDate: 2020-01-28 21:26:25
description: " "
categories: [Android, WearOS]
---

1. `adb shell "pm clear com.google.android.gms && reboot"`

2. 等手表重启
3. `adb shell "am start -android.bluetooth.adapter.action.REQUEST_DISCOVERABLE"`
4. 去手机端重新配对