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
