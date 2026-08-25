# thinking-slider

[English](./README.md) | [中文](./README.zh-CN.md)

**Thinking-strength slider** — a client plugin for the DSH web UI that replaces the discrete button list for "thinking strength" (reasoning effort) in the model picker with a snap-to-step slider.

## Introduction

When using the DSH web UI, adjusting how "deeply" a model thinks — its thinking strength (reasoning effort) — hides behind a second-level menu in the model picker as a row of discrete buttons: `Default` / `Off` / `High` / `Max`. Clicking is straightforward, but for a concept that is inherently a continuous gradient, a button list is neither intuitive nor pleasant to operate.

**thinking-slider** exists exactly for this: it replaces that row of buttons with a **snap-to-step slider**, making thinking-strength adjustment as smooth and natural as a volume control.

- **More intuitive** — drag continuously; release to snap to the nearest step center with a springy settle animation. Every level "lands firmly and reads clearly".
- **More restrained** — only the "thinking strength" panel is replaced; model switching, the Default level, error retry, and the session lock state all behave exactly as the original.
- **Non-invasive** — it shadows the original seat (priority `-1`); stop or remove the plugin and the original button-list UI returns instantly, with nothing left behind.
- **User-aware** — the explanation text follows the DSH UI language (zh/en); after commit the host remains the single source of truth, so the UI always reflects the real selection.

It is not a standalone app — it is a lightweight DSH client plugin of 3 files and a few hundred lines: the host half merely marks the Loader row, while the browser half carries the entire UI and interaction, wired into DSH's plugin system through the `dsh.client` declaration and auto-loaded at process start.

## Features

- **Slider-based thinking strength** — open the model picker → "Thinking strength" and pick between `Default` / `Off` / `High` / `Max` (whatever levels the model actually provides)
- **Snap-to-step** — drag continuously; on release the thumb snaps to the nearest step center with a springy settle animation
- **Visual feedback** — capsule track, blue progress fill, middle-level dots (first/last hidden under the thumb), white round thumb
- **Explanatory copy** — under the title: "Higher strength produces more detailed reasoning but costs more time and resources"
- **Bilingual** — copy follows the DSH UI language
- **Commits immediately** — the snapped level is submitted via `session.selectModel`; the host is the single source of truth
- **Keeps original behavior** — model list switching, Default level, error retry, and session lock state match the original

## How it works

The plugin shadows the `conversation.input.model` seat via **shadow registration** (priority `-1` < original `0`; the lowest renders):

- The original (`@deepseek-ai/dsh-client-ui-model-selection`) registers at priority `0` and renders the two-level "Model / Reasoning effort" menu
- This plugin registers at priority `-1` and renders the two-level "Model / Thinking strength" menu, whose strength panel is a slider
- Stop or remove the plugin and the original button-list UI returns immediately

The data flow reuses the original per-session `ModelDirectory` (the `modelDirectories` service): load the model catalog → subscribe to `directory.store` → commit via `directory.select({provider, model, reasoningEffort})`.

## Install

> Requires the DSH web environment (`@deepseek-ai/dsh-web-app` and `dsh-client-ui-model-selection` mounted).

### Option A — let your DSH agent install it for you (recommended)

Copy the prompt below and paste it to any DSH agent session (e.g. the `cordis` preset). The agent will clone the plugin, place it in the right profile directory, patch the composition, and tell you when to restart.

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

### Option B — manual install

1. Clone this repository and put the `thinking-slider` directory into the DSH profile's node_modules (hoisted layout):

   ```bash
   # assuming DSH_HOME=C:\Users\<you>\.dsh
   cd %DSH_HOME%\profiles\node_modules
   git clone https://github.com/Motuo24/dsh-thinking-slider.git thinking-slider
   # or copy the thinking-slider directory here manually
   ```

2. Insert the plugin row into the DSH profile's composition patch:

   ```yaml
   # %DSH_HOME%\profiles\web\cordis.patch.yml
   - insert:
       - id: thinking-slider
         name: thinking-slider
   ```

3. Restart the DSH process (`client-modules` scans `dsh.client` declarations at startup and composes the plugin into the browser boot graph). Open the web UI, go to the model picker → "Thinking strength" to see the slider.

## Project structure

```
thinking-slider/
├── package.json       # dsh.client declaration (platform: web) + exports["./client"]
└── lib/
    ├── index.js       # host half: empty apply, just so the Loader recognizes the row
    └── client.js      # browser half: full UI in window.__ModuleLoader__.load format
```

## License

[MIT](./LICENSE)
