# v2.1 接续基线静态核对

本记录由实际解包并读取 `Mingzhe-Portfolio-v2.1-Source.zip` 得到。没有访问用户电脑的源目录，没有运行九个项目，没有在本轮重新执行网站测试，也没有修改或推送任何仓库。此前 VERIFICATION.md 中的通过数属于历史记录。

## 1. 输入标识

- ZIP 文件字节数：`641187`。
- ZIP SHA-256：`633d2db96bd3b28ed0e04f57942cecd0b4c74fba8e0ef0b01f65d00347d5bf6f`。
- ZIP 内项目根：`mingzhe-portfolio-v2.1/`。
- package name：`mingzhe-systems-in-motion`；version：`2.1.0`。
- ZIP 未包含 `.git/`、`package-lock.json`、根 `AGENTS.md` 或 `.github/workflows/`。实际本地目录已有这些内容时，应以实际目录为准。

## 2. 直接影响接续任务的代码事实

| 发现 | 实际源码位置 | 影响 |
|---|---|---|
| 依赖是 gsap 3.15.0；开发依赖 TypeScript、Vite；无 Three.js | `package.json:1-6` | 不能把当前代码当 Three.js 模板接手，也不能说 npm 安装路径已验证 |
| Project 只有一个 url: string或null，没有链接分类/媒体字段 | `src/content.ts:1-3` | 要新增独立媒体、源码、演示与下载模型 |
| 封面由 mini-eye / mini-core / mini-window 等 HTML/CSS 示意产生 | `src/views.ts:10-20` | 不是到 assets 找同名 PNG 替换；需改渲染入口 |
| card() 与 renderCase() 共用项目记录，source 按 p.url 有无决定 | `src/views.ts:21-27,78-112` | 项目记录 URL 容易被当作源码；应按链接语义显示 |
| 详情开关由 createCaseDialog 管理；打开时 suspend 背景 renderer | `src/main.ts`、`src/case-dialog.ts` | 媒体功能要接已有生命周期而非新造不协调弹窗 |
| attachGsap() 动态导入失败会返回 null | `src/gsap-adapter.ts:1-11` | 页面可见不等于用了 GSAP，需记录真实 backend |
| external.d.ts 用 any 描述 GSAP 接口 | `src/external.d.ts` | 安装版需要真实类型与运行核对，避免掩盖错误 |
| preview 构建复制 public/，单文件特别内嵌 PDF/favicon | `scripts/build-preview.mjs:13-31` | 新媒体不会自动被单文件打包；必须明确离线资源策略 |
| 本地服务器的 MIME 表没有视频/字幕，也没有 Range 分支 | `scripts/serve.mjs:9-21` | 视频加载与拖动不能靠旧服务器行为假定通过 |
| 多个测试固定 /usr/bin/chromium，用 set_content 加载 | `tests/details.browser.py:19-30` 等 | Windows 需要浏览器配置和真实 HTTP 测试，不仅复制旧命令 |
| test.mjs 仅列入三个现有模块测试文件 | `scripts/test.mjs` | 新增测试文件后要注册到 runner，不能只检查文件存在 |
| 历史验证记录列明未运行 npm/Vite/GSAP/GPU 路径 | `docs/VERIFICATION.md` | 本轮接续需补实测，不宣称所有路径原本已通过 |

## 3. 当前九项目外链的准确含义

| ID | 站内名称 | v2.1 url | 当前能证明的范围 |
|---|---|---|---|
| `fairy` | Fairy | https://github.com/babyzmz/Fairy-LLM | 项目公开仓库入口，不等于本机运行验证 |
| `core` | MojoCore | null | 未给公众提供仓库入口 |
| `claw` | MojoClaw | null | 未给公众提供仓库入口 |
| `ax` | MojoAX | null | 未给公众提供仓库入口 |
| `dreambound` | Dreambound Realm | https://github.com/babyzmz/mingzhe-portfolio/tree/main/demos/dreambound | 原仓库子目录；运行逻辑需继续核查 |
| `webchange` | Web Change | https://github.com/babyzmz/mingzhe-portfolio/blob/main/script.js | 只是旧作品集条目，不是这个项目的业务源码 |
| `goodnight` | Goodnight Store | https://github.com/babyzmz/mingzhe-portfolio/blob/main/script.js | 只是旧作品集条目，不是这个项目的业务源码 |
| `tarot` | AI Tarot Reports | https://github.com/babyzmz/mingzhe-portfolio/blob/main/script.js | 只是旧作品集条目，不是这个项目的业务源码 |
| `converter` | Mi Format Converter | https://github.com/babyzmz/mingzhe-portfolio/blob/main/script.js | 只是旧作品集条目，不是这个项目的业务源码 |

### 远程补充核查

- 本轮通过 GitHub 连接读取了 `babyzmz/mingzhe-portfolio` 元数据：公开仓库、默认 main；当前连接具读取权限、不具 push 权限。这个权限不能代表用户本机 GitHub CLI 的登录权限。
- 本轮读取 `https://api.github.com/repos/babyzmz/goodnightstore/contents/`：有 package.json、Next.js 配置和 README 等；返回的默认根目录清单未见 app/、pages/、src/。只能列为同名候选，仍需核对本地版本、分支和业务源码，不能据此链接成已确认完整的项目。
- 之前对 Dreambound 的指定脚本路径 404，是既有 CONTENT_AUDIT.md 记录；本轮没有重新运行游戏或重查所有分支，不把历史检查提升为本轮运行结论。

## 4. 文件校验清单

这些哈希只用于判断当前手中的包是否一致，不是构建或功能通过证明。

| 相对路径 | 行数 | SHA-256 |
|---|---:|---|
| `package.json` | 6 | `d7ae7a06546f92ada23d605c75939114a1b167adef29c45c0721813e0f804367` |
| `src/content.ts` | 630 | `8560c04fad7d38f22886c27c3d3709d697052d8275998f53e3b0f5752d906a99` |
| `src/views.ts` | 115 | `4a04949d53b6210145f79041b9ff65e612d72e0a95bf837a0d295c2e9b4e0f1c` |
| `src/gsap-adapter.ts` | 11 | `2760ec5d279d0c252a69ba7f2ac14c735cfd911bb2cdb7c3b182da56a8a79aea` |
| `scripts/build-preview.mjs` | 31 | `f202f7d069abe0f179af1fd93054ce5f9a10fb629944f14f76b44260a5d12631` |
| `scripts/serve.mjs` | 23 | `b0af13bd634563b78fea49e612a324fb32db71b6abbd3e54afafb265a5db89a4` |
| `tests/details.browser.py` | 145 | `cc922d44b2b233d8569d5b86ef99d81bb8e599b31de36f49c05a7dee4660f4ca` |
| `docs/VERIFICATION.md` | 59 | `c2b46645da09ad8fa16d35a4776b12a441a0da0ac70227b843d5b7b6fdcebb78` |

## 5. 交接范围

本包提出的 project-media、project-links、媒体控制器、Windows 测试辅助模块、Pages workflow 和私有映射文件是后续要实现的内容，不是 v2.1 已有功能。
启动提示词、任务书及此核对报告不包含用户私有产品源码、凭据或真实本机路径。后续产生的私有资料必须与公共站点源码/发布产物分离。
