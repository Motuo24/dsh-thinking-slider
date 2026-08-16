window.__ModuleLoader__.load({
	id: "thinking-slider",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let React = require("react");
		let _deepseek_ai_cordis = require("@deepseek-ai/cordis");

		//#region dictionaries
		const NS = 'model-slider';

		const zh = {
			'trigger.fallback': '选择模型',
			'trigger.selectAria': '选择模型',
			'trigger.aria': '选择模型，当前 {model}',
			'trigger.ariaEffort': '选择模型，当前 {model}，思考强度 {effort}',
			'menu.aria': '模型与思考强度',
			'menu.model': '模型',
			'menu.effort': '思考强度',
			'effort.providerDefault': 'Default',
			'status.loading': '正在刷新模型列表…',
			'error.action': '模型操作失败：{message}',
			'action.reload': '重新加载',
			'warning.groupLoad': '{name} 加载失败：{message}',
			'empty.models': '没有可用的模型。',
			'empty.efforts': '当前模型未提供思考强度等级。',
			'desc.meaning': '调高强度可获得更详细的推理过程，但会消耗更多时间与资源。',
			'slider.aria': '思考强度：{effort}',
			'back.label': '返回'
		};

		const en = {
			'trigger.fallback': 'Select model',
			'trigger.selectAria': 'Select model',
			'trigger.aria': 'Select model, current {model}',
			'trigger.ariaEffort': 'Select model, current {model}, thinking strength {effort}',
			'menu.aria': 'Model and thinking strength',
			'menu.model': 'Model',
			'menu.effort': 'Thinking strength',
			'effort.providerDefault': 'Default',
			'status.loading': 'Refreshing model list…',
			'error.action': 'Model operation failed: {message}',
			'action.reload': 'Reload',
			'warning.groupLoad': '{name} failed to load: {message}',
			'empty.models': 'No models available.',
			'empty.efforts': 'This model provides no thinking strength levels.',
			'desc.meaning': 'Higher strength produces more detailed reasoning but costs more time and resources.',
			'slider.aria': 'Thinking strength: {effort}',
			'back.label': 'Back'
		};
		//#endregion

		//#region styles
		const CSS = `
.ths-root{min-width:0;position:relative}
.ths-trigger{min-width:0;max-width:220px;height:28px;color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border:none;border-radius:24px;outline:none;align-items:center;gap:4px;padding:0 4px 0 8px;font-size:13px;font-weight:500;line-height:20px;display:flex}
.ths-trigger:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}
.ths-trigger:focus-visible{box-shadow:0 0 0 2px var(--dsw-alias-border-l3)}
.ths-trigger:disabled{color:var(--dsw-alias-label-dimmed);cursor:default}
.ths-triggerLabel{text-overflow:ellipsis;white-space:nowrap;min-width:0;overflow:hidden}
.ths-triggerEffort{color:var(--dsw-alias-label-caption);flex:none}
.ths-chevron{color:var(--dsw-alias-label-caption);flex:none;transition:transform .12s;display:flex}
.ths-chevronOpen{transform:rotate(180deg)}
.ths-menu{z-index:20;border:1px solid var(--dsw-alias-border-inverted);background:var(--dsw-specific-menu);width:min(280px,100vw - 32px);max-height:min(440px,100vh - 96px);box-shadow:var(--dsw-shadow-lv3);color:var(--dsw-alias-label-primary);--dsh-scrollbar-thumb:var(--dsw-alias-scrollbar-bg-l2);--dsh-scrollbar-thumb-hover:var(--dsw-alias-scrollbar-hover-l2);border-radius:12px;flex-direction:column;padding:4px;display:flex;position:absolute;bottom:calc(100% + 8px);right:0;overflow:hidden}
.ths-status,.ths-empty{color:var(--dsw-alias-label-tertiary);padding:10px;font-size:13px;line-height:20px}
.ths-error{background:var(--dsw-alias-interactive-bg-hover-danger);color:var(--dsw-alias-state-error-primary);border-radius:8px;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:4px;padding:7px 8px;font-size:12px;line-height:18px;display:flex}
.ths-warning{background:var(--dsw-alias-bg-module-platform);color:var(--dsw-alias-state-warn-label)}
.ths-retry{color:inherit;font:inherit;cursor:pointer;background:0 0;border:none;flex:none;padding:0;font-weight:600}
.ths-cell{width:100%;border:none;background:0 0;color:inherit;font:inherit;text-align:left;border-radius:8px;align-items:center;gap:8px;min-height:32px;padding:0 8px;font-size:13px;line-height:20px;display:flex;cursor:pointer}
.ths-cell:hover{background:var(--dsw-alias-interactive-bg-hover)}
.ths-cell:focus-visible{outline:2px solid var(--dsw-alias-border-l3);outline-offset:-2px}
.ths-cellLabel{flex:1;color:var(--dsw-alias-label-primary)}
.ths-cellValue{color:var(--dsw-alias-label-caption);text-overflow:ellipsis;white-space:nowrap;max-width:110px;overflow:hidden}
.ths-cellChevron{color:var(--dsw-alias-label-caption);flex:none;display:flex}
.ths-groups{overflow:auto;flex:1;min-height:0}
.ths-group{padding:2px 0 6px}
.ths-groupTitle{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px;padding:6px 8px 2px}
.ths-option{width:100%;border:none;background:0 0;color:inherit;font:inherit;text-align:left;border-radius:8px;align-items:flex-start;gap:8px;min-height:36px;padding:6px 8px;font-size:13px;line-height:20px;display:flex;cursor:pointer}
.ths-option:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}
.ths-option:focus-visible{outline:2px solid var(--dsw-alias-border-l3);outline-offset:-2px}
.ths-option:disabled{color:var(--dsw-alias-label-dimmed);cursor:default}
.ths-optionCopy{flex:1;min-width:0;flex-direction:column;display:flex}
.ths-modelName{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}
.ths-description{color:var(--dsw-alias-label-caption);font-size:12px;line-height:16px}
.ths-check{color:var(--dsw-alias-brand-primary);flex:none;display:flex;align-items:center}
.ths-sliderPane{flex-direction:column;gap:8px;padding:10px 20px 14px;display:flex}
.ths-sliderHeader{align-items:center;gap:8px;font-size:13px;font-weight:600;color:var(--dsw-alias-label-primary);display:flex}
.ths-back{width:24px;height:24px;border:none;background:0 0;color:var(--dsw-alias-label-secondary);border-radius:6px;cursor:pointer;align-items:center;justify-content:center;display:flex;flex:none}
.ths-back:hover{background:var(--dsw-alias-interactive-bg-hover)}
.ths-back:focus-visible{outline:2px solid var(--dsw-alias-border-l3);outline-offset:-2px}
.ths-sliderValue{margin-left:auto;color:var(--dsw-alias-label-caption);font-size:12px;font-weight:400;background:var(--dsw-alias-interactive-bg-hover);border-radius:999px;padding:2px 8px}
.ths-meaning{font-size:12px;line-height:17px;color:var(--dsw-alias-label-secondary);margin:-2px 0 0}
.ths-customSlider{position:relative;width:100%;height:24px;border-radius:999px;background:color-mix(in srgb,var(--dsw-alias-label-primary) 12%,transparent);margin:14px 0 4px;flex:none}
.ths-fill{position:absolute;top:0;left:0;height:100%;width:0;background:#4a9eff;border-radius:999px;z-index:1;transition:width .15s ease-out}
.ths-dots{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:2}
.ths-dot{position:absolute;top:50%;width:8px;height:8px;border-radius:50%;background:rgba(150,150,150,.45);transform:translate(-50%,-50%);transition:background .15s ease-out}
.ths-dotActive{background:rgba(255,255,255,.85)}
.ths-range{position:absolute;top:0;left:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer;z-index:4;-webkit-appearance:none;appearance:none}
.ths-range:disabled{cursor:default}
.ths-range:disabled ~ .ths-fill,.ths-range:disabled ~ .ths-thumb{opacity:.5}
.ths-thumb{position:absolute;top:50%;left:0;width:32px;height:32px;background:#fff;border:1px solid rgba(0,0,0,.06);border-radius:50%;transform:translate(0,-50%);box-shadow:0 2px 10px rgba(0,0,0,.12),0 1px 3px rgba(0,0,0,.08);pointer-events:none;z-index:5;transition:left .15s ease-out}
.ths-thumb.ths-snapped{animation:ths-snap .32s cubic-bezier(.34,1.56,.64,1)}
@keyframes ths-snap{0%{transform:translate(0,-50%) scale(1)}35%{transform:translate(0,-50%) scale(1.06)}65%{transform:translate(0,-50%) scale(.98)}100%{transform:translate(0,-50%) scale(1)}}
@media (prefers-reduced-motion:reduce){.ths-thumb.ths-snapped{animation:none}}
.ths-ticks{position:relative;height:18px;margin-top:0}
.ths-tick{position:absolute;top:0;border:none;background:0 0;color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:16px;padding:1px 4px;cursor:pointer;border-radius:6px;max-width:45%;text-overflow:ellipsis;white-space:nowrap;overflow:hidden}
.ths-tick:hover{color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-interactive-bg-hover)}
.ths-tickActive{color:#4a9eff;font-weight:600}
.ths-tick:focus-visible{outline:2px solid var(--dsw-alias-border-l3);outline-offset:-2px}
.ths-sliderMeta{flex-direction:column;gap:2px;display:flex}
.ths-sliderDesc{font-size:12px;line-height:16px;color:var(--dsw-alias-label-secondary)}
`;
		const tagId = "thinking-slider/thinking-slider.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "thinking-slider";
			tag.dataset.pluginCss = tagId;
			tag.textContent = CSS;
			document.head.appendChild(tag);
		}
		//#endregion

		//#region icons
		function IconChevronDown() {
			return React.createElement('svg', { width: 14, height: 14, viewBox: '0 0 16 16', 'aria-hidden': true, style: { display: 'block' } },
				React.createElement('path', { d: 'M4 6l4 4 4-4', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }));
		}

		function IconChevronRight() {
			return React.createElement('svg', { width: 14, height: 14, viewBox: '0 0 16 16', 'aria-hidden': true, style: { display: 'block' } },
				React.createElement('path', { d: 'M6 4l4 4-4 4', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }));
		}

		function IconCheck() {
			return React.createElement('svg', { width: 16, height: 16, viewBox: '0 0 16 16', 'aria-hidden': true, style: { display: 'block' } },
				React.createElement('path', { d: 'M3.5 8.5l3 3 6-7', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }));
		}
		//#endregion

		//#region ModelSeatSlider
		function ModelSeatSlider(props) {
			const { locked, available, directory, load, select, t } = props;
			const state = React.useSyncExternalStore((fn) => directory.subscribe(fn), () => directory.getSnapshot());
			const [open, setOpen] = React.useState(false);
			const [pane, setPane] = React.useState('root');
			const [draft, setDraft] = React.useState(null);
			const [pending, setPending] = React.useState(null);
			const [dragging, setDragging] = React.useState(false);
			const [selectError, setSelectError] = React.useState(null);
			const [thumbWidth, setThumbWidth] = React.useState(32);
			const lastActionRef = React.useRef('load');
			const draftRef = React.useRef(null);
			const commitSeqRef = React.useRef(0);
			const rootRef = React.useRef(null);
			const triggerRef = React.useRef(null);
			const rangeRef = React.useRef(null);
			const sliderRef = React.useRef(null);
			const thumbRef = React.useRef(null);
			const itemRefs = React.useRef([]);
			const id = React.useId();

			const choices = React.useMemo(() => state.groups.flatMap((group) => group.models.map((model) => ({
				group,
				model,
				selection: {
					provider: group.id,
					model: model.id,
					...(model.reasoning?.defaultEffort === undefined ? {} : { reasoningEffort: model.reasoning.defaultEffort })
				}
			}))), [state.groups]);

			const currentChoice = state.current === null ? undefined : choices.find((c) => c.selection.provider === state.current.provider && c.selection.model === state.current.model);
			const reasoning = currentChoice?.model.reasoning;
			const effectiveEffort = state.current?.reasoningEffort ?? reasoning?.defaultEffort;
			const effortLabel = reasoning === undefined ? undefined : effectiveEffort === undefined ? t('effort.providerDefault') : (reasoning.efforts.find((level) => level.id === effectiveEffort)?.name ?? effectiveEffort);
			const effortChoices = React.useMemo(() => reasoning === undefined ? [] : [
				...(reasoning.defaultEffort === undefined ? [{ key: 'provider-default', effort: undefined, label: t('effort.providerDefault') }] : []),
				...reasoning.efforts.map((effort) => ({ key: 'effort:' + effort.id, effort: effort.id, label: effort.name, ...(effort.description === undefined ? {} : { description: effort.description }) }))
			], [reasoning, t]);

			const count = effortChoices.length;
			const stepCenters = React.useMemo(() => {
				const arr = [];
				for (let i = 0; i < count; i++) arr.push(i * (100 / (count - 1 || 1)));
				return arr;
			}, [count]);
			const snapToStep = (percent) => {
				let nearest = 0;
				let minDist = Math.abs(percent - stepCenters[0]);
				for (let i = 1; i < count; i++) {
					const dist = Math.abs(percent - stepCenters[i]);
					if (dist < minDist) { minDist = dist; nearest = i; }
				}
				return { index: nearest, center: stepCenters[nearest] };
			};

			const busy = state.status === 'selecting';
			const effectiveIndex = count === 0 ? 0 : (() => {
				const idx = effortChoices.findIndex((c) => c.effort === effectiveEffort);
				return idx < 0 ? 0 : idx;
			})();
			const activeIndex = pending !== null ? pending : effectiveIndex;
			const shownPct = draft !== null ? draft : stepCenters[activeIndex] ?? 0;
			const currentEffort = count === 0 ? undefined : effortChoices[activeIndex];
			const modelLabel = currentChoice?.model.name ?? t('trigger.fallback');
			const shownEffortLabel = currentEffort !== undefined ? currentEffort.label : effortLabel;
			const triggerLabel = shownEffortLabel === undefined ? modelLabel : modelLabel + ' · ' + shownEffortLabel;
			const triggerAria = currentChoice === undefined ? t('trigger.selectAria') : shownEffortLabel === undefined ? t('trigger.aria', { model: modelLabel }) : t('trigger.ariaEffort', { model: modelLabel, effort: shownEffortLabel });

			React.useEffect(() => {
				if (available) {
					lastActionRef.current = 'load';
					load();
				}
			}, [available, load]);

			React.useEffect(() => {
				if (!open) return;
				const closeOutside = (event) => {
					if (!rootRef.current?.contains(event.target)) setOpen(false);
				};
				document.addEventListener('mousedown', closeOutside);
				return () => document.removeEventListener('mousedown', closeOutside);
			}, [open]);

			React.useEffect(() => {
				const measure = () => {
					if (thumbRef.current !== null) setThumbWidth(thumbRef.current.offsetWidth || 32);
				};
				measure();
				window.addEventListener('resize', measure);
				return () => window.removeEventListener('resize', measure);
			}, [open, pane]);

			React.useEffect(() => {
				if (pending === null) return;
				const choice = effortChoices[pending];
				if (choice === undefined || choice.effort !== effectiveEffort) return;
				setPending(null);
			}, [pending, effortChoices, effectiveEffort]);

			React.useEffect(() => {
				if (draftRef.current !== null) return;
				if (rangeRef.current !== null) rangeRef.current.value = String(shownPct);
			}, [shownPct]);

			if (!available) return null;

			const show = () => {
				setPane('root');
				setSelectError(null);
				setOpen(true);
				lastActionRef.current = 'load';
				load();
			};
			const close = (restoreFocus) => {
				setOpen(false);
				setPane('root');
				setDraft(null);
				setPending(null);
				setSelectError(null);
				setDragging(false);
				draftRef.current = null;
				if (restoreFocus) queueMicrotask(() => triggerRef.current?.focus());
			};
			const moveFocus = (offset) => {
				const items = itemRefs.current.filter((item) => item !== null);
				if (items.length === 0) return;
				const active = items.findIndex((item) => item === document.activeElement);
				items[(Math.max(active, 0) + offset + items.length) % items.length]?.focus();
			};
			const onRootKeyDown = (event) => {
				if (event.key === 'Escape' && open) {
					event.preventDefault();
					if (pane !== 'root') setPane('root');
					else close(true);
					return;
				}
				if (!open) return;
				if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
					if (rangeRef.current !== null && event.target === rangeRef.current) return;
					event.preventDefault();
					moveFocus(event.key === 'ArrowDown' ? 1 : -1);
				}
			};
			const onBlur = (event) => {
				if (event.relatedTarget instanceof Node && rootRef.current?.contains(event.relatedTarget)) return;
				close();
			};
			const settleSelection = (accepted) => {
				if (accepted) {
					if (rootRef.current !== null) close(true);
					return;
				}
				const message = directory.getSnapshot().error;
				if (message !== null) setSelectError(message);
			};
			const choose = (selection) => {
				if (state.current?.provider === selection.provider && state.current.model === selection.model) {
					close(true);
					return;
				}
				lastActionRef.current = 'select';
				select(selection).then(settleSelection);
			};
			const triggerSnap = () => {
				const el = thumbRef.current;
				if (el === null) return;
				el.classList.remove('ths-snapped');
				void el.offsetWidth;
				el.classList.add('ths-snapped');
			};
			const commitAt = (index) => {
				const choice = effortChoices[index];
				if (choice === undefined) return;
				if (state.current === null) return;
				if (choice.effort === effectiveEffort) return;
				const seq = ++commitSeqRef.current;
				setPending(index);
				lastActionRef.current = 'select';
				select({
					provider: state.current.provider,
					model: state.current.model,
					...(choice.effort === undefined ? {} : { reasoningEffort: choice.effort })
				}).then((accepted) => {
					if (commitSeqRef.current !== seq) return;
					if (accepted) {
						setSelectError(null);
					} else {
						setPending(null);
						setDraft(null);
						draftRef.current = null;
						const message = directory.getSnapshot().error;
						if (message !== null) setSelectError(message);
					}
				});
			};
			const commitPct = () => {
				const pct = draftRef.current;
				if (pct === null) return;
				const { index, center } = snapToStep(pct);
				setDraft(center);
				setDragging(false);
				commitAt(index);
				triggerSnap();
			};
			const jumpTo = (index) => {
				setSelectError(null);
				const center = stepCenters[index];
				setDraft(center);
				draftRef.current = center;
				commitAt(index);
				triggerSnap();
			};
			const tickStyle = (index) => {
				if (count <= 1) return { left: '0%', transform: 'none' };
				if (index === 0) return { left: '0%', transform: 'none' };
				if (index === count - 1) return { left: '100%', transform: 'translateX(-100%)' };
				return { left: (index / (count - 1)) * 100 + '%', transform: 'translateX(-50%)' };
			};

			itemRefs.current = [];
			let itemIndex = 0;
			const itemRef = () => {
				const at = itemIndex++;
				return (node) => { itemRefs.current[at] = node; };
			};

			const reload = () => {
				lastActionRef.current = 'load';
				load();
			};
			const paneError = selectError !== null ? selectError : (state.error !== null && lastActionRef.current === 'load' ? state.error : null);

			const trackWidth = sliderRef.current?.offsetWidth ?? 240;
			const snappedPct = draft !== null ? draft : stepCenters[activeIndex] ?? 0;
			const thumbCenterPx = (snappedPct / 100) * trackWidth;
			const offset = thumbCenterPx - thumbWidth / 2;
			const fillWidthPx = snappedPct;

			return React.createElement('div', {
				ref: rootRef,
				className: 'ths-root',
				onKeyDown: onRootKeyDown,
				onBlur
			}, [
				React.createElement('button', {
					key: 'trigger',
					ref: triggerRef,
					type: 'button',
					className: 'ths-trigger',
					'aria-label': triggerAria,
					'aria-haspopup': 'menu',
					'aria-expanded': open,
					'aria-controls': open ? id + '-menu' : undefined,
					title: triggerLabel,
					disabled: locked,
					onClick: () => { if (open) close(); else show(); }
				}, [
					React.createElement('span', { key: 'label', className: 'ths-triggerLabel' }, modelLabel),
					shownEffortLabel !== undefined && React.createElement('span', { key: 'effort', className: 'ths-triggerEffort' }, shownEffortLabel),
					React.createElement('span', { key: 'chevron', className: 'ths-chevron' + (open ? ' ths-chevronOpen' : '') }, React.createElement(IconChevronDown, {}))
				]),
				open && React.createElement('div', {
					key: 'menu',
					id: id + '-menu',
					className: 'ths-menu',
					role: 'menu',
					'aria-label': t('menu.aria'),
					'aria-busy': state.status === 'loading' || busy
				}, [
					pane === 'root' && React.createElement(React.Fragment, { key: 'root' }, [
						React.createElement('button', {
							key: 'model',
							ref: itemRef(),
							type: 'button',
							role: 'menuitem',
							className: 'ths-cell',
							onClick: () => setPane('model')
						}, [
							React.createElement('span', { key: 'l', className: 'ths-cellLabel' }, t('menu.model')),
							React.createElement('span', { key: 'v', className: 'ths-cellValue' }, modelLabel),
							React.createElement('span', { key: 'c', className: 'ths-cellChevron' }, React.createElement(IconChevronRight, {}))
						]),
						reasoning !== undefined && React.createElement('button', {
							key: 'effort',
							ref: itemRef(),
							type: 'button',
							role: 'menuitem',
							className: 'ths-cell',
							onClick: () => { setSelectError(null); setPane('effort'); }
						}, [
							React.createElement('span', { key: 'l', className: 'ths-cellLabel' }, t('menu.effort')),
							React.createElement('span', { key: 'v', className: 'ths-cellValue' }, shownEffortLabel),
							React.createElement('span', { key: 'c', className: 'ths-cellChevron' }, React.createElement(IconChevronRight, {}))
						])
					]),
					pane === 'model' && React.createElement(React.Fragment, { key: 'model' }, [
						state.status === 'loading' && React.createElement('div', { key: 'loading', className: 'ths-status' }, t('status.loading')),
						paneError !== null && React.createElement('div', { key: 'error', className: 'ths-error' }, [
							React.createElement('span', { key: 'm' }, t('error.action', { message: paneError })),
							lastActionRef.current === 'load' && React.createElement('button', { key: 'r', type: 'button', className: 'ths-retry', onClick: reload }, t('action.reload'))
						]),
						state.failures.map((failure) => React.createElement('div', { key: 'f:' + failure.id, className: 'ths-error ths-warning' }, [
							React.createElement('span', { key: 'm' }, t('warning.groupLoad', { name: failure.name, message: failure.message })),
							React.createElement('button', { key: 'r', type: 'button', className: 'ths-retry', onClick: reload }, t('action.reload'))
						])),
						React.createElement('div', { key: 'groups', className: 'ths-groups scrollable' }, state.groups.map((group) => {
							const headingId = id + '-' + group.id;
							return React.createElement('section', { key: group.id, role: 'group', 'aria-labelledby': headingId, className: 'ths-group' }, [
								React.createElement('div', { key: 'h', className: 'ths-groupTitle', id: headingId }, group.name),
								group.models.map((model) => {
									const selected = state.current?.provider === group.id && state.current.model === model.id;
									return React.createElement('button', {
										key: model.id,
										ref: itemRef(),
										type: 'button',
										role: 'menuitemradio',
										'aria-checked': selected,
										className: 'ths-option' + (selected ? ' ths-selected' : ''),
										title: model.name,
										disabled: busy,
										onClick: () => choose({ provider: group.id, model: model.id })
									}, [
										React.createElement('span', { key: 'copy', className: 'ths-optionCopy' }, [
											React.createElement('span', { key: 'n', className: 'ths-modelName' }, model.name),
											model.description !== undefined && React.createElement('span', { key: 'd', className: 'ths-description' }, model.description)
										]),
										React.createElement('span', { key: 'check', className: 'ths-check' }, selected ? React.createElement(IconCheck, {}) : null)
									]);
								})
							]);
						})),
						state.status === 'ready' && choices.length === 0 && React.createElement('div', { key: 'empty', className: 'ths-empty' }, t('empty.models'))
					]),
					pane === 'effort' && React.createElement('div', { key: 'effort', className: 'ths-sliderPane' }, [
						React.createElement('div', { key: 'header', className: 'ths-sliderHeader' }, [
							React.createElement('button', {
								key: 'back',
								ref: itemRef(),
								type: 'button',
								className: 'ths-back',
								'aria-label': t('back.label'),
								onClick: () => { setSelectError(null); setPane('root'); }
							}, React.createElement(IconChevronDown, {})),
							React.createElement('span', { key: 'title' }, t('menu.effort')),
							React.createElement('span', { key: 'value', className: 'ths-sliderValue' }, currentEffort?.label ?? '')
						]),
						React.createElement('div', { key: 'meaning', className: 'ths-meaning' }, t('desc.meaning')),
						paneError !== null && React.createElement('div', { key: 'error', className: 'ths-error' }, [
							React.createElement('span', { key: 'm' }, t('error.action', { message: paneError })),
							React.createElement('button', { key: 'r', type: 'button', className: 'ths-retry', onClick: () => setSelectError(null) }, t('action.reload'))
						]),
						count === 0 ? React.createElement('div', { key: 'empty', className: 'ths-empty' }, t('empty.efforts')) : [
							React.createElement('div', { key: 'slider', ref: sliderRef, className: 'ths-customSlider' }, [
								React.createElement('div', { key: 'fill', className: 'ths-fill', style: { width: fillWidthPx + '%' } }),
								React.createElement('div', { key: 'dots', className: 'ths-dots' }, effortChoices.map((choice, index) => {
									if (index === 0 || index === count - 1) return null;
									return React.createElement('span', { key: choice.key, className: 'ths-dot' + (index <= activeIndex ? ' ths-dotActive' : ''), style: { left: stepCenters[index] + '%' } });
								})),
								React.createElement('input', {
									key: 'range',
									ref: rangeRef,
									type: 'range',
									className: 'ths-range',
									min: 0,
									max: 100,
									step: 1,
									defaultValue: shownPct,
									disabled: locked,
									'aria-label': t('slider.aria', { effort: currentEffort?.label ?? '' }),
									'aria-valuetext': currentEffort?.label ?? '',
									onPointerDown: () => { setDragging(true); draftRef.current = Number(rangeRef.current?.value ?? shownPct); },
									onChange: (e) => {
										const v = Number(e.target.value);
										setSelectError(null);
										setDraft(v);
										draftRef.current = v;
									},
									onPointerUp: commitPct,
									onPointerCancel: commitPct,
									onKeyUp: commitPct,
									onBlur: commitPct
								}),
								React.createElement('div', { key: 'thumb', ref: thumbRef, className: 'ths-thumb', style: { left: offset + 'px' }, 'aria-hidden': true })
							]),
							React.createElement('div', { key: 'ticks', className: 'ths-ticks', role: 'presentation' }, effortChoices.map((choice, index) => React.createElement('button', {
								key: choice.key,
								ref: itemRef(),
								type: 'button',
								className: 'ths-tick' + (index === activeIndex ? ' ths-tickActive' : ''),
								style: tickStyle(index),
								onClick: () => jumpTo(index)
							}, choice.label))),
							React.createElement('div', { key: 'meta', className: 'ths-sliderMeta' }, [
								currentEffort?.description !== undefined && React.createElement('span', { key: 'd', className: 'ths-sliderDesc' }, currentEffort.description)
							])
						]
					])
				])
			]);
		}
		//#endregion

		//#region apply
		function apply(ctx) {
			const locale = ctx.get('locale');
			if (locale === undefined) return;
			ctx.effect(() => locale.register(NS, { zh, en }));
			const slots = ctx.get('slots');
			if (slots === undefined) return;
			const sessions = ctx.get('sessions');
			if (sessions === undefined) return;
			slots.inject('conversation.input.model', () => {
				const models = ctx.get('modelDirectories');
				if (models === undefined) return () => {};
				return slots.register({
					name: 'conversation.input.model',
					priority: -1,
					locale: NS,
					inject: (sessionId) => {
						const directory = models.directoryFor(sessionId);
						const available = sessions.subagentAddress(sessionId) === undefined;
						return {
							available,
							directory: directory.store,
							load: () => { if (available) directory.load().catch(() => {}); },
							select: (selection) => available ? directory.select(selection).then(() => true, () => false) : Promise.resolve(false)
						};
					}
				}, ModelSeatSlider);
			});
		}
		//#endregion

		exports.apply = apply;
		return module.exports;
	}
});
