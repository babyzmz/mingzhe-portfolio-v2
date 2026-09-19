# 建议合入现有 AGENTS.md 的作品集接续规则

这是合并建议，不是自动生效的根指令文件。先读原仓库 AGENTS.md / AGENTS.override.md，只合入相关且不冲突的规则，不覆盖原文件。首次启动可以直接让 Codex 阅读同目录 START_PROMPT.txt 与任务书。

## Context
- 接续版本为 Mingzhe Portfolio v2.1；主任务见 `docs/handoff/CODEX_CONTINUATION.md`，当前静态核对见 `docs/handoff/BASELINE_AUDIT.md`。
- 当前是 TypeScript + 自写 WebGL/软件 3D + 可选 GSAP/ScrollTrigger，不是 Three.js 工程。
- 当前项目 ID 为 fairy/core/claw/ax/dreambound/webchange/goodnight/tarot/converter。

## Preserve
- 保留 3D 叙事、EN/中文、两个详情入口、modal 生命周期、媒体/术语动效、焦点返回、减少动态效果和背景渲染暂停。
- Fairy 自己的 Core 与 Mojo 系列共享 MojoCore 不能混为一个已实现依赖关系。
- 修改源码与源数据；构建输出由脚本生成。

## Evidence
- 素材类型明确区分原生截图、Web renderer 截图、真实录屏、示意图和样例数据。
- 同名仓库不是匹配证据；旧 portfolio script.js 不是旧项目源码。
- 仓库存在、代码存在、构建通过、运行通过、发布通过和个人贡献分别核对。
- 旧验证记录只作历史；没有执行不能声称通过。

## Privacy and permissions
- 敏感映射/原始截图/日志只存被忽略且未跟踪的 `.handoff-private/`，不可从 src/ 导入、放入 public/ 或打入包。
- 只读取批准的本地开发根。其他产品仓库的功能修改、付费调用和任何远程发布必须得到明确授权。
- Mojo 保持私有；不要 force push，不覆盖 main，不无审查执行 git add .，不擅自选择开源许可证。
- secret scan 不打印秘密。公开截图、录屏、subtitle、metadata 与 Git 历史都需检查。

## Validation
- 以 `package.json` 与任务书核对实际命令；新测试要加入真实测试 runner。
- 分开验证 Vite/GSAP、offline/native scroll、GPU/fallback、真实 HTTP/file 入口。
- 实机测试需要真实素材与运行；UI 模拟不能当原生程序通过。
- 每阶段输出简短进展，并更新 `.handoff-private/HANDOFF_STATUS.md`；一个项目阻塞不影响其他独立任务。
