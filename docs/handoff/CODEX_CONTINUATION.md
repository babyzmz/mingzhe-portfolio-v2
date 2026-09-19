# Mingzhe Portfolio v2.1 → 真实项目展示与发布接续任务书

**使用对象：** 在用户电脑中打开作品集源码目录的 Codex。  
**目标：** 保留现有双语、3D 滚动叙事与详情动画，把展示性图形补充为真实项目证据，核对九个项目的源码对应，建立安全的 GitHub / 演示 / 下载入口，并完成真实浏览器和发布验收。  
**现有基线：** `Mingzhe-Portfolio-v2.1-Source.zip`；具体核对结果见同目录 `BASELINE_AUDIT.md`。  
**设计基础：** 仓库现有 `docs/superpowers/specs/2026-09-18-portfolio-design.md` 与 `docs/superpowers/plans/2026-09-19-case-study-revision.md`。本任务是接续，不是重新设计主页。  
**执行方式：** 先完成可在本地安全实施的任务，按依赖顺序推进；远程发布、其他仓库的功能修改与付费操作单独申请明确授权。

> 对执行代理：优先使用当前环境确实存在的代码审查、系统排错、测试驱动和完成前验证技能。没有某个技能或浏览器/桌面控制工具时，说明具体缺口，不声称已经调用。不因缺少技能插件而停下能完成的本地工作。

---

## 0. 阅读顺序、边界与第一轮工作

先读取并遵守当前仓库已有的 `AGENTS.md` / `AGENTS.override.md`；不要覆盖它们。随后读取：

1. 本文件和 `BASELINE_AUDIT.md`。
2. 根目录 `README.md`、`package.json`、`vite.config.ts`、`tsconfig.json`。
3. `docs/CONTENT_AUDIT.md`、`docs/VERIFICATION.md` 与原设计、修订计划。
4. `src/content.ts`、`src/case-types.ts`、`src/case-ai-content.ts`、`src/case-archive-content.ts`、`src/views.ts`。
5. `src/case-dialog.ts`、`src/main.ts`、`src/motion.ts`、`src/gsap-adapter.ts`，以及构建和测试脚本。

### 不可破坏的现有功能

- 现有九个项目 ID：`fairy`、`core`、`claw`、`ax`、`dreambound`、`webchange`、`goodnight`、`tarot`、`converter`。保留 ID，允许有证据地调整显示名称。
- EN / 中文切换、两种详情入口、打开/关闭/切换动画、章节导航、阅读进度、术语展开、键盘和焦点返回。
- 单一相机/滚动状态控制；禁止 GSAP 与原生滚动同时写入相机。
- 详情打开时暂停背后的 3D 渲染，关闭后恢复；尊重减少动态效果设置。
- 网页正文与交互保持 DOM 语义，不把全部内容烘焙进 Canvas。
- Fairy 有自己的 Core；MojoCore 服务于 MojoClaw / MojoAX。除非实际源码证明已发生架构变化，否则不得画成 Fairy 依赖 MojoCore。

### 首轮必须做出实际成果

完成 T0 基线核查和 T1 源码盘点；继续修复 T2 构建/测试可移植性；在素材尚不齐全时仍可完成 T3 的媒体/链接数据结构与组件测试。优先闭环 Fairy 的实际素材采集与网站接入，再推广到其余项目。

只有以下情况停下相应子任务：没有授权访问的源目录、无法确定同名项目对应关系、需要登录/密钥/付费调用、需要真实桌面录制但无工具、需要跨仓库功能修改、需要远程发布。记录阻塞，不用假素材补位，也不停止其他独立任务。

---

## 1. 先分清四种交付

| 交付 | 作用 | 不等于什么 |
|---|---|---|
| GitHub 源码仓库 | 保存版本、让有权限的人查看/克隆 | 不等于程序已在网上运行 |
| 静态网站 / Pages | 展示 HTML、CSS、JS、图片和可浏览器运行的演示 | 不能替代本地 Python、Rust、Electron、Tauri 进程或模型服务 |
| GitHub Release | 分发版本化安装包、压缩包、校验信息和发行说明 | 不等于点击后能在浏览器中运行 |
| 单独托管的应用后端 | 为真正需要 API、数据库、生成服务的在线 Demo 提供运行环境 | 不得把用户本机服务直接裸露到公网来冒充部署 |

因此，一个完全本地化项目可以有“公开案例 + 私有源码 + 本地运行说明”，不必先改造成 SaaS。也可以在用户批准后增加公开发行包；公开源码不是展示作品的前提。[S2][S3][S4]

---

## T0 — 确认当前目录、版本和旧站整合方式

**范围：** 当前作品集目录；默认不改动其他产品仓库。

**先执行只读检查：**

```text
git status --short
git branch --show-current
git rev-parse HEAD
git remote -v
node --version
npm --version
python --version
```

目录不是 Git 仓库时，不把这当程序错误。识别它是 ZIP 解压目录还是已有克隆；不要在用户整个桌面或总工作目录执行 `git init`。输出 remote 前确认 URL 没有内嵌凭据，日志中对凭据脱敏。

**具体动作：**

- [ ] 对照 `BASELINE_AUDIT.md` 确认源码差异；本地已更新时，以当前工作树和新证据为准，不退回旧包。
- [ ] 找到真正包含 `src/` 与 `package.json` 的项目根。不能只打开或直接修补单文件 HTML。
- [ ] 工作区已有未提交更改时，保留并报告；不自动 reset、clean、stash、覆盖 `.git` 或强制切分支。
- [ ] 使用当前独立工作区或经用户批准的工作分支；不在远程 main 上直接试验。
- [ ] 若要合入 `babyzmz/mingzhe-portfolio`：先读取远程当前分支与文件树。把新站作为正常文件差异带入旧站克隆，不 force push、不默认拼接无关历史，不删除旧 `demos/` 和素材。
- [ ] 新增 `.handoff-private/` 到本地忽略规则后，创建私有源码映射、原始截图和敏感日志目录；核实这些文件未被 Git 跟踪。忽略规则不是保密机制，仍要检查 staged files 和构建产物。

**输出：** `.handoff-private/BASELINE_LOCAL.md` 记录目录、分支、HEAD、变更清单和命令结果；公开可提交的摘要只保留版本、已知限制与不含敏感信息的结果。

**验收：** 明确正在修改哪份源码；原站和用户其他工作不被覆盖；没有修改远程仓库或启动部署。

---

## T1 — 九个项目与真实源码逐一对应

**新增本地记录：** `.handoff-private/project-map.local.json`。不导入到前端、不复制到 `public/`、不提交至公开仓库。

每个项目都记录：

```text
projectId / 显示名及旧别名
localRoot / entryPoint / framework
repositoryRemote / branch / commit / workingTreeState
matchStatus: confirmed | candidate | missing
sourceEvidence: 文档、入口文件、对应组件/路由与观察到的行为
startCommand / testCommand / dataRequirements
runtimeType: static-web | server-web | desktop | service | unknown
runStatus: not-run | passed | failed | blocked
publicationDecision: keep-private | approved-public | undecided
blockingReason / nextAction
```

**证据规则：** 仓库名字相同只是候选。结合 `git remote`、README、实际入口、页面标题、功能模块、素材及运行行为确认。存在多个版本时列出候选和差异，请用户指定活动版本；不要自作主张选择最近修改的备份。个人贡献不能仅由仓库名称或提交作者判定，沿用已批准简历并请用户确认新增贡献措辞。

**查找范围：** 仅在用户授权的项目根及必要子目录中读取，不递归扫描整块硬盘、浏览器档案或凭据目录。找不到时一次性列出缺失项目和所需目录授权。

| projectId | 当前起点 | 必须继续核对 |
|---|---|---|
| fairy | `babyzmz/Fairy-LLM`；本包描述 V3 | 本地活动分支、桌面入口、真实形态/工作区、可运行版本与仓库提交是否对应 |
| core | 本包中的私有共享核心摘要 | 读取本机 remote、运行入口与持久化/取消/恢复的实际代码；不把旧纪要当当前验收 |
| claw | 私有个人工作台摘要 | 产品前端、桌面壳、Core 接入配置和可运行主流程 |
| ax | 私有企业工作台摘要 | 实际存在的业务界面、Core 依赖、占位/未接入模块 |
| dreambound | 旧站 `demos/dreambound/` | 找回实际脚本与资产；过去指定 `js/core/game.js` 请求为 404，这不代表所有历史版本都坏，也不能忽略它 |
| webchange | 旧站项目条目，现名 Web Change | Electron 主进程、renderer、变化监测后端是否存在并能一起运行 |
| goodnight | 旧条目；同名 `babyzmz/goodnightstore` 是候选 | 对比本地内容；本轮读到远程默认根目录有 Next.js 配置，未见 app/pages/src，不能仅据此宣布业务源码完整 |
| tarot | 旧条目，现名 AI Tarot Reports | 输入、生成接口、结果/报告源码是否完整；区分固定样例与真实模型输出 |
| converter | 旧 PyQt 项目条目 | 主入口、格式处理模块、依赖的外部程序、实际支持的格式与失败处理 |

**测试式验收：** 九条记录都存在；确认条目有真实文件/运行证据；缺失条目状态明确；把候选 URL 误标 confirmed 或把旧站 `script.js` 当实际业务源码时检查必须失败。

**结果：** 九项目对应表 + 最小缺口表。不能用新增同名空仓库来“完成匹配”。

---

## T2 — 先打通正式构建与真实浏览器测试

**涉及现有文件：** `package.json`、`src/external.d.ts`、`src/gsap-adapter.ts`、`src/motion.ts`、`scripts/build-preview.mjs`、`scripts/test.mjs`、`tests/*.py`。新增的测试辅助模块放入 `tests/browser_support.py`，依赖说明放入 `requirements-dev.txt` 或采用已有锁定工具；不要引入第二套同功能测试栈。

**事实：** 本包不是 Three.js 工程。它是自写 WebGL + 软件 3D 降级，GSAP 仅为可选适配层。不要为了满足原来某个名词而整站改成 Three.js；确需迁移时先单独说明问题、收益、范围与回归成本。

- [ ] 检查 package 声明的依赖是否可安装、与当前 Node 兼容；本包没有锁文件。首次安装成功后产生真实 `package-lock.json`，之后 CI 使用 `npm ci`。不手造锁文件，不以随意降级或屏蔽安装错误冒充修复。
- [ ] 执行 `npm run typecheck`、`npm test`、`npm run build`、`npm run build:offline`、`node --test tests/bundle.test.mjs`。
- [ ] 检查 `src/external.d.ts` 对 GSAP 的宽泛 any 声明。安装版优先使用已安装库的真实类型，不能让宽泛声明掩盖导入或 API 错误；离线构建兼容需保持。
- [ ] 统一 Python 测试浏览器启动：可使用 `CHROMIUM_PATH`、浏览器 channel 或 Playwright 管理的浏览器。去掉 `/usr/bin/chromium` 的硬编码，不能把 `--no-sandbox` 固定为本机默认。
- [ ] 将测试入口标准化为 `PORTFOLIO_TEST_URL`：存在时用 `page.goto(URL)` 检查真实 HTTP 页面；原 `set_content` 留作离线专项，不替代真实站点验证。
- [ ] 分别测试 `dist/` 的 Vite 版本、`preview/` 的离线静态版本，以及单文件预览。
- [ ] 在安装版检查真实 `data-scroll-backend` 为 `gsap`，并确认实际相机与滚动有变化；离线版可以明确使用 `native`，不伪造 GSAP 已加载。
- [ ] 在用户支持 GPU 的真实浏览器验证 shader 编译、正反滚动、窗口缩放、中途刷新、语言切换和 context lost/recovery。记录实际 renderer；软件渲染通过不等于 GPU 通过。

**可用命令基线：**

```text
npm install
npm run typecheck
npm test
npm run build
npm run build:offline
node --test tests/bundle.test.mjs
python -m pip install playwright
python -m playwright install chromium
```

安装依赖前检查脚本与来源；沿用用户的环境/虚拟环境。失败后定位根因，不把自动化计数从旧报告复制过来。

**HTTP 子路径验收示例（PowerShell，在测试启动辅助改造之后）：**

```powershell
# 终端 1：发布构建的本地服务器，不是线上部署
$env:PREFIX = '/mingzhe-portfolio'
node scripts/serve.mjs --dir dist

# 终端 2：PORTFOLIO_TEST_URL 是本任务需要新增的测试配置
$env:PORTFOLIO_TEST_URL = 'http://127.0.0.1:8765/mingzhe-portfolio/'
python tests/details.browser.py core
python tests/details.browser.py cases-en
python tests/details.browser.py cases-zh
python tests/details.browser.py edge
python tests/details.browser.py responsive
python tests/details-stress.py
python tests/browser.py
python tests/motion-control-regression.py
python tests/page-lifecycle.py
```

**完成定义：** 安装版、离线版结果分开记录；本地 Windows 路径可以运行测试；未实测平台如实保留。测试网站不等于验证了 Fairy 或 Mojo 服务。[S5][S6]

---

## T3 — 增加真实媒体与多种链接模型，而不是只替换图片文件名

**修改：** `src/content.ts`、`src/views.ts`、`src/main.ts`、`src/case-dialog.ts`、`styles/cases.css`、`styles/responsive.css`。  
**新增：** `src/project-media.ts`、`src/project-links.ts`、`src/media-view.ts`、`src/media-controller.ts`、对应测试。共用 `ProjectId`、`Localized` 放在拟新增的 `src/project-types.ts`，两个模块导入同一定义，不复制维护。先检查现有代码，已有等价模块则复用。

### 3.1 公共数据与私有核对记录分开

`src/` 只包含适合公开的声明、素材路径与已经批准的外链。完整本地路径、私有仓库 remote、未脱敏截图和日志只放 `.handoff-private/`。

建议接口（下一代理实现，不是声称当前已存在）：

```typescript
export type ProjectId = 'fairy'|'core'|'claw'|'ax'|'dreambound'|
  'webchange'|'goodnight'|'tarot'|'converter';
export type Localized = { en: string; zh: string };
export type EvidenceKind = 'source-reviewed'|'runtime-recorded'|
  'owner-supplied'|'illustrative';
export type ProjectMedia = {
  id: string;
  projectId: ProjectId;
  type: 'screenshot'|'video'|'diagram'|'illustration';
  src: string;
  poster?: string;
  width: number;
  height: number;
  alt: Localized;
  caption: Localized;
  evidenceKind: EvidenceKind;
  capturedAt: string | null;
  versionLabel: string | null;
  claimIds: string[];
  publication: 'approved'|'withheld';
};
export type ProjectLink = {
  kind: 'source'|'demo'|'download'|'record';
  url: string;
  label: Localized;
  verifiedAt: string | null;
  access: 'public'|'restricted';
  verification: 'verified'|'unverified';
  publication: 'approved'|'withheld';
};
```

项目状态、来源证据、运行验收、公开权限是不同维度；不要用一个 `verified=true` 同时代替它们。

### 3.2 媒体组件行为

- [ ] `art(p)` 保留示意图 fallback；存在批准的真实截图时，项目卡片优先使用真实截图。不要自动把所有 3D 主视觉删成截图墙。
- [ ] 详情保留五章阅读结构，在概览/功能段内增加真实截图画廊和录屏，不另起一套详情 modal。
- [ ] 动效保持连续：卡片到详情、缩略图到放大图、前后图片切换、关闭和项目切换均有过渡。放大图作为现有详情内部模式，Escape 先退出媒体模式，再关闭项目；不能破坏 focus trap。
- [ ] 截图可裁切/压缩/遮盖敏感字段，但不能重新绘制或篡改产品结果。图下注明“原生窗口截图”“仅 renderer 演示”“流程示意”“用户提供截图”等真实类型。
- [ ] 视频默认不自动播放，不提前下载整段；使用 `poster`、`controls`、`playsinline`、`preload="none"`。转场、关闭、切换项目、离开媒体区域时暂停。需要时提供字幕或文字步骤。
- [ ] 图片给出尺寸以避免布局跳动；非首屏懒加载；404、解码失败、无媒体和低带宽都有可读 fallback，不出现永久 loading。
- [ ] EN/中文标题、图注和可访问名称齐全；触屏、键盘和减少动态效果均可操作。

### 3.3 链接组件行为

`url` 不能继续混用。分别显示“源码 / 真实在线演示 / 下载 / 原项目记录”。旧站 `script.js` 只是旧条目证据，不能标成“项目源码”。私有仓库不向公众展示失效的源码按钮，不在浏览器里加 GitHub token 去访问私有仓库。

“在线演示”要求验证过真实交互，而不只是首页返回 200。未批准/未验证的链接不显示成可用按钮；需要登录或预约时明确说明。优先保留外部打开入口，只有完成实际嵌入检查后才做 iframe。

### 3.4 必须先写的行为测试

1. 有 approved screenshot 才选为封面；withheld 和无素材时保留明确标注的图形。
2. 真实视频没有首屏自动播放；关闭详情后暂停且不会继续发声。
3. 旧记录链接只出现“原项目记录”，不出现“源码/试玩”。
4. public + verified + approved 的 demo 才出现“在线演示”。
5. 公共 manifest 禁止 `file:`、本机路径、凭据化 URL、localhost/回环/内网地址及非批准协议。站内相对链接必须规范化并限制在批准的资源路由内，阻止路径穿越。
6. 图片加载失败、媒体关闭、快速切换项目、语言切换时没有焦点丢失、背景滚动和残留定时器。

新 `tests/project-media.test.mjs`、`tests/project-links.test.mjs` 必须加入 `scripts/test.mjs` 的真实测试列表，否则文件存在不代表会执行。输出与测试类型保持同一套定义。

---

## T4 — 启动真实项目、采集素材并补充清楚的项目说明

**启动原则：** 先阅读该项目的运行说明与启动脚本；使用测试资料、独立数据目录与本地端口。不得迁移/清空用户生产数据库，不默认启动付费模型请求。需要跨仓库修复时先记录具体改动建议，取得授权再在该项目分支修改。

**采集预算是目标，不是已经完成的数量：** 四个重点项目各争取 3–5 张有信息量的截图和一段约 20–45 秒演示；旧项目以 1–3 张已核实截图起步。不要为凑数量重复截同一页。

| 项目 | 优先采集什么 | 至少证明什么 |
|---|---|---|
| Fairy | 桌宠真实形态；普通与项目会话；文档/工具/生成物过程；状态切换短录屏 | 实际桌面宿主中的窗口、输入、上下文与工具反馈。仅浏览器 renderer 不能证明透明窗口和原生命中 |
| MojoCore | 脱敏的命令/接口结果，配合 Claw 前端的真实取消/恢复录屏 | 没有自有 GUI 就不伪造后台界面；保留架构示意，再提供与该版本对应的实际执行证据 |
| MojoClaw | 项目与会话；任务进度；生成文件预览；取消/恢复 | 真实 UI → Core → 结果链路，假数据必须标“界面样例” |
| MojoAX | 实际工作台；资料/生成物；按任务切换的工作视图 | 只展示当前接通的流程，未接入业务面板不得伪装为可用 |
| Dreambound | 起始页、实际游戏画面、结束/重开 | 原来的脚本真的加载；能开始、操作、重开，而不是只展示 HTML 按钮 |
| Web Change | 地址/任务配置、比较视图、变更结果 | 只有 renderer 则明确“UI 演示”；监测服务未运行不宣称监测有效 |
| Goodnight | 实际商品浏览和本地实现的流程 | 不添加未存在的结账、支付、库存能力；禁止真实付款 |
| Tarot | 输入、生成过程、结果/导出 | 样例固定内容与真实模型生成明确区分；密钥只在适当服务端/本地环境 |
| Converter | 输入、格式选项、实际输出、失败提示 | 用不含个人信息的测试文件成功转换并打开结果；格式范围以实际测试为准 |

**采集记录（私有）：** projectId、源根、分支/commit、工作树是否 dirty、时间、平台、启动命令、演示步骤、实际结果、原文件哈希和脱敏说明。没有 Git 的项目记录文件快照哈希，不编造 commit。

**公开素材：** 只把批准并脱敏后的结果放到 `public/media/<projectId>/`；保留合理可读的分辨率。禁止把 API key、个人聊天、邮件、真实客户信息、家庭信息、机器用户名路径、license key、终端历史直接发布。录屏所有帧、字幕、poster 和文件元数据都需检查。

**素材来源不够时：** 检查 Codex 当前是否有原生桌面操作/录制工具。没有则给用户一张具体拍摄清单，注明窗口、步骤、文件命名和放置目录；不拿生成图片冒充截图。Fairy 原生窗口不能仅由 Playwright 的网页截图替代。

**文案更新：** 在 `src/content.ts` 和两个 case-content 文件中同步说明：它是什么、解决什么问题、一次真实操作如何完成、本人做了什么、证据支持什么、还有什么限制。技术名词要解释。主观学习体会、设计意图、代码存在和运行验证分开写，不能把“我计划做”改成“已实现”。

**验收：** 网站每张真实媒体能对应具体项目版本/会话；四个重点项目能用普通中文讲清用途；中英文含义一致；改掉与新证据不再匹配的全局“所有画面都是示意图”文案，但未验证项目继续保留限制。

---

## T5 — 建立可重复的资源构建，补齐单文件、静态版和视频服务

**涉及：** `scripts/build-preview.mjs`、`scripts/serve.mjs`、`public/`、`tests/bundle.test.mjs`、新媒体验证脚本；必要时 `vite.config.ts`。

当前离线 builder 复制 `public/` 到 `preview/`，但单文件只特别内嵌 PDF/favicon，新增截图不自动变成单文件内嵌资源。当前本地静态服务也未声明 mp4/webm/vtt MIME 或 Range 支持，接视频前要处理。

- [ ] 统一媒体路径解析。`dist/`、`preview/` 与仓库子路径都正确；不要把 URL 写成用户电脑的绝对路径。
- [ ] 网络版使用同站点静态资源；poster + 按需加载视频。建议封面压缩后尽量在 300KB 内、清晰大图尽量在 800KB 内；这只是目标，清晰度优先并记录例外。不要把数十 MB 录屏转换为首屏 base64。
- [ ] 单文件版保留已经承诺的基本内容、样式、必要缩略图与简历离线可读；视频使用同目录 `media/` 的配套包或明确联网播放入口。纯单文件不能播放的内容要清楚提示，不能悄悄失去离线能力。
- [ ] 媒体改变后重新生成所有交付，不直接编辑 `preview/app/` 或单文件 bundle；清理过期素材与重复封面，但不删除原始证据。
- [ ] 为本地视频服务补全 Content-Type，并支持合理的 GET/HEAD 和单段 byte Range（或复用已有可信静态服务器）。测试 200、206、无效 Range 416、Content-Range、视频 seek 和字幕，不自行臆造协议结果。
- [ ] 在真实 HTTP origin 下加载图片/视频，检查请求状态、解码与音视频控制；不能仅用 `set_content` 测试内联 DOM。
- [ ] 公共包和 sourcemap/静态输出做隐私/密钥扫描：不得包含 `.handoff-private`、原始敏感日志、授权 token、私有 source excerpt 或本机路径。

**验收：** 同一份源数据生成三种交付；媒体损坏测试能真实失败；静态包开箱可看；单文件/配套包的能力说明与实测一致。

---

## T6 — 完全本地化项目上 GitHub：先整理，再经授权上传

### 6.1 准备并非开源

先整理本地源码的 README、安装/运行方式、依赖锁、测试、纯示例数据、`.env.example` 和有依据的第三方说明。运行方式不需要变成云端。不要默认添加 MIT 等开源许可证，不默认公开企业项目，也不要把个人站默认设为所有产品的 monorepo。

默认策略：本地未知项目先按私有源码方案准备；公开只在用户按项目批准后进行。Mojo 私有项目维持私有。既有公共 Fairy 仓库沿用已确认的入口，不重复建一个同名空壳。

### 6.2 上传前清理与检测

禁止提交真实 `.env`、token、私钥、签名证书、浏览器 profiles、生产数据库、会话/记忆、客户文件、模型权重、缓存、虚拟环境、node_modules、用户本地配置与未批准媒体。具体忽略规则按真实项目生成，不能为了避免大文件把必要源文件漏掉。

同时检查当前工作树、暂存区、已跟踪文件和将要推送的历史。只新增 `.gitignore` 不会清除 Git 历史。发现泄露凭据先停止发布、通知用户撤销/轮换，再规划历史处理；不打印秘密，也不未经批准改写历史或 force push。[S7]

源目录带有旧 remote 或旧历史时，先核对其用途，禁止直接替换 remote。首次无历史项目才考虑 `git init`。只提交审查过的路径，禁止未经检查执行 `git add .`。

### 6.3 每个远程写入的批准卡

在动作前向用户展示一张简短卡：

```text
项目：
目标 owner/repository：
操作：新建 / 推送分支 / 创建 PR / 发布版本 / 更改可见性 / 部署
可见性：private 或用户明确批准的 public
来源 commit 或快照：
包含内容：源码 / 已脱敏资料 / 安装包
排除内容与扫描结果：
是否会触发既有 Actions、Pages 或生产部署：
```

用户确认后才执行卡片范围内的动作。推送本身可能触发原仓库流水线，所以批准“上传源码”不应被自动扩大成任意生产部署。

### 6.4 命令机制（由 Codex 用已确认参数构造，不盲贴）

GitHub CLI 支持从本地目录创建仓库，例如 `gh repo create` 的 `--source`、`--private`、`--remote`；`--push` 会立刻推送，未经单独确认不要附加。已有 remote 时应复用，不重新覆盖。GitHub 官方建议本地导入前不要在远程预先创建会冲突的初始化文件。[S2][S8]

批准后的顺序：确认登录身份/仓库权限 → 本地提交 → 创建或核对 remote → 检查将推送的差异与流程触发范围 → 推送明确的分支 → 从远程重新读取 HEAD/文件验证。验证 remote 地址前确保 URL 没有明文 token。

**上传完成标准：** 从一个干净目录重新 clone 并按 README 构建/运行，证明确实上传了完整源码，而不仅是配置、构建结果或宣传页。该项目不宜在此环境运行时只记录“源码上传完成，运行验证受阻”，不可伪造全通过。

### 6.5 桌面安装包与 Release

Tauri/Electron/PyQt 项目按其真实工具链在目标平台构建。先本地运行安装/卸载/启动等烟测，记录版本、OS、架构、签名状态和 SHA-256。能打包不代表已签名或已批准正式 Beta。

经授权把安装包作为 Release asset 分发，不能把 GitHub 自动生成的 source ZIP 标成可安装程序。应用需要本地模型时单独说明模型下载、大小、硬件和许可约束，不默认把权重塞进 Git。GitHub 对普通 Git 大文件和 Release asset 有不同限制，执行时核对当前官方规则。[S4][S9]

私有源码仓库的下载不能当作公众入口。需要公开二进制时，另行批准公开 release-only 展示仓库或静态下载存储，只放批准的制品与说明，不泄露私有源码；用户也可以选择不公开下载，只保留案例与预约演示。

---

## T7 — 按运行类型接上项目，而不是统一塞 iframe

| 类型 | 首选网站入口 | 需要验证 |
|---|---|---|
| 纯静态 HTML/Canvas 项目 | 经过验证的静态 demo；必要时新标签页打开 | JS/素材全齐、交互能用、子路径正确、移动端可读 |
| Tauri / Electron / PyQt | 真实截图和录屏 + 公共源码（允许时）+ 经批准 Release 下载 | 原生运行、版本/架构、下载与校验；renderer 演示明确是子集 |
| 需要 Node/Python/API/数据库的项目 | 单独部署的应用链接，或暂只提供本地录屏与说明 | 实际服务端、测试数据、密钥隔离、鉴权/限流/成本控制 |
| 私有共享后端（如 MojoCore） | 公开安全的架构说明、前端集成录屏和脱敏运行证据 | 不伪造 GUI，不公开管理 API，不需为展示而开放后端 |

**Dreambound 专项：** 将原本真正可运行的脚本/资源从确认的本地版本恢复到明确的 demo 构建目录。可以在作品集 `public/demos/dreambound/` 发布审查后的静态构建，也可以独立部署后链接。若是单独项目输出，记录来源 commit 与复制/构建脚本，避免两份手工源码长期漂移。脚本缺失未修好之前，不显示“试玩”。

**Next.js 专项：** 先看真实代码和依赖，不能因项目叫 Next.js 就断言必须服务器，也不能一律强制 `output: 'export'`。纯静态可导出时用静态产物；请求时 API、认证、数据库/生成等功能需要实际服务环境。不能删除业务能力以换取导出成功却继续宣传完整产品。[S10]

**在线 AI Demo 专项：** 不把 provider key 写入客户端、Vite 环境变量或公共源码；不接真实客户数据；不自动产生付费调用。公开调用要有权限、速率、配额与预算控制，需求不足则保留录屏，不为一页作品集强行常驻服务。

**iframe 专项：** 先测试目标的 CSP/frame-ancestors、X-Frame-Options、登录/Cookie 和跨域行为。不绕过对方安全头，不移除认证。嵌入不适用则使用新标签页。不要嵌套未经审计的同源演示并过度开放 sandbox 权限。

**验收：** 每个按钮做的是标签声称的动作；匿名访客可按公开权限成功打开，受限入口有明确说明；本机 `localhost` 绝不当公网地址。

---

## T8 — 把作品集接入现有 GitHub，建立可回退发布

**本地准备：** `.github/workflows/ci.yml`、`.github/workflows/pages.yml`、更新 README；这些是拟新增文件，不是 v2.1 已有文件。

- [ ] 以实际旧仓库分支为基底合入新站。备份/保留旧 demo 与有效链接，记录回退 commit；不直接让 ZIP 覆盖仓库并丢失资源。
- [ ] 确定生产只从 `dist/` 发布，`preview/` 用于离线/验收；保留 `base: './'` 只有通过目标子路径验证时才接受，改成固定 base 则必须同时验证离线交付。
- [ ] CI 先只执行依赖安装、类型、单元、媒体/链接清单、构建与隐私检查；不能在 PR 中运行不可信代码后直接授予发布权限。
- [ ] Pages 初始使用明确的手动/批准发布流程；执行时查阅最新官方推荐 action 和权限，不照抄已过时版本号。[S3][S5]
- [ ] 不上传整个源码根作为 Pages artifact；仅上传已扫描的静态产物，不包括 `.handoff-private/`、原始报告和其他项目仓库。
- [ ] 公共站点匿名检查所有项目链接、真实媒体、简历下载、EN/中文、锚点/刷新和手机布局。预期地址只是规划，必须以实际部署返回 URL 为准。
- [ ] 删除无效占位按钮；保留失效链接记录及原因，不把 404 自动当作“项目不存在”（私有权限或特定路径错误可能导致无法访问）。

**重要：** 私有源码不意味着生成的网站私有。Pages 的访问能力与账户/企业配置有关；用于公开个人站时，一律按静态文件可被公众访问来审查，除非另有实际验证过的访问控制。[S3]

**回退：** 保存上一个验证通过的站点构建及 commit；新发布失败时用获批的回退流程恢复，不强推删历史。

---

## T9 — 验收、交付与下一轮接续

**验收矩阵至少包含：**

- 内容：9 项目身份对应、贡献措辞、实际/示意/样例边界、中英一致。
- 交互：两种详情入口、媒体放大/切换、视频暂停、返回焦点、快速开关、术语展开、章节进度。
- 构建：Vite + GSAP 实测、离线静态、单文件/配套包、Windows 测试可运行。
- 场景：WebGL、软件降级、完全无 renderer；首屏与五章相机同步、反向滚动、resize、刷新。
- 媒体：真实 HTTP 加载、404 fallback、尺寸/清晰度、录屏来源、字幕/图注、子路径和离线说明。
- 发布：源码仓库权限、公开制品、目标版本、匿名链接、Pages artifact 内容和回退。
- 安全：没有 token/原始敏感资料、私有 remote/localRoot、错误的前端 secret、未获批的远程动作。

**不得承诺所有项目都能在这一轮被公开部署。** 全部盘点完成与每个 runtime/发布完成是独立状态。缺资料、缺设备、缺账号或缺批准，应明确列出未完成部分及下一步。

**每次结束都更新 `.handoff-private/HANDOFF_STATUS.md`：**

```text
当前作品集 commit / 工作树状态：
本轮修改的项目与文件：
已确认的源码映射与剩余歧义：
已采集并批准的媒体：
执行命令、退出码、真实测试结果：
构建路径 / URL / renderer：
已完成的远程动作及授权范围：
失败 / 阻塞 / 未测试：
下一条可直接执行的任务：
需要用户提供的最少材料：
```

运行记录的公开版只能保留脱敏摘要。网站完成、项目运行完成、源码上传完成和部署完成要分别汇报。不能用测试数量作为原生项目或企业系统生产就绪的证明。

---

## 推荐优先次序

**T0 → T1 → T2 → T3 → Fairy 的 T4/T5 → 其余项目 T4/T5 → 按批准执行 T6/T7 → T8/T9。**

先把一条“真实源码 → 真实运行 → 截图/录屏 → 清楚说明 → 可验证入口”的链路完整做通，再复用到另外八个项目。不要先把九个名字建成空 GitHub 仓库，也不要先动所有动画。

---

## 官方参考与来源边界

这些链接用于执行时查证工具和部署行为，不证明用户项目已运行或已发布。审计基线来自实际 v2.1 文件；远程候选状态要在 Codex 本机再次读取。

- [S1] Codex 的 AGENTS.md： https://developers.openai.com/codex/guides/agents-md/
- [S2] 本地源码导入 GitHub： https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github
- [S3] Pages 类型与可见性： https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages ；https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
- [S4] GitHub Releases： https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases
- [S5] Vite 静态发布： https://vite.dev/guide/static-deploy
- [S6] Playwright 浏览器： https://playwright.dev/python/docs/browsers
- [S7] 清除敏感数据与凭据处置： https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository
- [S8] GitHub CLI 新建仓库： https://cli.github.com/manual/gh_repo_create
- [S9] GitHub 大文件： https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github
- [S10] Next.js 静态导出： https://nextjs.org/docs/pages/guides/static-exports ；应匹配项目真实 router/版本查阅对应文档。

本任务书只交接后续工作。其存在不代表素材已替换、九个项目源码已匹配、安装版已验证、任何仓库已上传或网站已经上线。
