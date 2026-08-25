# thinking-slider

[English](./README.md) | [中文](./README.zh-CN.md)

**思考强度滑条** —— 一个用于 DSH Web 界面的客户端插件，把模型选择菜单里的「思考强度」（推理等级 / reasoning effort）调整从离散按钮列表，替换为带档位吸附的滑条。

## 项目介绍

在使用 DSH Web 界面时，如果想调整模型"想多深"——也就是思考强度（推理等级），原版的入口藏在模型选择器的二级菜单里，是一排离散的按钮：`Default` / `Off` / `High` / `Max`。点选固然直接，但对"强度"这种本身是连续渐变的概念，按钮列表既不直观，也缺乏调节手感。

**thinking-slider** 正是为此而生：它把这一排按钮替换为一条**带档位吸附的滑条**，让思考强度的调节像音量一样顺滑自然。

- **更直观**：连续拖动，松手自动吸附到最近的档位中心，配弹性落档动画——每个档位都"停得稳、看得清"
- **更克制**：只替换「思考强度」面板，模型切换列表、Default 档、错误重试、会话锁定态等原版行为全部保留，不改变既有工作流
- **更无侵入**：通过影子注册（priority `-1`）替换原版席位，停止/删除插件即刻恢复原版界面，不留任何残余
- **更懂用户**：功能说明随界面中英文切换；提交后宿主为唯一事实源，界面状态始终与真实选择一致

它不是一个独立应用，而是一个 3 个文件、几百行代码的轻量 DSH 客户端插件：host 半仅作为 Loader 识别标记，浏览器半承载全部 UI 与交互，通过 `dsh.client` 声明接入 DSH 的插件体系，随进程启动自动加载。

## 特性

- **滑条调节思考强度**：进入模型选择器 →「思考强度」，用滑条在 `Default` / `Off` / `High` / `Max`（按模型实际提供的档位）之间选择
- **档位吸附**：连续拖动，松手自动吸附到最近的档位中心，并带弹性落档动画
- **视觉反馈**：胶囊轨道、蓝色进度填充、中间档位圆点（首末档被滑块遮挡）、白色圆滑块
- **说明文案**：标题下方提示「调高强度可获得更详细的推理过程，但会消耗更多时间与资源」
- **中英文双语**：文案随 DSH 界面语言切换
- **提交即生效**：吸附后的档位通过 `session.selectModel` 真实提交，宿主为唯一事实源
- **不中断原功能**：模型切换列表、Default 档、错误重试、会话锁定态等行为与原版一致

## 工作原理

插件通过 **影子注册**（priority `-1` < 原版 `0`，最低者渲染）替换 `conversation.input.model` 席位：

- 原版（`@deepseek-ai/dsh-client-ui-model-selection`）以 priority `0` 注册，渲染「模型 / 推理等级」两级菜单
- 本插件以 priority `-1` 注册，渲染「模型 / 思考强度」两级菜单，其中强度面板为滑条
- 停止/删除插件后，原版按钮列表界面立即恢复

数据流复用原版的 per-session `ModelDirectory`（`modelDirectories` 服务）：加载模型目录 → `directory.store` 订阅 → `directory.select({provider, model, reasoningEffort})` 提交。

## 安装

> 需要 DSH Web 环境（`@deepseek-ai/dsh-web-app` 及 `dsh-client-ui-model-selection` 已挂载）。

### 方式一：让 DSH Agent 自动安装（推荐）

复制下面的提示词，粘贴给任意 DSH Agent 会话（例如 `cordis` 预设）。Agent 会克隆插件、放到正确的 profile 目录、改好组合，并告诉你何时重启。

````markdown
请帮我安装 DSH 客户端插件「thinking-slider」（https://github.com/Motuo24/dsh-thinking-slider），
它把模型选择菜单里的思考强度（推理等级）从按钮列表替换为带档位吸附的滑条。

安装步骤：
1. 探测 DSH_HOME（环境变量 DSH_HOME，缺省为 ~/.dsh / %USERPROFILE%\.dsh）。
2. 把仓库克隆到 <DSH_HOME>\profiles\node_modules\thinking-slider（git clone
   https://github.com/Motuo24/dsh-thinking-slider.git thinking-slider）；
   若该目录已存在，改为拉取最新（git pull）。
3. 检查 <DSH_HOME>\profiles\web\cordis.patch.yml：如果还没有 thinking-slider 插件行，
   在顶层数组末尾追加：
   ```yaml
   - insert:
       - id: thinking-slider
         name: thinking-slider
   ```
4. 校验 package.json 存在且 exports["./client"] 指向 lib/client.js。
5. 完成后提醒我重启 DSH 进程，重启后打开 Web 界面的模型选择器 →「思考强度」验证滑条。
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

## 项目结构

```
thinking-slider/
├── package.json       # dsh.client 声明（platform: web）+ exports["./client"]
└── lib/
    ├── index.js       # host 半：空 apply，仅让 Loader 识别该行
    └── client.js      # 浏览器半：window.__ModuleLoader__.load 格式的完整 UI
```

## 许可

[MIT](./LICENSE)
