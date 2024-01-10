---
title: 「Kotlin 速成笔记」基本类型、运算符、数组和集合类
pubDate: 2021-04-03 22:16:02
description: "请注意，这是一个有关速成 Kotlin 的学习笔记，并不是系统性教程。本文需要读者掌握 Java。本文只会列出 Kotlin 与 Java 的常用不同之处，在实际编程中很少用到的 Kotlin 特性本文不会再提。"
categories: [Kotlin, 笔记]
---

> 请注意，这是一个有关速成 Kotlin 的学习笔记，并不是系统性教程。本文需要读者掌握 Java。本文只会列出 Kotlin 与 Java 的**常用**不同之处，在实际编程中很少用到的 Kotlin 特性本文不会再提。

## 基本类型

欢迎来到 Kotlin 的世界！这里本来应该先介绍 Kotlin 的优点，但这是速成笔记，不介绍。

Kotlin 和 Java 一样有 `Int`、`Long`、`Short`、`Float`、`Double`、`Boolean`、`Char`、`Byte` 等基本数据类型，用法上和 Java 没什么区别，不介绍。需要注意的是，Kotlin 已经完全抛弃了 Java 的关键字类型，转为对象数据类型，拥有自己的方法与继承结构。

Kotlin 使用以下语句声明变量：

```kotlin
val a = 6 //不可变的变量
var b = 6 //可变的变量
lateinit var a: String //声明一个变量并延迟初始化
```

前两行语句分别会创建一个类型为 `Int`，数值为 6 的可变变量与不可变变量。上述使用关键字 `val` 声明的变量相当于 Java 中的 `final int a = 6`。在 Kotlin 中，应总是优先声明不可变变量。

关键词 `lateinit` 表示对变量的延迟初始化，相当于 `int a`。这类声明在 Java 中可能很常见，但由于 Kotlin 的空安全机制，应尽力避免此类声明。

取决于 Kotlin 出色的类型推导机制，Kotlin 是一个静态强类型语言，这意味着在大部分情况下你不需要声明变量的类型，除了刚才的 `lateinit`，稍后我们还将看到几种需要声明类型的情况。

## 运算符

Kotlin 保留了一些 Java 中的基本运算符，如 `+`、`-`、`*`、`/`、`%`、`++`、`--`，这里不再介绍。同时，取决于 Kotlin 的 infix 函数，我们使用 `and`、`or` 分别取代 `&`、`|`。下面是一个例子：

```kotlin
var a = 10
a += a * 10 + 10 / 5
println(a)
```

对于基本类型、运算符和数学运算，Kotlin 还提供了大量好用的工具方法，如 `toInt()`、`toString(radix: Int)`，可以在实际操作中慢慢摸索。

## 数组和集合

Kotlin 弱化了数组的存在，应尽量使用集合类代替。下面是一种创建 array 和 list 的方法。

```kotlin
val array = arrayOf(2, 3, 3)
val list = listOf(2, 3, 3)
```

同样地，我们可以使用下标访问访问 array 和 list：

```kotlin
println(array[1])
println(list[1])
```

需要注意的是，通过 `listOf()` 声明的 list 数组不可变，如需要可变的 list，请使用 `mutableListOf()`。