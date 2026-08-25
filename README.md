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
Please install the DSH client plugin "thinking-slider" for me
(https://github.com/Motuo24/dsh-thinking-slider). It replaces the reasoning-effort
(thinking strength) button list in the model picker with a snap-to-step slider.

Install steps:
1. Inspect the environment:
   - Read DSH_HOME (env var DSH_HOME, default ~/.dsh or %USERPROFILE%\.dsh) and confirm
     <DSH_HOME>\profiles\web\cordis.patch.yml and <DSH_HOME>\profiles\node_modules exist.
   - If git cannot reach GitHub (e.g. "Connection was reset"), find a usable mirror or
     another way to obtain the source yourself; do not assume a local proxy exists.
2. Obtain the source: prefer cloning the repo into my current workspace (a directory I allow
   you to write), then copy the whole thinking-slider directory to
   <DSH_HOME>\profiles\node_modules\thinking-slider; cloning directly to the target also
   works (remove the .git directory inside afterwards). If the target already exists,
   overwrite it with the latest code.
   Note: writing under <DSH_HOME> is a deployment-config change — if the file sandbox denies
   access, request extended file permissions; that is expected, not an error.
3. Edit <DSH_HOME>\profiles\web\cordis.patch.yml: if it does not yet contain a
   thinking-slider plugin row, append at the end of the top-level array (keep any existing
   content):
   ```yaml
   - insert:
       - id: thinking-slider
         name: thinking-slider
   ```
4. Verify <DSH_HOME>\profiles\node_modules\thinking-slider\package.json exists, its
   exports["./client"] points to lib/client.js, and both lib/client.js and lib/index.js are
   present.
5. Do NOT try to restart the host DSH process yourself (it would interrupt this session).
   When done, remind me to restart DSH; after the restart I will open the model picker →
   "Thinking strength" in the web UI to verify the slider appears.
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
