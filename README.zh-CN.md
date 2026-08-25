# thinking-slider

[English](./README.md) | [中文](./README.zh-CN.md)

<div align="center">

**把 DSH Web 界面模型选择器里的「思考强度」（推理等级）调节，换成一条带档位吸附的滑条。**

<br/>

<a href="https://github.com/Motuo24/dsh-thinking-slider/stargazers"><img alt="GitHub stars" src="https://img.shields.io/github/stars/Motuo24/dsh-thinking-slider" /></a>
<a href="https://github.com/Motuo24/dsh-thinking-slider/blob/main/LICENSE"><img alt="License: MIT" src="https://img.shields.io/github/license/Motuo24/dsh-thinking-slider" /></a>
<a href="https://github.com/Motuo24/dsh-thinking-slider"><img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/Motuo24/dsh-thinking-slider" /></a>
<a href="https://github.com/Motuo24/dsh-thinking-slider"><img alt="Repo size" src="https://img.shields.io/github/repo-size/Motuo24/dsh-thinking-slider" /></a>
<a href="https://github.com/topics/dsh-plugin"><img alt="DSH plugin" src="https://img.shields.io/badge/插件生态-topic%20dsh--plugin-4d6bfe" /></a>

**让模型的思考强度调节，像音量一样顺滑自然。**

</div>

## 📑 目录

- [✨ 项目介绍](#-项目介绍)
- [🎯 特性](#-特性)
- [🖼️ 效果图](#️-效果图)
- [🔧 工作原理](#-工作原理)
- [🚀 安装](#-安装)
- [🔄 更新](#-更新)
- [❓ 常见问题](#-常见问题)
- [🧩 兼容性](#-兼容性)
- [🛠️ 开发与构建](#️-开发与构建)
- [📋 更新日志](#-更新日志)
- [⚠️ 已知限制](#️-已知限制)
- [🤝 参与贡献](#-参与贡献)
- [📄 许可](#-许可)

## ✨ 项目介绍

在使用 DSH Web 界面时，如果想调整模型"想多深"——也就是思考强度（推理等级），原版的入口藏在模型选择器的二级菜单里，是一排离散的按钮：`Default` / `Off` / `High` / `Max`。点选固然直接，但对"强度"这种本身是连续渐变的概念，按钮列表既不直观，也缺乏调节手感。

**thinking-slider** 正是为此而生：它把这一排按钮替换为一条**带档位吸附的滑条**，让思考强度的调节像音量一样顺滑自然。

- **更直观**：连续拖动，松手自动吸附到最近的档位中心，配弹性落档动画——每个档位都"停得稳、看得清"
- **更克制**：只替换「思考强度」面板，模型切换列表、Default 档、错误重试、会话锁定态等原版行为全部保留，不改变既有工作流
- **更无侵入**：通过影子注册（priority `-1`）替换原版席位，停止/删除插件即刻恢复原版界面，不留任何残余
- **更懂用户**：功能说明随界面中英文切换；提交后宿主为唯一事实源，界面状态始终与真实选择一致

它不是一个独立应用，而是一个 3 个文件、几百行代码的轻量 DSH 客户端插件：host 半仅作为 Loader 识别标记，浏览器半承载全部 UI 与交互，通过 `dsh.client` 声明接入 DSH 的插件体系，随进程启动自动加载。

## 🎯 特性

- **滑条调节思考强度**：进入模型选择器 →「思考强度」，用滑条在 `Default` / `Off` / `High` / `Max`（按模型实际提供的档位）之间选择
- **档位吸附**：连续拖动，松手自动吸附到最近的档位中心，并带弹性落档动画
- **自动屏蔽冗余 Default**：当模型暴露 5 个及以上具体档位时，自动去掉 "Default" 占位项，滑条保持清爽
- **视觉反馈**：胶囊轨道、蓝色进度填充、中间档位圆点（首末档被滑块遮挡）、白色圆滑块
- **说明文案**：标题下方提示「调高强度可获得更详细的推理过程，但会消耗更多时间与资源」
- **中英文双语**：文案随 DSH 界面语言切换
- **提交即生效**：吸附后的档位通过 `session.selectModel` 真实提交，宿主为唯一事实源
- **不中断原功能**：模型切换列表、Default 档、错误重试、会话锁定态等行为与原版一致

## 🖼️ 效果图

### 更多思考强度档位 —— MiniMax M2.7

DSH 接入 MiniMax M2.7 时，插件会适配模型暴露的推理档位目录，扩展到更多的思考强度等级，并统一落在一条带档位吸附的滑条上。

![MiniMax M2.7 —— 更多思考强度档位](docs/images/minimax-m27-more-levels-v2.png)

### 叠加到 DeepSeek

同一条滑条叠加在 DeepSeek 模型上，在 `Off` / `Low` / `High` / `Max` 之间干净吸附。

![DeepSeek —— 思考强度滑条](docs/images/deepseek-overlay.png)

## 🔧 工作原理

插件通过 **影子注册**（priority `-1` < 原版 `0`，最低者渲染）替换 `conversation.input.model` 席位：

- 原版（`@deepseek-ai/dsh-client-ui-model-selection`）以 priority `0` 注册，渲染「模型 / 推理等级」两级菜单
- 本插件以 priority `-1` 注册，渲染「模型 / 思考强度」两级菜单，其中强度面板为滑条
- 停止/删除插件后，原版按钮列表界面立即恢复

数据流复用原版的 per-session `ModelDirectory`（`modelDirectories` 服务）：加载模型目录 → `directory.store` 订阅 → `directory.select({provider, model, reasoningEffort})` 提交。

## 🚀 安装

> 需要 DSH Web 环境（`@deepseek-ai/dsh-web-app` 及 `dsh-client-ui-model-selection` 已挂载）。

### 方式一：让 DSH Agent 自动安装（推荐）

复制下面的提示词，粘贴给任意 DSH Agent 会话（例如 `cordis` 预设）。Agent 会克隆插件、放到正确的 profile 目录、改好组合，并告诉你何时重启。

````markdown
请帮我安装 DSH 客户端插件「thinking-slider」（https://github.com/Motuo24/dsh-thinking-slider），
它把模型选择菜单里的思考强度（推理等级）从按钮列表替换为带档位吸附的滑条。

安装步骤：
1. 确认环境：
   - 读取 DSH_HOME（环境变量 DSH_HOME，缺省 ~/.dsh 或 %USERPROFILE%\.dsh），确认
     <DSH_HOME>\profiles\web\cordis.patch.yml 与 <DSH_HOME>\profiles\node_modules 存在。
   - 若 git 访问 GitHub 失败（如 Connection was reset），由你自行寻找可用的镜像地址或
     其他方式获取源码，不要假定本机存在本地代理。
2. 获取插件源码：优先把仓库克隆到当前工作区（我允许写入的目录），随后将整个
   thinking-slider 目录复制到 <DSH_HOME>\profiles\node_modules\thinking-slider；
   也可以直接克隆到目标位置（克隆后删除其中的 .git 目录）。若目标目录已存在，用最新代码覆盖。
   注意：写入 <DSH_HOME> 属于部署配置修改，若文件沙箱拒绝访问，请申请扩展文件权限——
   这是预期内的，不是错误。
3. 编辑 <DSH_HOME>\profiles\web\cordis.patch.yml：若其中还没有 thinking-slider 插件行，
   在顶层数组末尾追加（保留文件里已有的其他内容）：
   ```yaml
   - insert:
       - id: thinking-slider
         name: thinking-slider
   ```
4. 校验 <DSH_HOME>\profiles\node_modules\thinking-slider\package.json 存在，
   且其 exports["./client"] 指向 lib/client.js，lib/client.js 与 lib/index.js 均在。
5. 不要尝试自行重启宿主 DSH 进程（会中断当前会话）。完成后提醒我重启 DSH 进程；
   重启后我打开 Web 界面的模型选择器 →「思考强度」验证滑条是否出现。
````

### 方式二：手动安装

1. 克隆本仓库，并把 `thinking-slider` 目录放入 DSH profile 的 node_modules（hoisted 布局）：

   ```bash
   # 假设 DSH_HOME=C:\Users\<you>\.dsh
   cd %DSH_HOME%\profiles\node_modules
   git clone https://github.com/Motuo24/dsh-thinking-slider.git thinking-slider
   # 或手动复制 thinking-slider 目录到这里
   ```

2. 在 DSH profile 的组合 patch 中插入插件行：

   ```yaml
   # %DSH_HOME%\profiles\web\cordis.patch.yml
   - insert:
       - id: thinking-slider
         name: thinking-slider
   ```

3. 重启 DSH 进程（`client-modules` 在启动时扫描 `dsh.client` 声明，把插件编入浏览器启动图）。打开 Web 界面，进入模型选择器 →「思考强度」即可看到滑条。

## 🔄 更新

```bash
cd %DSH_HOME%\profiles\node_modules\thinking-slider
git pull
```

然后重启 DSH。`client-modules` 只在启动时读取一次 bundle，所以需要重启（或 host 半重建后硬刷新浏览器）才能加载新的 `client.js`。

## ❓ 常见问题

| 现象 | 原因与解决 |
|---|---|
| 设置页插件列表里看不到它 | 这是**纯客户端插件**（无 host 行为），设置页插件列表可能只列出 host 行。以界面本身为准：打开模型选择器 →「思考强度」应显示滑条。 |
| 装完还是原来的按钮列表 | `client-modules` 在**启动时**扫描 `dsh.client` 声明。重启 DSH，并硬刷新浏览器（Ctrl/Cmd+Shift+R）。 |
| 自定义模型档位太多 | 插件会在模型暴露 5 个以上具体档位时**自动隐藏 Default 占位项**。若仍觉得拥挤，欢迎提 issue。 |
| 出现两个滑条 / 行为重复 | 大概率 `cordis.patch.yml` 里插件行写了两遍，或同时存在 git clone 与其他安装路径。删掉重复行即可。 |
| 重启 DSH 后恢复原版按钮列表 | 插件包不在 profile 的 `node_modules`，或组合行缺失。重新检查安装的两步。 |

## 🧩 兼容性

| 组件 | 要求 |
|---|---|
| DSH | Web 界面（`dsh --profile web`），已挂载 `@deepseek-ai/dsh-web-app` |
| 依赖 | 已挂载 `@deepseek-ai/dsh-client-ui-model-selection`（提供模型目录服务） |
| Node.js | ≥ 20（与 DSH 本身一致） |
| 浏览器 | DSH Web 支持的任意浏览器（推荐 Chromium/Edge） |

## 🛠️ 开发与构建

```bash
git clone https://github.com/Motuo24/dsh-thinking-slider.git
cd dsh-thinking-slider
```

没有构建步骤——`lib/client.js` 是纯 JavaScript（DSH 发给浏览器的 `window.__ModuleLoader__.load` 格式），`lib/index.js` 是空的 host 半。改完把自己的副本装进 profile（`<DSH_HOME>\profiles\node_modules\thinking-slider`），重启 DSH 即可。

项目结构：

```
thinking-slider/
├── package.json       # dsh.client 声明（platform: web）+ exports["./client"]
└── lib/
    ├── index.js       # host 半：空 apply，仅让 Loader 识别该行
    └── client.js      # 浏览器半：window.__ModuleLoader__.load 格式的完整 UI
```

## 📋 更新日志

- **0.1.0** — 初始发布：滑条替换思考强度按钮列表、档位吸附 + 落档动画、中英文双语文案、效果图、Agent 自动安装提示词、5+ 档位自动隐藏 Default。

## ⚠️ 已知限制

- **纯客户端插件**：无 host 半行为，只能在浏览器界面内工作。
- **需要重启生效**：`client-modules` 在启动时读取 bundle 内容，新版本要重启才能加载。
- **档位与模型目录一致**：滑条只展示适配器上报的档位，不会凭空创造档位。
- **依赖原版席位**：若部署中移除了 `@deepseek-ai/dsh-client-ui-model-selection`，本插件没有可影子的目标，将不渲染任何内容。

## 🤝 参与贡献

欢迎提 issue 和 PR！这是个小型项目——bug 报告、效果图更新、文案修正、打磨类 PR 都非常欢迎。

1. Fork 本仓库并创建功能分支
2. 在 `lib/client.js` 里修改（无构建步骤）
3. 本地安装到你的 DSH profile 并重启验证
4. 提交 PR，附上简短说明；涉及 UI 的改动请附带截图

## 📄 许可

[MIT](./LICENSE)
