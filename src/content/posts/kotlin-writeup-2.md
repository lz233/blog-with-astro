---
title: 「Kotlin 速成笔记」区间、逻辑控制、标准函数、空类型判断、Lambda 式函数
pubDate: 2021-05-04 00:21:01
description: " "
categories: [Kotlin, 笔记]
---

## 区间

Kotlin 有一种特殊的区间类型，可以用下面方法表示：

```kotlin
val a = 2..233 //[2,233]
val b = 2 until 233 //[2,233)
val c = 233 downTo 2 //[233,2]
```

区间可以配合其他函数使用，例如，从 Kotlin 1.3 开始，`(2..3).random()` 可以生成一个 [2,3] 区间内的整数。

## 逻辑控制

Kotlin 的 `if` 语句与 Java 基本没有区别，但它可以有返回值。

```kotlin
val result = if ((2..3).random() > (2..3).random()) 2333 else 233
```

这种写法类似于 Java 中的 三元运算符，但可以调用方法进行返回，所以 Kotlin 抛弃了三元运算符。

`when` 语句是 Kotlin 的新增特性，用于替代 Java 的 `switch` 语句。

```kotlin
val result = when ((2..233).random()) {
    233 -> {
        val a = mutableListOf(0, 23, 233, 2333, 23333, 233333, 2333333)
        var bottom = 6
        var i = 1
        var t = 0
        while (i < 2) {
            for (j in bottom downTo (i + 1)) if (a[j] > a[j - 1]) t = a[j];a[j] = a[j - 1];a[j - 1] = t
            i++
            for (j in i until bottom) if (a[j] < a[j + 1]) t = a[j];a[j] = a[j + 1];a[j + 1] = t
            bottom--
        }
        a[1]
    }
    else -> 233
}
```

`when` 语句不再仅限于对几种基本变量的判断，还可以让代码更加精简。

Kotlin 抛弃了 Java 的 `for-i` 循环，而大大加强了 `for-each` 循环。

```kotlin
for (i in 2..233 step 2) {
    println(i)
}
```

除了配合区间使用，`for` 循环也可以配合迭代器使用。

```kotlin
val list = listOf(233, 233, 233)
for (a in list) {
    println(a)
}
```

Kotlin 的 `while` 循环与 Java 无异，不再赘述。

## 标准函数

Kotlin 内置了很多可以简化代码的标准函数，常用的有 `with`、`run`、`apply`。

`with` 函数可以在连续调用同一对象的多个方法时带来便利。

```kotlin
val result = with(StringBuilder()) {
    var a = "233"
    for (i in 0..10) append("$a\n");a = "${a}3"
    toString()
}
```

`run` 函数和 `with` 函数相似，但只接收一个 lambda 参数。

```kotlin
val result = StringBuilder().run {
    var a = "233"
    for (i in 0..10) append("$a\n");a = "${a}3"
    toString()
}
```

`apply` 函数也只接收一个 lambda 参数，但将对象本身作为返回值。

```kotlin
val result = StringBuilder().apply {
    var a = "233"
    for (i in 0..10) append("$a\n");a = "${a}3"
}.toString()
```

标准函数的用法很相似，大多可以根据实际情况相互转化。

## 空类型判断

Kotlin 是一个空安全的语言，有时我们需要空类型判断。在有必要的时候，我们也需要声明可空类型。

```kotlin
var a: Int? = null
a?.let { println(it) }
println(a!!)
println(a ?: 1)
```

在声明类型之后加 `?` 即为可空类型，此时我们需要使用 `?.` 操作对象。如果确定对象不可能为空，则可使用 `!!` 避免空类型判断。`?:` 则表示如果左侧对象为空则返回右侧的对象。

`let` 函数也是一种判断空类型的工具，可以简单地看成当对象不为空就执行 `let` 中的逻辑。

## Lambda 式函数

可以说，lambda 是 Kotlin 的精髓所在，Kotlin 内大量的函数都用到了 lambda。这里的「lambda 式函数」专指对应 Java 中接收单抽象方法接口的函数，此类函数的 Kotlin 实现则称为高阶函数。最常见的例子是 `Runnable` 接口，这个接口只有一个待实现的方法 `run()`。

在 Java 中，这样的写法可以执行一个子线程：

```java
new Thread(new Runnable() {
    @Override
    public void run() {
        System.out.println("233");
    }
}).start();
```

将这段代码翻译成 Kotlin：

```kotlin
Thread(object :Runnable{
    override fun run() {
        println("233")
    }
}).start()
```

因 `Runnable` 接口中只有一个方法，且 Kotlin 规定当方法的最后一个参数为 lambda 时可以将其写到括号外围，故将其简化：

```kotlin
Thread { println("233") }.start()
```

就可以推导出一个 lambda 式函数的由来。