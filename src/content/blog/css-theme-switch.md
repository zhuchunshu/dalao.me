---
title: 用 CSS 变量做主题切换，不闪、不依赖框架
description: 三十行代码解决深浅色切换：消除首帧闪烁、跟随系统、记住用户选择，不需要任何 JavaScript 框架。
pubDate: 2025-11-03
tags:
  - CSS
  - 前端
---

深浅主题切换的难点从来不是"怎么切"，而是两个细节：**首帧不能闪**，以及**用户的选择要被记住**。

大部分实现翻车在第一点。页面先按浅色画出来，脚本跑完再跳成深色 —— 深色模式用户每次打开都要被闪一下。

## 一、把状态放在 `<html>` 上

所有样式都由 `data-theme` 属性驱动：

```css
:root {
  --bg: #ffffff;
  --text: #18181b;
}

:root[data-theme='dark'] {
  --bg: #0a0a0b;
  --text: #f4f4f5;
}

body {
  background: var(--bg);
  color: var(--text);
}
```

组件里只写 `var(--bg)`，永远不直接写颜色值。这样切换主题等于改一个属性，浏览器重算变量，全站跟着变 —— 不需要重新加载样式表，也不需要给每个元素加类名。

## 二、在 `<head>` 里同步执行

关键在这里：设置主题的脚本必须是**内联、同步、位于 `<head>` 中**的。

```html
<script is:inline>
  (() => {
    const stored = localStorage.getItem('theme');
    const theme = stored === 'light' || stored === 'dark'
      ? stored
      : matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.dataset.theme = theme;
  })();
</script>
```

浏览器解析到这里会**停下来执行**，此时 `<body>` 还没被解析。等页面开始渲染，`data-theme` 已经就位了，首帧就是正确颜色。

顺序反过来 —— 把脚本放在 `</body>` 前、或者加上 `defer` —— 闪烁就回来了。

## 三、用户没选过就跟随系统

优先级是：明确选择 > 系统偏好。而且系统偏好变化时要实时响应：

```js
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!localStorage.getItem('theme')) {
    document.documentElement.dataset.theme = e.matches ? 'dark' : 'light';
  }
});
```

一旦用户手动点过切换按钮，就写入 `localStorage`，此后系统偏好不再覆盖它。

## 四、容易被忽略的两件事

**存储可能不可用。** 隐私模式下 `localStorage` 会直接抛异常。用 `try/catch` 包住，失败时退化成"仅本次会话有效"，而不是让整个脚本崩掉 —— 脚本一崩，主题就锁死在默认值上。

**给个无障碍标签。** 按钮的 `aria-label` 要随状态更新（"切换到深色主题" / "切换到浅色主题"），别只放一个图标让屏幕阅读器念"button"。

---

整套下来三十行左右，没有依赖，构建后就是一段内联脚本。这个站上的 JavaScript 几乎只有它。
