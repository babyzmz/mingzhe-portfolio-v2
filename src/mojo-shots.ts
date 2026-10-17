/**
 * Runtime screenshot manifest for the Mojo products (MojoClaw, Mojo Core, MojoAX).
 *
 * One list drives three things:
 *  - captured shots become approved ProjectMedia entries (case-reader gallery,
 *    card cover, lightbox) via mojoCapturedMedia();
 *  - pending shots render as labelled placeholders that name the target file,
 *    so the site never requests a missing image;
 *  - docs/handoff/MOJO_SCREENSHOT_SHOTLIST.md mirrors this list for capture work.
 *
 * To add a capture: put the reviewed JPG at public/<file>, set status to
 * 'captured', fill capturedAt/versionLabel, then run `npm run build:mojo`.
 * Tests fail if a captured file is missing or a pending file is referenced
 * as an <img>.
 */
import type {Localized, ProjectId, ProjectMedia} from './project-types.js';

export type MojoProductId = 'claw' | 'core' | 'ax';
export type ShotStatus = 'captured' | 'needs-redaction' | 'pending' | 'planned-product';

export type MojoShot = {
 id: string;
 product: MojoProductId;
 /** Site-relative path under public/, e.g. media/claw/chat-markdown-table.jpg */
 file: string;
 width: number;
 height: number;
 priority: 'P0' | 'P1' | 'P2';
 status: ShotStatus;
 /** Which screen to capture. English is the primary site language. */
 surface: string;
 /** The state the screen must be in when captured. */
 state: string;
 caption: Localized;
 alt: Localized;
 /** What was cropped or masked before publication, or what still needs to be. */
 privacy: string;
 capturedAt: string | null;
 versionLabel: string | null;
 claimIds: string[];
};

const CAPTURED = '2026-10-18';
const BUILD = 'MojoClaw desktop dev build (private), Core-backed';

export const mojoShots: MojoShot[] = [
 // ── MojoClaw ───────────────────────────────────────────────────────────────
 {
  id: 'claw-runtime-preview-dashboard', product: 'claw', file: 'media/claw/runtime-preview-dashboard.jpg',
  width: 1298, height: 818, priority: 'P0', status: 'captured',
  surface: 'Project chat with the runtime preview pane open on the right.',
  state: 'A generated "digital twin city dashboard" project running in the secure preview: 3D scene, live curve and metric tiles; checkpoint card visible in the chat.',
  caption: {
   en: 'A generated web project running in the isolated runtime preview: the chat keeps the checkpoint card, the right pane runs the result with start-up timings.',
   zh: '生成的网页项目在隔离的运行时预览中运行：左侧对话保留检查点卡片，右侧运行结果并显示启动耗时。'
  },
  alt: {en: 'MojoClaw chat beside a running 3D city dashboard preview', zh: 'MojoClaw 对话旁运行中的三维城市大屏预览'},
  privacy: 'Left navigation (conversation titles, account) cropped out. Dashboard data is labelled SAMPLE in the page itself.',
  capturedAt: CAPTURED, versionLabel: BUILD, claimIds: ['runtime-preview', 'project-checkpoints']
 },
 {
  id: 'claw-runtime-preview-3d-page', product: 'claw', file: 'media/claw/runtime-preview-3d-page.jpg',
  width: 776, height: 782, priority: 'P0', status: 'captured',
  surface: 'Right-hand preview pane (Preview / Mojo Surface / Browser / Files tabs).',
  state: 'A single-file 3D web page generated from one prompt, running in the preview with its own controls.',
  caption: {
   en: 'A one-prompt 3D web page running in the preview pane. Only the preview is shown; geometry, terrain and colour are generated in code with no external assets.',
   zh: '一句话生成的 3D 网页在预览面板中运行。图中只保留预览区；几何体、地形与配色均由代码生成，没有外部素材。'
  },
  alt: {en: 'Preview pane running a generated 3D page of a pelican riding a bicycle', zh: '预览面板运行生成的鹈鹕骑车 3D 网页'},
  privacy: 'Cropped to the preview pane only; the chat column (including an older validation notice) is excluded.',
  capturedAt: CAPTURED, versionLabel: BUILD, claimIds: ['runtime-preview', 'web-generation']
 },
 {
  id: 'claw-plugins-four-sections', product: 'claw', file: 'media/claw/plugins-four-sections.jpg',
  width: 1236, height: 818, priority: 'P0', status: 'captured',
  surface: 'Plugins & Capabilities page, top of the page.',
  state: 'Section chips for Rule files, Skills, MCP servers, Prompts and resources, plus the single "New or import" entry; rule files and built-in skills listed.',
  caption: {
   en: 'Plugins & Capabilities in four sections — rule files, skills, MCP servers, prompts — with one "New or import" entry. Every state on the page is read from Mojo Core.',
   zh: '插件与能力页分为规则文件、技能、MCP 服务器、提示词四个分区，只有一个“新建或导入”入口；页面上的状态都来自 Mojo Core。'
  },
  alt: {en: 'MojoClaw Plugins & Capabilities page with four section chips', zh: 'MojoClaw 插件与能力页的四个分区'},
  privacy: 'Left navigation (recent conversations, account email) cropped out.',
  capturedAt: CAPTURED, versionLabel: BUILD, claimIds: ['rules-skills-mcp']
 },
 {
  id: 'claw-chat-markdown-table', product: 'claw', file: 'media/claw/chat-markdown-table.jpg',
  width: 1080, height: 848, priority: 'P1', status: 'captured',
  surface: 'Chat reply area.',
  state: 'A finished reply containing a Markdown table (a short-video shot script) and the follow-up action "Generate as document".',
  caption: {
   en: 'A reply rendered as a readable table, with a follow-up action to turn it into a document instead of forcing a file.',
   zh: '回复以表格呈现，并提供“生成为文档”的后续操作，而不是强制生成文件。'
  },
  alt: {en: 'Chat reply with a shot-script table and a Generate as document button', zh: '带镜头脚本表格和“生成为文档”按钮的对话回复'},
  privacy: 'Left navigation (project and folder names, account) cropped out.',
  capturedAt: CAPTURED, versionLabel: BUILD, claimIds: ['readable-replies']
 },
 {
  id: 'claw-inline-timeline', product: 'claw', file: 'media/claw/inline-timeline.jpg',
  width: 1192, height: 840, priority: 'P1', status: 'captured',
  surface: 'Chat reply with an intelligent-UI component.',
  state: 'A two-lane timeline component (product and marketing) rendered inside the reply for a fictional launch plan.',
  caption: {
   en: 'An intelligent-UI timeline rendered inside the reply: two lanes, dated milestones, for a fictional launch schedule.',
   zh: '回复内嵌的智能 UI 时间线组件：双泳道、带日期的节点，内容为虚构的发布排期。'
  },
  alt: {en: 'Two-lane timeline component inside a MojoClaw reply', zh: 'MojoClaw 回复中的双泳道时间线组件'},
  privacy: 'Left navigation (projects, recent conversations, account email) cropped out. Plan content is fictional.',
  capturedAt: CAPTURED, versionLabel: BUILD, claimIds: ['intelligent-ui']
 },
 {
  id: 'claw-settings-local-tasks', product: 'claw', file: 'media/claw/settings-local-tasks.jpg',
  width: 912, height: 858, priority: 'P0', status: 'captured',
  surface: 'Settings → Local tasks.',
  state: 'Bound folders with permission presets (Analysis only / Work inside the project / Strong isolation / Extend once) and the per-capability "Remote control of this computer" switches.',
  caption: {
   en: 'Bound folders with permission presets, and the fine-grained switches that decide what the web app may do with this computer.',
   zh: '绑定文件夹与权限预设，以及决定网页端能对这台电脑做什么的细粒度开关。'
  },
  alt: {en: 'MojoClaw settings: bound folders and remote control switches', zh: 'MojoClaw 设置：绑定文件夹与远程控制开关'},
  privacy: 'Cropped to the settings content panel; the settings navigation with the account email is excluded.',
  capturedAt: CAPTURED, versionLabel: BUILD, claimIds: ['bound-folders', 'remote-control']
 },
 {
  id: 'claw-changes-panel', product: 'claw', file: 'media/claw/changes-panel.jpg',
  width: 1600, height: 1000, priority: 'P1', status: 'pending',
  surface: 'Bound-folder project → Conversation info → Changes → "View changes".',
  state: 'After a run edited files in a bound folder: +added ~modified −deleted counts, a diff open, and the Undo action visible.',
  caption: {
   en: 'Changes made in a bound folder, with the diff and an undo for each change.',
   zh: '绑定文件夹中的改动，附带差异与逐项撤销。'
  },
  alt: {en: 'MojoClaw changes panel for a bound folder', zh: 'MojoClaw 绑定文件夹的更改面板'},
  privacy: 'Use a throwaway folder; crop the left navigation and any home-directory path.',
  capturedAt: null, versionLabel: null, claimIds: ['bound-folders']
 },
 {
  id: 'claw-mcp-trust-card', product: 'claw', file: 'media/claw/mcp-trust-card.jpg',
  width: 1600, height: 1000, priority: 'P1', status: 'pending',
  surface: 'Chat, first use of an MCP server inside a project.',
  state: 'The one-time trust card listing server identity, account, tool groups, data scope and allowed side effects.',
  caption: {
   en: 'The one-time MCP trust card: what the server is, which tools, which data and which side effects you are approving.',
   zh: '一次性的 MCP 信任卡：服务器身份、工具、数据范围与允许的副作用。'
  },
  alt: {en: 'MCP trust card in a MojoClaw chat', zh: 'MojoClaw 对话中的 MCP 信任卡'},
  privacy: 'Use a local test server; no tokens or account names on screen.',
  capturedAt: null, versionLabel: null, claimIds: ['rules-skills-mcp']
 },
 {
  id: 'claw-legacy-typography', product: 'claw', file: 'media/claw/settings-legacy-typography.jpg',
  width: 1600, height: 1000, priority: 'P2', status: 'pending',
  surface: 'Settings → Preferences → "Legacy typography".',
  state: 'The switch shown off (unified type scale on), with a chat visible behind for comparison.',
  caption: {
   en: 'A per-device switch back to the previous typography while the unified type scale settles in.',
   zh: '按设备切回旧版排版的开关，统一字阶为默认。'
  },
  alt: {en: 'MojoClaw preferences with the legacy typography switch', zh: 'MojoClaw 偏好设置中的旧版排版开关'},
  privacy: 'Crop to the settings content panel.',
  capturedAt: null, versionLabel: null, claimIds: ['readable-replies']
 },

 // ── Mojo Core (seen through MojoClaw, which renders Core-owned state) ─────
 {
  id: 'core-session-info', product: 'core', file: 'media/claw/session-info-popover.jpg',
  width: 1080, height: 848, priority: 'P0', status: 'captured',
  surface: 'Chat header → ⓘ Conversation info popover.',
  state: 'Environment (cloud device, project, remote control off), context usage 16% with its breakdown, connectors & plugins, and outputs.',
  caption: {
   en: 'Conversation info reads Core facts: where the run executes, how much of the context budget is used and by what, which connectors are live, what was produced.',
   zh: '会话信息读取 Core 的事实：在哪执行、上下文预算用了多少及构成、连接器状态和产出内容。'
  },
  alt: {en: 'Conversation info popover with environment, context and outputs', zh: '会话信息浮窗：环境、上下文与输出内容'},
  privacy: 'Left navigation (project list, account) cropped out.',
  capturedAt: CAPTURED, versionLabel: BUILD, claimIds: ['context-accounting', 'core-owned-state']
 },
 {
  id: 'core-plugins-mcp-builtin', product: 'core', file: 'media/claw/plugins-mcp-builtin-server.jpg',
  width: 1236, height: 400, priority: 'P0', status: 'captured',
  surface: 'Plugins & Capabilities → MCP servers.',
  state: 'Cloud and this-device groups (both empty), and the header of the Core-provided built-in browser server card (cropped above its tool list).',
  caption: {
   en: 'MCP servers are grouped by cloud and device, and the built-in browser server is provided by Mojo Core — the page only displays what Core reports.',
   zh: 'MCP 服务器按云端与设备分组，内置浏览器服务器由 Mojo Core 提供——页面只显示 Core 报告的状态。'
  },
  alt: {en: 'MCP servers section showing the Core built-in browser server', zh: 'MCP 服务器分区中 Core 提供的内置浏览器服务器'},
  privacy: 'Left navigation (recent conversations, account email) cropped out; cropped above the tool list.',
  capturedAt: CAPTURED, versionLabel: BUILD, claimIds: ['mcp-boundaries', 'core-owned-state']
 },
 {
  id: 'core-project-checkpoint', product: 'core', file: 'media/claw/project-checkpoint-card.jpg',
  width: 1080, height: 848, priority: 'P1', status: 'captured',
  surface: 'Project chat, finished run.',
  state: 'Reply that names the changed file, then the project card: v14 · Checkpoint #13 · Saved · Preview available · 11 files.',
  caption: {
   en: 'A finished run commits a project checkpoint in Core — version, saved state, file list and preview availability come from Core, not from the reply text.',
   zh: '运行结束后在 Core 中提交项目检查点：版本、保存状态、文件列表与预览可用性来自 Core，而不是回复文字。'
  },
  alt: {en: 'Project checkpoint card v14 with 11 files and preview available', zh: '项目检查点卡片 v14，11 个文件，预览可用'},
  privacy: 'Left navigation (project and folder names, account) cropped out.',
  capturedAt: CAPTURED, versionLabel: BUILD, claimIds: ['durable-runs', 'core-owned-state']
 },
 {
  id: 'core-user-activity', product: 'core', file: 'media/claw/settings-user-activity.jpg',
  width: 912, height: 858, priority: 'P1', status: 'captured',
  surface: 'Settings → User details.',
  state: 'Core-owned profile, the 365-day activity heatmap from Core history, longest chat and streak counters.',
  caption: {
   en: 'Profile and a 365-day activity view computed from Core history, rendered by MojoClaw.',
   zh: '由 Core 历史计算的档案与 365 天活动视图，由 MojoClaw 渲染。'
  },
  alt: {en: 'User details with an annual activity heatmap', zh: '用户详情与年度活动热力图'},
  privacy: 'Cropped to the settings content panel; avatar, initials and email masked with a flat block.',
  capturedAt: CAPTURED, versionLabel: BUILD, claimIds: ['core-owned-state']
 },
 {
  id: 'core-privacy-memory', product: 'core', file: 'media/claw/settings-privacy-memory.jpg',
  width: 912, height: 858, priority: 'P1', status: 'captured',
  surface: 'Settings → Privacy → Memory.',
  state: 'Use-memory and suggest-memory switches, semantic recall usage, and memory entries with their source run and "Source chat" link.',
  caption: {
   en: 'Memory is stored by Core and stays reviewable: each entry shows its kind, scope and the run it came from; suggestions need confirmation.',
   zh: '记忆由 Core 保存且可审阅：每条显示类型、范围和来源运行；模型建议的记忆需确认。'
  },
  alt: {en: 'Privacy settings with memory switches and traceable entries', zh: '隐私设置：记忆开关与可追溯的记忆条目'},
  privacy: 'Cropped to the settings content panel; the settings navigation with the account email is excluded.',
  capturedAt: CAPTURED, versionLabel: BUILD, claimIds: ['memory', 'core-owned-state']
 },
 {
  id: 'core-launcher-status', product: 'core', file: 'media/core/launcher-status.jpg',
  width: 1600, height: 1000, priority: 'P2', status: 'pending',
  surface: 'Terminal: the local launcher status command.',
  state: 'Gateway, workers, preview and Claw services healthy, pinned versions and migration level listed.',
  caption: {
   en: 'The launcher reports each Core service, its pinned version and the migration level.',
   zh: '启动器列出每个 Core 服务、固定版本与迁移级别。'
  },
  alt: {en: 'Terminal output of the Mojo launcher status command', zh: 'Mojo 启动器 status 命令的终端输出'},
  privacy: 'Redact ports, home paths, hostnames and any environment values; keep only service names and states.',
  capturedAt: null, versionLabel: null, claimIds: ['operations']
 },

 // ── MojoAX (in development after MojoClaw and Core; no runtime capture yet) ──
 {
  id: 'ax-surface-on-demand', product: 'ax', file: 'media/ax/surface-on-demand.jpg',
  width: 1600, height: 1000, priority: 'P2', status: 'planned-product',
  surface: 'MojoAX web workbench, a task with one summoned surface.',
  state: 'Only when AX work resumes and the workflow runs against Core end to end.',
  caption: {
   en: 'Planned: the enterprise workbench summoning one surface for the task in progress.',
   zh: '规划中：企业工作台按当前任务召唤一个工作面板。'
  },
  alt: {en: 'Placeholder for the MojoAX workbench', zh: 'MojoAX 工作台占位'},
  privacy: 'Demo tenant only; no customer or colleague data.',
  capturedAt: null, versionLabel: null, claimIds: ['surface-on-demand']
 },
 {
  id: 'ax-governance', product: 'ax', file: 'media/ax/governance.jpg',
  width: 1600, height: 1000, priority: 'P2', status: 'planned-product',
  surface: 'MojoAX tenant switcher and approval view.',
  state: 'Only when SSO and tenant flows are re-verified against Core.',
  caption: {
   en: 'Planned: tenant switching and approvals for team work.',
   zh: '规划中：团队工作的租户切换与审批。'
  },
  alt: {en: 'Placeholder for MojoAX governance', zh: 'MojoAX 治理视图占位'},
  privacy: 'Demo tenant only; no real identity provider data.',
  capturedAt: null, versionLabel: null, claimIds: ['governance']
 }
];

export const SHOT_STATUS_LABELS: Record<ShotStatus, Localized> = {
 captured: {en: 'Captured from the running app', zh: '实际运行截图'},
 'needs-redaction': {en: 'Capture supplied · awaiting redaction', zh: '已有截图 · 待打码'},
 pending: {en: 'Screenshot to come', zh: '截图待补'},
 'planned-product': {en: 'Planned · capture after a runnable build', zh: '规划中 · 有可运行版本后截图'}
};

export function shotsFor(product: MojoProductId): MojoShot[] {
 return mojoShots.filter(shot => shot.product === product);
}
export function capturedShots(product?: MojoProductId): MojoShot[] {
 return mojoShots.filter(shot => shot.status === 'captured' && (!product || shot.product === product));
}
export function placeholderShots(product: MojoProductId): MojoShot[] {
 return shotsFor(product).filter(shot => shot.status !== 'captured');
}

/** Captured shots enter the shared public media registry. */
export function mojoCapturedMedia(): ProjectMedia[] {
 return capturedShots().map(shot => ({
  id: shot.id,
  projectId: shot.product as ProjectId,
  type: 'screenshot',
  src: './' + shot.file,
  width: shot.width,
  height: shot.height,
  alt: shot.alt,
  caption: shot.caption,
  evidenceKind: 'runtime-recorded',
  provenance: {
   en: 'MojoClaw desktop app (private dev build), left navigation cropped',
   zh: 'MojoClaw 桌面端（私有开发版）实拍，已裁去左侧导航'
  },
  capturedAt: shot.capturedAt,
  versionLabel: shot.versionLabel,
  claimIds: shot.claimIds,
  publication: 'approved'
 }));
}

export function validateMojoShots(): string[] {
 const issues: string[] = [];
 const ids = new Set<string>();
 for (const shot of mojoShots) {
  if (ids.has(shot.id)) issues.push(`${shot.id}: duplicate id`);
  ids.add(shot.id);
  if (!/^media\/(claw|core|ax)\/[a-z0-9-]+\.jpg$/.test(shot.file)) issues.push(`${shot.id}: file must be media/<product>/<kebab>.jpg`);
  if (!(shot.width > 0 && shot.height > 0)) issues.push(`${shot.id}: bad size`);
  if (!shot.caption.en || !shot.caption.zh || !shot.alt.en || !shot.alt.zh) issues.push(`${shot.id}: missing caption/alt`);
  if (shot.status === 'captured' && (!shot.capturedAt || !shot.versionLabel)) issues.push(`${shot.id}: captured without date/version`);
  if (shot.status !== 'captured' && shot.capturedAt) issues.push(`${shot.id}: pending shot carries a capture date`);
 }
 return issues;
}
