/**
 * Registry of approved public project media and its selection/validation rules.
 *
 * The registry starts EMPTY on purpose: no fabricated product screenshots.
 * Entries are added only after a real capture exists, is reviewed/sanitised
 * and explicitly approved, then the file is placed in public/media/<id>/.
 */
import {
 PROJECT_IDS,
 type ProjectId,
 type ProjectMedia,
 type EvidenceKind,
 type Localized
} from './project-types.js';
import {safeUrlIssues} from './project-links.js';

export const EVIDENCE_KIND_LABELS: Record<EvidenceKind, Localized> = {
 'source-reviewed': {en: 'Source reviewed', zh: '源码已核对'},
 'runtime-recorded': {en: 'Recorded from the running program', zh: '实际运行录制 / 截图'},
 'owner-supplied': {en: 'Owner-supplied capture', zh: '用户提供截图'},
 illustrative: {en: 'Illustration', zh: '示意图'}
};

/**
 * Public media manifest. Append-only after review; never invent entries.
 * src stays site-relative (./media/<id>/...) and publication gates rendering.
 *
 * Entries below were captured from the real programs on 2026-09-19 (native
 * window capture, real Chrome over HTTP, or the released desktop binary),
 * reviewed for private content, and approved for portfolio publication by
 * the owner. Anything containing conversation text, personal notes or
 * customer data stays out of this list (withheld in the private review
 * queue). The single-file edition suppresses the whole gallery because its
 * media is not inlined.
 */
const D = '2026-09-19';
export const projectMedia: ProjectMedia[] = [
 // ── Fairy: native Tauri/React desktop (rail blurred in the video) ──────────
 {
  id: 'fairy-permissions', projectId: 'fairy', type: 'screenshot',
  src: './media/fairy/permissions.jpg', width: 1600, height: 1000,
  alt: {en: 'Fairy execution permissions settings', zh: 'Fairy 执行权限设置页'},
  caption: {
   en: 'Local and cloud execution policy: explicit capability toggles for image, audio and video generation and for every scoped browser action, with sandbox status shown.',
   zh: '本地与云端执行策略：图片、音频、视频生成及每一项受控浏览器操作都有独立能力开关，并显示沙箱状态。'
  },
  evidenceKind: 'runtime-recorded',
  provenance: {en: 'Native Fairy desktop window, captured via CDP', zh: 'Fairy 原生桌面窗口，经 CDP 实拍'},
  capturedAt: D, versionLabel: 'fairy-v3 desktop @ codex/fairy-stability-recovery bb30915',
  claimIds: ['capability-gates', 'sandboxed-execution'], publication: 'approved'
 },
 {
  id: 'fairy-skills-mcp', projectId: 'fairy', type: 'screenshot',
  src: './media/fairy/skills-mcp.jpg', width: 1600, height: 1000,
  alt: {en: 'Fairy Skills and MCP server settings', zh: 'Fairy Skills 与 MCP 服务器设置'},
  caption: {
   en: 'Installed skills and MCP servers are listed with their enabled tools, so extensions are inspectable rather than hidden.',
   zh: '已安装的 Skills 与 MCP 服务器及其启用的工具全部可见，扩展能力可检查、不隐藏。'
  },
  evidenceKind: 'runtime-recorded',
  provenance: {en: 'Native Fairy desktop window, captured via CDP', zh: 'Fairy 原生桌面窗口，经 CDP 实拍'},
  capturedAt: D, versionLabel: 'fairy-v3 desktop @ codex/fairy-stability-recovery bb30915',
  claimIds: ['skills-mcp'], publication: 'approved'
 },
 {
  id: 'fairy-models', projectId: 'fairy', type: 'screenshot',
  src: './media/fairy/models.jpg', width: 1600, height: 1000,
  alt: {en: 'Fairy model provider catalog', zh: 'Fairy 模型供应商目录'},
  caption: {
   en: 'Provider catalog with eight approved models across text, image, music and video; the credential is protected by Windows and no API key is displayed.',
   zh: '供应商目录列出文本、图片、音乐、视频共八个已批准模型；凭据由 Windows 保护，界面不显示任何 API 密钥。'
  },
  evidenceKind: 'runtime-recorded',
  provenance: {en: 'Native Fairy desktop window, captured via CDP', zh: 'Fairy 原生桌面窗口，经 CDP 实拍'},
  capturedAt: D, versionLabel: 'fairy-v3 desktop @ codex/fairy-stability-recovery bb30915',
  claimIds: ['multi-provider-routing', 'credential-safety'], publication: 'approved'
 },
 {
  id: 'fairy-privacy', projectId: 'fairy', type: 'screenshot',
  src: './media/fairy/privacy.jpg', width: 1600, height: 1000,
  alt: {en: 'Fairy knowledge and privacy settings', zh: 'Fairy 知识与隐私设置'},
  caption: {
   en: 'Knowledge and privacy controls state that indexed vault paths stay on this device, with local-only and autonomous mode indicators in the status bar.',
   zh: '知识与隐私控制明确说明被索引的资料库路径仅保留在本机；状态栏同时显示本地优先与自主模式指示。'
  },
  evidenceKind: 'runtime-recorded',
  provenance: {en: 'Native Fairy desktop window, captured via CDP', zh: 'Fairy 原生桌面窗口，经 CDP 实拍'},
  capturedAt: D, versionLabel: 'fairy-v3 desktop @ codex/fairy-stability-recovery bb30915',
  claimIds: ['local-knowledge', 'privacy-defaults'], publication: 'approved'
 },
 {
  id: 'fairy-browser-state', projectId: 'fairy', type: 'screenshot',
  src: './media/fairy/browser-state.jpg', width: 1280, height: 1426,
  alt: {en: 'Fairy preview browser showing an honest stopped-worker state', zh: 'Fairy 预览浏览器如实显示工作进程已停止'},
  caption: {
   en: 'When the scoped browser worker is interrupted, the UI reports the state honestly — "Browser unavailable, worker interrupted", with the Node.js version — instead of faking a page.',
   zh: '当受控浏览器工作进程被中断时，界面如实显示“Browser unavailable, worker interrupted”及 Node.js 版本，而不是伪造页面。'
  },
  evidenceKind: 'runtime-recorded',
  provenance: {en: 'Native Fairy desktop window, right pane cropped to exclude any conversation text', zh: 'Fairy 原生桌面窗口，仅保留右侧面板以排除任何对话文字'},
  capturedAt: D, versionLabel: 'fairy-v3 desktop @ codex/fairy-stability-recovery bb30915',
  claimIds: ['honest-failure-states', 'scoped-browser'], publication: 'approved'
 },
 {
  id: 'fairy-walkthrough', projectId: 'fairy', type: 'video',
  src: './media/fairy/walkthrough.mp4', poster: './media/fairy/walkthrough-poster.jpg',
  width: 1280, height: 826,
  alt: {en: 'Forty-two second screen recording of the Fairy desktop interface', zh: 'Fairy 桌面界面 42 秒操作录屏'},
  caption: {
   en: '42-second walkthrough of the native app: files, execution permissions, Skills/MCP, model catalog, privacy settings and the preview browser. The conversation list is blurred for privacy; no audio track.',
   zh: '原生应用 42 秒巡览：文件、执行权限、Skills/MCP、模型目录、隐私设置与预览浏览器。会话列表已做模糊处理；视频无音频。'
  },
  evidenceKind: 'runtime-recorded',
  provenance: {en: 'Recorded from the native window (PrintWindow frames driven via CDP); rail blurred', zh: '原生窗口录制（PrintWindow 抓帧、CDP 驱动）；会话栏已模糊'},
  capturedAt: D, versionLabel: 'fairy-v3 desktop @ codex/fairy-stability-recovery bb30915',
  claimIds: ['capability-gates', 'skills-mcp', 'privacy-defaults', 'honest-failure-states'], publication: 'approved'
 },

 // ── Dreambound Realm: Canvas/WebGL2 original ───────────────────────────────
 {
  id: 'dreambound-gameplay', projectId: 'dreambound', type: 'screenshot',
  src: './media/dreambound/gameplay.jpg', width: 1440, height: 900,
  alt: {en: 'Dreambound Realm gameplay in the Memory Tide hall', zh: '《绮梦之域》记忆潮汐大厅实机画面'},
  caption: {
   en: 'Real WebGL2 gameplay in the Memory Tide hall: HUD with room, build and HP, the knight character, an enemy and the inversion skill control.',
   zh: '记忆潮汐大厅的 WebGL2 实机画面：HUD 显示房间、构筑与生命值，可见骑士角色、敌人与反转技能按钮。'
  },
  evidenceKind: 'runtime-recorded',
  provenance: {en: 'Original Canvas/WebGL2 build running in real Chrome (ANGLE, D3D11)', zh: 'Canvas/WebGL2 原版在真实 Chrome 中运行（ANGLE / D3D11）'},
  capturedAt: D, versionLabel: 'Canvas/WebGL2 local build (Dreambound Realm)',
  claimIds: ['webgl-gameplay', 'real-combat-loop'], publication: 'approved'
 },
 {
  id: 'dreambound-title', projectId: 'dreambound', type: 'screenshot',
  src: './media/dreambound/title.jpg', width: 1440, height: 900,
  alt: {en: 'Dreambound Realm chapter title screen', zh: '《绮梦之域》章节标题画面'},
  caption: {en: 'Chapter I — Memory Tide title screen with the three playable portraits.', zh: '第一章「记忆潮汐」标题画面与三位可选角色立绘。'},
  evidenceKind: 'runtime-recorded',
  provenance: {en: 'Original Canvas/WebGL2 build running in real Chrome', zh: 'Canvas/WebGL2 原版在真实 Chrome 中运行'},
  capturedAt: D, versionLabel: 'Canvas/WebGL2 local build (Dreambound Realm)',
  claimIds: ['narrative-chapters'], publication: 'approved'
 },
 {
  id: 'dreambound-blessing', projectId: 'dreambound', type: 'screenshot',
  src: './media/dreambound/blessing.jpg', width: 1440, height: 900,
  alt: {en: 'Dreambound blessing choice panel', zh: '《绮梦之域》祝福选择面板'},
  caption: {en: 'The blessing room presents roguelite build choices before the next fight.', zh: '祝福房间在下一场战斗前提供肉鸽式构筑选择。'},
  evidenceKind: 'runtime-recorded',
  provenance: {en: 'Original Canvas/WebGL2 build running in real Chrome', zh: 'Canvas/WebGL2 原版在真实 Chrome 中运行'},
  capturedAt: D, versionLabel: 'Canvas/WebGL2 local build (Dreambound Realm)',
  claimIds: ['roguelite-blessings'], publication: 'approved'
 },
 {
  id: 'dreambound-combat', projectId: 'dreambound', type: 'screenshot',
  src: './media/dreambound/combat.jpg', width: 1440, height: 900,
  alt: {en: 'Dreambound Realm active combat', zh: '《绮梦之域》战斗进行中'},
  caption: {en: 'Active combat with damage numbers, enemy projectiles and the skill cooldown indicator.', zh: '战斗进行中：可见伤害数字、敌方弹幕与技能冷却指示。'},
  evidenceKind: 'runtime-recorded',
  provenance: {en: 'Original Canvas/WebGL2 build running in real Chrome', zh: 'Canvas/WebGL2 原版在真实 Chrome 中运行'},
  capturedAt: D, versionLabel: 'Canvas/WebGL2 local build (Dreambound Realm)',
  claimIds: ['real-combat-loop'], publication: 'approved'
 },
 {
  id: 'dreambound-run-end', projectId: 'dreambound', type: 'screenshot',
  src: './media/dreambound/run-end.jpg', width: 1440, height: 900,
  alt: {en: 'Dreambound Realm run ended screen', zh: '《绮梦之域》本局结束画面'},
  caption: {en: 'The run-end screen states the outcome plainly and offers another run — a complete lose-and-restart loop was exercised end to end.', zh: '结算屏直接给出本局结果并允许再来一局；完整的失败—重开循环已端到端跑通。'},
  evidenceKind: 'runtime-recorded',
  provenance: {en: 'Original Canvas/WebGL2 build running in real Chrome', zh: 'Canvas/WebGL2 原版在真实 Chrome 中运行'},
  capturedAt: D, versionLabel: 'Canvas/WebGL2 local build (Dreambound Realm)',
  claimIds: ['real-combat-loop'], publication: 'approved'
 },

 // ── Mi Format Converter: released PyInstaller desktop binary ───────────────
 {
  id: 'converter-image', projectId: 'converter', type: 'screenshot',
  src: './media/converter/image.jpg', width: 1250, height: 876,
  alt: {en: 'Mi Format Converter image module', zh: 'Mi 格式转换工具图片模块'},
  caption: {en: 'Image conversion module of the released desktop app: drag-and-drop zone, output format and output path controls.', zh: '已发布桌面版的图片转换模块：拖拽区、输出格式与输出路径选择。'},
  evidenceKind: 'runtime-recorded',
  provenance: {en: 'Released Windows executable (built 2024-11-25), native window capture', zh: '已发布的 Windows 可执行文件（2024-11-25 构建），原生窗口截图'},
  capturedAt: D, versionLabel: 'release exe 2024-11-25 (sha B4A3F80D…)',
  claimIds: ['image-conversion'], publication: 'approved'
 },
 {
  id: 'converter-video', projectId: 'converter', type: 'screenshot',
  src: './media/converter/video.jpg', width: 1250, height: 876,
  alt: {en: 'Mi Format Converter video module', zh: 'Mi 格式转换工具视频模块'},
  caption: {en: 'Video conversion module with hardware acceleration toggle, powered by the bundled FFmpeg.', zh: '视频转换模块，含硬件加速开关，底层为随附的 FFmpeg。'},
  evidenceKind: 'runtime-recorded',
  provenance: {en: 'Released Windows executable, native window capture', zh: '已发布的 Windows 可执行文件，原生窗口截图'},
  capturedAt: D, versionLabel: 'release exe 2024-11-25 (sha B4A3F80D…)',
  claimIds: ['video-conversion', 'hardware-acceleration'], publication: 'approved'
 },
 {
  id: 'converter-m4s', projectId: 'converter', type: 'screenshot',
  src: './media/converter/m4s.jpg', width: 1250, height: 876,
  alt: {en: 'Mi Format Converter m4s merge module', zh: 'Mi 格式转换工具 m4s 合并模块'},
  caption: {en: 'Dedicated m4s audio/video merge module for streaming caches.', zh: '面向流媒体缓存的 m4s 音视频合并模块。'},
  evidenceKind: 'runtime-recorded',
  provenance: {en: 'Released Windows executable, native window capture', zh: '已发布的 Windows 可执行文件，原生窗口截图'},
  capturedAt: D, versionLabel: 'release exe 2024-11-25 (sha B4A3F80D…)',
  claimIds: ['m4s-merge'], publication: 'approved'
 },
 {
  id: 'converter-pdf', projectId: 'converter', type: 'screenshot',
  src: './media/converter/pdf.jpg', width: 1250, height: 876,
  alt: {en: 'Mi Format Converter PDF editing module', zh: 'Mi 格式转换工具 PDF 编辑模块'},
  caption: {en: 'PDF module with merge and split actions.', zh: 'PDF 模块，提供合并与拆分操作。'},
  evidenceKind: 'runtime-recorded',
  provenance: {en: 'Released Windows executable, native window capture', zh: '已发布的 Windows 可执行文件，原生窗口截图'},
  capturedAt: D, versionLabel: 'release exe 2024-11-25 (sha B4A3F80D…)',
  claimIds: ['pdf-tools'], publication: 'approved'
 },

 // ── AI Tarot Reports: Next.js, mock LLM + in-memory store ──────────────────
 {
  id: 'tarot-draw', projectId: 'tarot', type: 'screenshot',
  src: './media/tarot/draw.jpg', width: 1180, height: 1268,
  alt: {en: 'AI Tarot report generator draw and reveal step', zh: 'AI 塔罗分析报告抽牌与揭示步骤'},
  caption: {
   en: 'Shuffle, draw and reveal step with the past-present-future spread, bilingual card names and upright meanings.',
   zh: '洗牌、选牌与揭示步骤，采用过去—现在—未来三张牌阵，含中英牌名与正位含义。'
  },
  evidenceKind: 'runtime-recorded',
  provenance: {en: 'Next.js development build in real Chrome; mock polishing switch, in-memory store, no paid model call', zh: 'Next.js 开发版在真实 Chrome 中运行；使用 mock 润色开关与内存存储，无付费模型调用'},
  capturedAt: D, versionLabel: 'ai-tarot-report-generator, local dev (mock LLM)',
  claimIds: ['three-card-spread', 'bilingual-cards'], publication: 'approved'
 },
 {
  id: 'tarot-home', projectId: 'tarot', type: 'screenshot',
  src: './media/tarot/home.jpg', width: 1180, height: 820,
  alt: {en: 'AI Tarot report generator landing page', zh: 'AI 塔罗分析报告生成器首页'},
  caption: {en: 'Landing page with the explicit entertainment and non-professional-advice disclaimer.', zh: '首页即明确标注娱乐性质与非专业建议免责声明。'},
  evidenceKind: 'runtime-recorded',
  provenance: {en: 'Next.js development build in real Chrome; mock mode', zh: 'Next.js 开发版在真实 Chrome 中运行；mock 模式'},
  capturedAt: D, versionLabel: 'ai-tarot-report-generator, local dev (mock LLM)',
  claimIds: ['disclaimers'], publication: 'approved'
 },
 {
  id: 'tarot-start-form', projectId: 'tarot', type: 'screenshot',
  src: './media/tarot/start-form.jpg', width: 1180, height: 1052,
  alt: {en: 'AI Tarot session start form', zh: 'AI 塔罗会话开始表单'},
  caption: {en: 'Session form collecting nickname, question type, spread and draw method before any generation.', zh: '生成前先收集昵称、问题类型、牌阵与抽牌方式的会话表单。'},
  evidenceKind: 'runtime-recorded',
  provenance: {en: 'Next.js development build in real Chrome; mock mode', zh: 'Next.js 开发版在真实 Chrome 中运行；mock 模式'},
  capturedAt: D, versionLabel: 'ai-tarot-report-generator, local dev (mock LLM)',
  claimIds: ['session-form'], publication: 'approved'
 },
 {
  id: 'tarot-report', projectId: 'tarot', type: 'screenshot',
  src: './media/tarot/report.jpg', width: 1180, height: 1722,
  alt: {en: 'Generated structured tarot report', zh: '生成的结构化塔罗报告'},
  caption: {
   en: 'Structured A–F report returned by the report API; the page marks the mock polishing switch honestly and repeats medical, legal, investment and entertainment disclaimers.',
   zh: '报告接口返回的 A–F 结构化报告；页面如实标注 mock 润色开关，并重申医疗、法律、投资与娱乐免责声明。'
  },
  evidenceKind: 'runtime-recorded',
  provenance: {en: 'Next.js development build in real Chrome; mock polishing, no paid model call', zh: 'Next.js 开发版在真实 Chrome 中运行；mock 润色，无付费模型调用'},
  capturedAt: D, versionLabel: 'ai-tarot-report-generator, local dev (mock LLM)',
  claimIds: ['structured-report', 'disclaimers'], publication: 'approved'
 },

 // ── Web Change: desktop UI renderer (Electron shell not started) ───────────
 {
  id: 'webchange-dashboard', projectId: 'webchange', type: 'screenshot',
  src: './media/webchange/dashboard.jpg', width: 1500, height: 940,
  alt: {en: 'Web Change desktop dashboard (UI renderer)', zh: '网页变化桌面端仪表盘（UI 渲染层）'},
  caption: {
   en: 'Dashboard with monitored-site KPI cards, alerts, last run and success rate. Captured from the desktop UI renderer; the Electron shell itself was not started because it begins multi-GB model downloads on launch with no opt-out.',
   zh: '仪表盘含监控站点 KPI、告警、上次运行与成功率。本图截自桌面端 UI 渲染层；Electron 整壳因开机即无开关下载数 GB 模型而未启动。'
  },
  evidenceKind: 'runtime-recorded',
  provenance: {en: 'Desktop UI renderer (Vite) in real Chrome, renderer process only', zh: '桌面端 UI 渲染层（Vite）在真实 Chrome 中实拍，仅渲染进程'},
  capturedAt: D, versionLabel: 'desktop-ui renderer, local dev',
  claimIds: ['dashboard-kpis'], publication: 'approved'
 },
 {
  id: 'webchange-monitors', projectId: 'webchange', type: 'screenshot',
  src: './media/webchange/monitors.jpg', width: 1500, height: 940,
  alt: {en: 'Web Change monitors view (UI renderer)', zh: '网页变化监控列表（UI 渲染层）'},
  caption: {en: 'Monitors view of the desktop UI (renderer). Monitoring effectiveness is evidenced separately by CLI semantic-diff runs.', zh: '桌面端监控列表（渲染层）。监测有效性另由命令行语义 diff 实测佐证。'},
  evidenceKind: 'runtime-recorded',
  provenance: {en: 'Desktop UI renderer (Vite) in real Chrome, renderer process only', zh: '桌面端 UI 渲染层（Vite）在真实 Chrome 中实拍，仅渲染进程'},
  capturedAt: D, versionLabel: 'desktop-ui renderer, local dev',
  claimIds: ['monitor-list'], publication: 'approved'
 },
 {
  id: 'webchange-add-monitor', projectId: 'webchange', type: 'screenshot',
  src: './media/webchange/add-monitor.jpg', width: 1500, height: 940,
  alt: {en: 'Web Change add-monitor dialog (UI renderer)', zh: '网页变化新增监控对话框（UI 渲染层）'},
  caption: {en: 'Add-monitor dialog with name, URL and tag fields (renderer).', zh: '新增监控对话框，含名称、URL 与标签字段（渲染层）。'},
  evidenceKind: 'runtime-recorded',
  provenance: {en: 'Desktop UI renderer (Vite) in real Chrome, renderer process only', zh: '桌面端 UI 渲染层（Vite）在真实 Chrome 中实拍，仅渲染进程'},
  capturedAt: D, versionLabel: 'desktop-ui renderer, local dev',
  claimIds: ['monitor-form'], publication: 'approved'
 },
 {
  id: 'webchange-add-monitor-advanced', projectId: 'webchange', type: 'screenshot',
  src: './media/webchange/add-monitor-advanced.jpg', width: 1500, height: 940,
  alt: {en: 'Web Change advanced monitor settings (UI renderer)', zh: '网页变化高级监控设置（UI 渲染层）'},
  caption: {en: 'Advanced monitor settings including selectors, schedule and diff sensitivity (renderer).', zh: '高级监控设置，包括选择器、调度与差异敏感度（渲染层）。'},
  evidenceKind: 'runtime-recorded',
  provenance: {en: 'Desktop UI renderer (Vite) in real Chrome, renderer process only', zh: '桌面端 UI 渲染层（Vite）在真实 Chrome 中实拍，仅渲染进程'},
  capturedAt: D, versionLabel: 'desktop-ui renderer, local dev',
  claimIds: ['monitor-form', 'semantic-diff'], publication: 'approved'
 },
 {
  id: 'webchange-alerts', projectId: 'webchange', type: 'screenshot',
  src: './media/webchange/alerts.jpg', width: 1500, height: 940,
  alt: {en: 'Web Change alerts view (UI renderer)', zh: '网页变化告警视图（UI 渲染层）'},
  caption: {en: 'Alerts view of the desktop UI (renderer, empty state shown).', zh: '桌面端告警视图（渲染层，图为空态）。'},
  evidenceKind: 'runtime-recorded',
  provenance: {en: 'Desktop UI renderer (Vite) in real Chrome, renderer process only', zh: '桌面端 UI 渲染层（Vite）在真实 Chrome 中实拍，仅渲染进程'},
  capturedAt: D, versionLabel: 'desktop-ui renderer, local dev',
  claimIds: ['alerts'], publication: 'approved'
 },
 {
  id: 'webchange-history', projectId: 'webchange', type: 'screenshot',
  src: './media/webchange/history.jpg', width: 1500, height: 940,
  alt: {en: 'Web Change run history (UI renderer)', zh: '网页变化运行历史（UI 渲染层）'},
  caption: {en: 'Run history view of the desktop UI (renderer, empty state shown).', zh: '桌面端运行历史视图（渲染层，图为空态）。'},
  evidenceKind: 'runtime-recorded',
  provenance: {en: 'Desktop UI renderer (Vite) in real Chrome, renderer process only', zh: '桌面端 UI 渲染层（Vite）在真实 Chrome 中实拍，仅渲染进程'},
  capturedAt: D, versionLabel: 'desktop-ui renderer, local dev',
  claimIds: ['history'], publication: 'approved'
 },
 {
  id: 'webchange-settings', projectId: 'webchange', type: 'screenshot',
  src: './media/webchange/settings.jpg', width: 1500, height: 940,
  alt: {en: 'Web Change settings view (UI renderer)', zh: '网页变化设置视图（UI 渲染层）'},
  caption: {en: 'Settings view of the desktop UI (renderer).', zh: '桌面端设置视图（渲染层）。'},
  evidenceKind: 'runtime-recorded',
  provenance: {en: 'Desktop UI renderer (Vite) in real Chrome, renderer process only', zh: '桌面端 UI 渲染层（Vite）在真实 Chrome 中实拍，仅渲染进程'},
  capturedAt: D, versionLabel: 'desktop-ui renderer, local dev',
  claimIds: ['settings'], publication: 'approved'
 },

 // ── Goodnight Store: UI-only Next.js build (candidate B) ───────────────────
 {
  id: 'goodnight-hero', projectId: 'goodnight', type: 'screenshot',
  src: './media/goodnight/hero.jpg', width: 1440, height: 900,
  alt: {en: 'Goodnight Store hero and featured products', zh: '晚安通贩首页横幅与热门商品'},
  caption: {
   en: 'Storefront hero with featured product cards. This is the UI-only build: browsing visuals only, no backend, account, payment or order pipeline. Product images are supplier samples carrying SAMPLE watermarks.',
   zh: '店铺首页横幅与热门商品卡片。这是纯 UI 版本：仅浏览界面，无后端、账号、支付或订单链路；商品图为带 SAMPLE 水印的供应商样图。'
  },
  evidenceKind: 'runtime-recorded',
  provenance: {en: 'UI-only Next.js build running in real Chrome', zh: '纯 UI 的 Next.js 版本在真实 Chrome 中运行'},
  capturedAt: D, versionLabel: 'goodnightstore UI-only build, local dev',
  claimIds: ['storefront-ui'], publication: 'approved'
 },
 {
  id: 'goodnight-products', projectId: 'goodnight', type: 'screenshot',
  src: './media/goodnight/products.jpg', width: 1440, height: 900,
  alt: {en: 'Goodnight Store product grid', zh: '晚安通贩商品网格'},
  caption: {en: 'Product grid with prices and sample-watermarked imagery; UI-only build, checkout is not implemented in this edition.', zh: '商品网格与价格，图片带 SAMPLE 水印；纯 UI 版本，本版未实现结账流程。'},
  evidenceKind: 'runtime-recorded',
  provenance: {en: 'UI-only Next.js build running in real Chrome', zh: '纯 UI 的 Next.js 版本在真实 Chrome 中运行'},
  capturedAt: D, versionLabel: 'goodnightstore UI-only build, local dev',
  claimIds: ['storefront-ui', 'product-catalog'], publication: 'approved'
 }
];

/**
 * Test-only fixture seam: browser suites may set
 * `window.__PORTFOLIO_TEST_MEDIA__` before bundle load to exercise the media
 * components with real served files without shipping an approved entry.
 * Production builds never define the flag, so behaviour is unchanged.
 */
function activeItems(): ProjectMedia[] {
 const fixture = (globalThis as {__PORTFOLIO_TEST_MEDIA__?: unknown}).__PORTFOLIO_TEST_MEDIA__;
 return Array.isArray(fixture) ? (fixture as ProjectMedia[]) : projectMedia;
}

const MEDIA_ROUTE_PREFIXES = ['media/'];

export function mediaFor(id: ProjectId): ProjectMedia[] {
 return activeItems().filter(item => item.projectId === id);
}

/** Media that may appear in the public site. */
export function approvedMedia(id: ProjectId): ProjectMedia[] {
 return mediaFor(id).filter(item => item.publication === 'approved');
}

/** Gallery order: screenshots first, then video, diagrams and illustrations. */
const ORDER: Record<ProjectMedia['type'], number> = {screenshot: 0, video: 1, diagram: 2, illustration: 3};
export function gallery(id: ProjectId): ProjectMedia[] {
 return approvedMedia(id).slice().sort((a, b) => ORDER[a.type] - ORDER[b.type]);
}

/**
 * Cover rule (T3 test 1): an approved real screenshot becomes the card cover;
 * withheld items and non-screenshot media never silently replace the labelled
 * illustration fallback.
 */
export function coverFor(id: ProjectId): ProjectMedia | null {
 const shots = approvedMedia(id).filter(item => item.type === 'screenshot');
 return shots[0] ?? null;
}

export function hasRealEvidence(id: ProjectId): boolean {
 return approvedMedia(id).some(item => item.evidenceKind === 'runtime-recorded' || item.evidenceKind === 'owner-supplied');
}

function isoDateOrNull(value: string | null): boolean {
 if (value === null) return true;
 if (typeof value !== 'string') return false;
 const time = Date.parse(value);
 return Number.isFinite(time) && value.includes('-');
}

export function validateProjectMedia(item: ProjectMedia): string[] {
 const issues: string[] = [];
 if (!item.id) issues.push('missing-id');
 if (!PROJECT_IDS.includes(item.projectId)) issues.push('unknown-project-id');
 if (!['screenshot', 'video', 'diagram', 'illustration'].includes(item.type)) issues.push('bad-type');
 for (const issue of safeUrlIssues(item.src, MEDIA_ROUTE_PREFIXES)) issues.push(`src: ${issue}`);
 if (item.poster !== undefined) for (const issue of safeUrlIssues(item.poster, MEDIA_ROUTE_PREFIXES)) issues.push(`poster: ${issue}`);
 if (!(Number.isFinite(item.width) && item.width > 0)) issues.push('bad-width');
 if (!(Number.isFinite(item.height) && item.height > 0)) issues.push('bad-height');
 if (!item.alt?.en || !item.alt?.zh) issues.push('missing-bilingual-alt');
 if (!item.caption?.en || !item.caption?.zh) issues.push('missing-bilingual-caption');
 if (!item.provenance?.en || !item.provenance?.zh) issues.push('missing-bilingual-provenance');
 if (!['source-reviewed', 'runtime-recorded', 'owner-supplied', 'illustrative'].includes(item.evidenceKind)) issues.push('bad-evidence-kind');
 if (!isoDateOrNull(item.capturedAt)) issues.push('bad-captured-at');
 if (item.type === 'video' && !item.poster) issues.push('video-without-poster');
 if (item.evidenceKind === 'runtime-recorded' && !item.capturedAt) issues.push('runtime-media-without-capture-date');
 if (item.evidenceKind === 'runtime-recorded' && !item.versionLabel) issues.push('runtime-media-without-version');
 return issues.map(issue => `${item.projectId}/${item.id}: ${issue}`);
}

/** Build gate: every public manifest entry must be valid. */
export function validateMediaRegistry(): string[] {
 return projectMedia.flatMap(validateProjectMedia);
}
