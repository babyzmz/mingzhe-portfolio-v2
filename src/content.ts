import type { Locale } from './state.js';
export type ProjectCopy = { category: string; summary: string; role: string; status: string; evidence: string; limits: string; features: string[]; challenge: string };
export type Project = {id: string; name: string; short: string; kind: 'ai' | 'archive'; stack: string[]; url: string | null; en: ProjectCopy; zh: ProjectCopy};
export const profile = {
 "name": "Mingzhe Zhang",
 "alias": "Richie",
 "city": "Melbourne, Australia",
 "email": "zmz1998@gmail.com",
 "github": "https://github.com/babyzmz",
 "resume": "./documents/Mingzhe_Zhang_AI_Developer_Resume.pdf",
 "role": {
  "en": "AI Application Developer",
  "zh": "AI 应用开发者"
 }
};
export const projects: Project[] = [
 {
  "id": "fairy",
  "name": "Fairy",
  "short": "F",
  "kind": "ai",
  "stack": [
   "React",
   "TypeScript",
   "Tauri / Rust",
   "Python"
  ],
  "url": "https://github.com/babyzmz/Fairy-LLM",
  "en": {
   "category": "LOCAL-FIRST AI COMPANION",
   "summary": "A desktop AI assistant for project conversations, document retrieval, tools and file previews, with pet and voice interaction.",
   "role": "Self-directed, AI-assisted project development: requirements, provider integration, animated desktop interactions, debugging and focused validation.",
   "status": "In development · companion features in Beta",
   "evidence": "Current supplied CV and the public Fairy V3 repository describe the desktop shell, Core, capability adapters and documented release scope.",
   "limits": "Native desktop runtime and release gates were not executed for this portfolio. Real-time Beta is not presented as a production release. This website shows a visual interpretation, not a running desktop app.",
   "features": [
    "Local-first Windows desktop workspace with ordinary and project conversations.",
    "Model/provider integration, MCP tools and reusable Skills.",
    "Document-grounded Q&A, speech input/output and generated-file previews.",
    "Animated pet appearance, window layout and hit-testing iteration."
   ],
   "challenge": "A passing build is not the same as a usable desktop app. My work includes reproducing window and interaction issues and checking real behaviour beyond automated tests."
  },
  "zh": {
   "category": "本地优先的 AI 桌面助手",
   "summary": "围绕项目聊天、检索文档、使用工具并预览生成文件的桌面 AI 助手，同时探索桌宠与语音交互。",
   "role": "自主、AI 辅助的项目开发：需求拆解、模型接入、桌宠动画和窗口交互、问题排查与针对性验证。",
   "status": "持续开发 · 实时陪伴处于 Beta",
   "evidence": "依据已提供的新简历和 Fairy V3 公开仓库；仓库描述了桌面壳、Core、能力适配和发布范围。",
   "limits": "本次作品集制作未执行原生桌面运行与发布验收。实时 Beta 不等同于正式生产版本。本站展示视觉演绎，不是在网页里运行桌面程序。",
   "features": [
    "本地优先的 Windows 工作空间，区分普通聊天与项目会话。",
    "模型供应商接入、MCP 工具与可复用 Skills。",
    "基于文档的问答、语音输入输出与生成文件预览。",
    "持续调整桌宠动画、窗口布局与命中区域。"
   ],
   "challenge": "构建通过并不等于桌面应用好用。开发中需要复现真实窗口与交互问题，并在自动化测试之外检查实际行为。"
  }
 },
 {
  "id": "core",
  "name": "MojoCore",
  "short": "MC",
  "kind": "ai",
  "stack": [
   "TypeScript",
   "Python",
   "REST / SSE",
   "SQLite / PostgreSQL"
  ],
  "url": null,
  "en": {
   "category": "SHARED AGENT RUNTIME",
   "summary": "The shared backend foundation for MojoClaw and MojoAX, with work on recorded tasks, cancellation, retries and restoration.",
   "role": "AI-assisted backend development and iteration on shared runtime capabilities, task lifecycle, recovery and contract checks.",
   "status": "Ongoing development · private project",
   "evidence": "The supplied CV describes durable runs, replay, cancellation and recovery work. Reviewed project documentation establishes the shared Core / product-shell boundary. Personal contribution scope comes from the CV, not an independent authorship audit.",
   "limits": "No public runtime demo or private source is exposed here. This portfolio does not certify end-to-end production readiness. Fairy has its own Core and is not shown as a MojoCore client.",
   "features": [
    "Shared capability contracts and product-facing adapters.",
    "Work on persistent assistant runs, replay, cancellation and state recovery.",
    "Duplicate-request handling and authenticated user boundaries.",
    "Focused smoke and contract checks for runtime and artifact workflows."
   ],
   "challenge": "A task must remain understandable after a refresh, cancellation or retry. I focus on where execution state lives and how the UI recovers it without inventing a new state."
  },
  "zh": {
   "category": "共享智能体运行核心",
   "summary": "MojoClaw 与 MojoAX 共用的后端基础，开发重点包括任务记录、取消、重复请求与刷新后的状态恢复。",
   "role": "借助 AI 开发与迭代共享后端能力、任务生命周期、恢复机制和接口契约检查。",
   "status": "持续开发 · 私有项目",
   "evidence": "新简历描述了持久化任务、重放、取消和恢复方面的工作；已查阅的项目文档支持共享 Core 与产品壳的分工。个人贡献依据简历，并非独立代码归属审计。",
   "limits": "本站不开放私有源码或公开运行演示，也不证明整套系统已经达到生产就绪。Fairy 拥有自己的 Core，不作为 MojoCore 客户端展示。",
   "features": [
    "共享能力契约与面向产品的适配层。",
    "持久化 AI 任务、事件重放、取消与状态恢复。",
    "重复请求处理与经过验证的用户身份边界。",
    "运行时与生成物工作流的针对性冒烟和契约检查。"
   ],
   "challenge": "刷新、取消、重试之后，任务仍应有明确状态。我的重点是执行状态的归属，以及界面如何恢复它，而不是自行猜测出另一套状态。"
  }
 },
 {
  "id": "claw",
  "name": "MojoClaw",
  "short": "M/",
  "kind": "ai",
  "stack": [
   "Web / Electron",
   "TypeScript",
   "Core APIs",
   "SSE"
  ],
  "url": null,
  "en": {
   "category": "PERSONAL AI WORKBENCH",
   "summary": "A personal AI workbench that brings chat, project tasks and generated files together, presenting execution through shared Core services.",
   "role": "AI-assisted application development: project/task interfaces, Core API integration, failure investigation and chat-flow smoke checks.",
   "status": "Ongoing development · private project",
   "evidence": "The supplied CV and reviewed project documentation support the personal workbench, product adapter and Core proxy boundaries.",
   "limits": "The scene is an interface architecture illustration, not a live product session or screenshot. No currently verified public deployment is linked.",
   "features": [
    "Conversations and project/task organisation.",
    "Generated-file previews and shared Core integration.",
    "Streaming, cancellation and conversation restoration work.",
    "Authentication and model-provider error investigation."
   ],
   "challenge": "The frontend should show the actual state of a task. Keeping the product interface and execution core separate makes that responsibility clearer."
  },
  "zh": {
   "category": "个人 AI 工作台",
   "summary": "个人 AI 工作台，把聊天、项目任务和生成文件放在一起，通过共享 Core 执行并展示任务进展。",
   "role": "使用 AI 辅助开发项目与任务界面、接入 Core API、排查失败原因并执行聊天流程冒烟检查。",
   "status": "持续开发 · 私有项目",
   "evidence": "依据新简历及已查阅的项目文档，支持个人工作台、产品适配层与 Core 代理边界的描述。",
   "limits": "本页是界面架构示意，不是真实产品会话或截图。未链接当前已验证的公网部署。",
   "features": [
    "聊天与项目、任务组织。",
    "生成文件预览和共享 Core 接入。",
    "流式响应、取消与会话恢复。",
    "认证及模型供应商错误的排查。"
   ],
   "challenge": "前端应该展示任务的真实状态。把产品界面与执行核心分开，可以让这个责任更清晰。"
  }
 },
 {
  "id": "ax",
  "name": "MojoAX",
  "short": "AX",
  "kind": "ai",
  "stack": [
   "React",
   "TypeScript",
   "Enterprise UI",
   "Core APIs"
  ],
  "url": null,
  "en": {
   "category": "ENTERPRISE AI WORKBENCH",
   "summary": "An enterprise AI workbench organising reference material, files and task-relevant views around shared runtime capabilities.",
   "role": "AI-assisted enterprise UI development, shared runtime integration and translation of business-system requirements into implementation tasks.",
   "status": "Ongoing development · private project",
   "evidence": "The supplied CV describes workbench development and shared-service integration. Reviewed repository documentation differentiates the enterprise shell from MojoClaw and notes unfinished enterprise integration areas.",
   "limits": "Not presented as a complete ERP or a fully deployed enterprise platform. Scaffolds, unverified integrations and roadmap items are not promoted to delivered features.",
   "features": [
    "Enterprise-facing workbench and differentiated information layout.",
    "Shared AI/runtime service integration through a product adapter.",
    "Business requirements translated into interface workflows.",
    "Integration troubleshooting and deployment verification work."
   ],
   "challenge": "The enterprise product needs its own workflow and information hierarchy, rather than just renaming the personal application."
  },
  "zh": {
   "category": "企业 AI 工作台",
   "summary": "企业 AI 工作台，围绕业务任务组织资料、文件与执行界面，通过产品适配层接入共享能力。",
   "role": "AI 辅助企业界面开发、共享运行服务接入，以及把业务系统需求转化为开发任务。",
   "status": "持续开发 · 私有项目",
   "evidence": "新简历记录了工作台开发和共享服务接入；已查阅的仓库文档区分了企业壳与 MojoClaw，并明确部分企业接入尚未完成。",
   "limits": "不作为完整 ERP 或全面上线的企业平台宣传。占位结构、未验证接入与规划项不写成已交付功能。",
   "features": [
    "面向企业的信息组织与工作台界面。",
    "通过产品适配层接入共享 AI 和运行能力。",
    "把业务需求转化为界面与工作流任务。",
    "集成问题排查与部署验证相关工作。"
   ],
   "challenge": "企业产品需要自己的工作流和信息层级，而不是简单地给个人版更换名称。"
  }
 },
 {
  "id": "dreambound",
  "name": "Dreambound Realm",
  "short": "DR",
  "kind": "archive",
  "stack": [
   "Canvas",
   "JavaScript",
   "Browser game"
  ],
  "url": "https://github.com/babyzmz/mingzhe-portfolio/tree/main/demos/dreambound",
  "en": {
   "category": "BROWSER GAME",
   "summary": "A dream-themed Canvas game project. The source defines chapter, health/skill, choice and end screens; runtime logic remains unverified.",
   "role": "Earlier portfolio project; the original configuration lists a static canvas game and bundled browser demo. No more specific contribution claim is added here.",
   "status": "Earlier project · interface source inspected · runtime unverified",
   "evidence": "The original project configuration and inspected demos/dreambound/index.html define Canvas, the Memory Tide start screen, HP/Skill, Echo Knight status, Dream Blessing choices and end screens.",
   "limits": "The entry references game-logic scripts absent from the inspected public directory; the js/core/game.js request returned 404. Interface markup does not prove running gameplay. This edition links the original record without promising a playable build.",
   "features": [
    "Game Canvas and chapter entry in the original HTML.",
    "Defined health, skill, room and boss-status interfaces.",
    "Choice, end and restart screen structures; script execution remains unverified."
   ],
   "challenge": "This archive records earlier interactive work without implying that its runtime was re-tested in the new site."
  },
  "zh": {
   "category": "浏览器游戏",
   "summary": "梦境主题的 Canvas 游戏项目。原页面可查到章节入口、生命／技能状态、梦境选择及结束界面；运行逻辑未核验。",
   "role": "旧作品集项目；原始配置记录了静态 Canvas 游戏及随站打包的浏览器演示，不额外扩大个人贡献描述。",
   "status": "历史项目 · 界面结构可查 · 运行未核验",
   "evidence": "原站项目配置及本次读取的 demos/dreambound/index.html：页面定义了 Canvas、Memory Tide 开始画面、HP／Skill、Echo Knight 状态、Dream Blessing 选择和结束界面。",
   "limits": "入口引用了游戏逻辑脚本，但本次读取的公开目录未提供这些文件，对 js/core/game.js 的请求返回 404。网页结构不等于已运行的游戏；本版本仅链接原始记录，不提供可玩承诺。",
   "features": [
    "原始 HTML 中的游戏 Canvas 与章节入口。",
    "生命、技能、房间与 Boss 状态界面结构。",
    "选择、结束与重新开始的页面结构；脚本运行未核验。"
   ],
   "challenge": "保留过去的交互作品，同时不暗示新版网站已重新测试原游戏运行环境。"
  }
 },
 {
  "id": "webchange",
  "name": "Web Change",
  "short": "Δ",
  "kind": "archive",
  "stack": [
   "Electron",
   "Desktop UI"
  ],
  "url": "https://github.com/babyzmz/mingzhe-portfolio/blob/main/script.js",
  "en": {
   "category": "MONITORING INTERFACE",
   "summary": "An Electron interface project for website-change monitoring. Its purpose and interface form are documented, not a verified monitoring backend.",
   "role": "Earlier project record only. The supplied source describes an Electron renderer; detailed personal contribution and backend delivery are not established.",
   "status": "Archived project · deployment not verified",
   "evidence": "Original project configuration: Web Change Desktop UI; Electron renderer; demo URL pending.",
   "limits": "No deployed renderer or working monitoring service was verified. This card links to the original project record, not a product demo.",
   "features": [
    "Desktop UI for a website-change monitoring concept.",
    "Electron renderer noted in the original project record."
   ],
   "challenge": "Preserve the intended use and technology without treating a renderer as an operational monitoring service."
  },
  "zh": {
   "category": "网页变化监测界面",
   "summary": "围绕网页变化监测的 Electron 桌面界面项目；现有记录可确认用途和界面形态，未核验后台监测服务。",
   "role": "仅沿用旧项目记录。来源描述了 Electron renderer，未明确细化的个人贡献或后端交付情况。",
   "status": "历史项目 · 部署未验证",
   "evidence": "原始配置写明 Web Change Desktop UI、Electron renderer，以及待补充的演示地址。",
   "limits": "未验证已部署的 renderer 或实际监测服务。入口指向旧项目记录，不是产品演示。",
   "features": [
    "面向网页变化监测的桌面 UI 概念。",
    "原始记录中的 Electron renderer。"
   ],
   "challenge": "保留用途和技术信息，但不把一个界面项目描述成已运行的监测服务。"
  }
 },
 {
  "id": "goodnight",
  "name": "Goodnight Store",
  "short": "gn.",
  "kind": "archive",
  "stack": [
   "Next.js",
   "Commerce"
  ],
  "url": "https://github.com/babyzmz/mingzhe-portfolio/blob/main/script.js",
  "en": {
   "category": "COMMERCE EXPERIMENT",
   "summary": "A Next.js store exploration with recorded server/database requirements, without a verified live storefront or transaction flow.",
   "role": "Earlier portfolio project. The source records a Next.js store requiring a server runtime and database, without establishing sales or commercial adoption.",
   "status": "Archived project · server deployment required",
   "evidence": "Original portfolio project configuration describes Goodnight Store as a Next.js application, with its demo URL empty.",
   "limits": "No store backend, checkout flow, live customers or production deployment were verified for this portfolio.",
   "features": [
    "Next.js commerce application listed in the original portfolio.",
    "A server runtime and database are required by that project description."
   ],
   "challenge": "A store interface and a live commerce operation are different claims; this entry makes only the former project-level claim."
  },
  "zh": {
   "category": "电商体验探索",
   "summary": "Next.js 商店应用探索，原记录包含服务端和数据库部署需求；当前没有已验证的在线商店或交易流程。",
   "role": "旧作品集项目。来源记录了需要服务端和数据库的 Next.js 商店，没有销售或商业使用规模的证据。",
   "status": "历史项目 · 需要服务端部署",
   "evidence": "原始项目配置将 Goodnight Store 记为 Next.js 应用，演示地址为空。",
   "limits": "本次作品集未验证商店后端、结算流程、真实客户或生产部署。",
   "features": [
    "原作品集中记录的 Next.js 电商应用。",
    "项目描述需要服务端运行环境与数据库。"
   ],
   "challenge": "商店界面与真实运营的电商平台不是同一件事；这里只保留来源支持的项目层面描述。"
  }
 },
 {
  "id": "tarot",
  "name": "AI Tarot Reports",
  "short": "✧",
  "kind": "archive",
  "stack": [
   "Next.js",
   "Generative reports"
  ],
  "url": "https://github.com/babyzmz/mingzhe-portfolio/blob/main/script.js",
  "en": {
   "category": "GENERATIVE EXPERIENCE",
   "summary": "A tarot-themed AI analysis and report-generation exploration in a server-backed Next.js app; the live service and report format are unverified.",
   "role": "Earlier portfolio project record. No additional model, accuracy or prediction claims are introduced.",
   "status": "Archived project · server deployment required",
   "evidence": "Original project configuration: AI Tarot Report Generator, Next.js, runtime needed, no public demo URL.",
   "limits": "No working generation endpoint was verified. This is a creative experiment, not a claim of predictive validity.",
   "features": [
    "Tarot-analysis and report-generation concept.",
    "Next.js application requiring server-side capabilities."
   ],
   "challenge": "Present the generative interface experiment without suggesting validated predictions or an available hosted endpoint."
  },
  "zh": {
   "category": "生成式体验",
   "summary": "塔罗主题的 AI 分析与报告生成应用探索，采用需要服务端的 Next.js 形态；在线生成与报告格式未核验。",
   "role": "沿用旧作品集的项目记录，不追加模型、准确率或预测能力方面的宣传。",
   "status": "历史项目 · 需要服务端部署",
   "evidence": "原配置：AI Tarot Report Generator、Next.js、需要运行环境、没有公开演示地址。",
   "limits": "未验证可用的生成接口。这是创意体验探索，不代表具有经过验证的预测能力。",
   "features": [
    "塔罗分析与报告生成的体验概念。",
    "需要服务端能力的 Next.js 应用。"
   ],
   "challenge": "展示生成式界面探索，而不暗示预测准确性或现成可用的托管接口。"
  }
 },
 {
  "id": "converter",
  "name": "Mi Format Converter",
  "short": "↔",
  "kind": "archive",
  "stack": [
   "Python",
   "PyQt",
   "Desktop utility"
  ],
  "url": "https://github.com/babyzmz/mingzhe-portfolio/blob/main/script.js",
  "en": {
   "category": "DESKTOP UTILITY",
   "summary": "A native Python / PyQt conversion utility project focused on file input and output. Supported formats and executable behaviour are unverified.",
   "role": "Earlier portfolio project. The source identifies a PyQt desktop utility but does not enumerate verified supported formats.",
   "status": "Archived project · release link unavailable",
   "evidence": "The old portfolio lists Mi Format Converter as a PyQt desktop app with a pending release link.",
   "limits": "No executable, supported-format matrix or conversion accuracy was tested in this build. A native PyQt app is not embedded as a browser app.",
   "features": [
    "Native Python / PyQt desktop utility.",
    "Format conversion identified as its purpose in the original project listing."
   ],
   "challenge": "Describe the native utility honestly without manufacturing a browser demo or unsupported compatibility claims."
  },
  "zh": {
   "category": "桌面实用工具",
   "summary": "Python / PyQt 原生格式转换工具项目，聚焦文件输入与转换输出；支持格式和可执行程序尚未核验。",
   "role": "早期作品项目。来源标明了 PyQt 桌面工具，但没有列出经过验证的格式支持范围。",
   "status": "历史项目 · 暂无发布包链接",
   "evidence": "旧作品集记录 Mi Format Converter 为 PyQt 桌面应用，发布链接待补充。",
   "limits": "本次构建未测试可执行程序、格式兼容表或转换准确性。原生 PyQt 程序不会被冒充为浏览器内应用。",
   "features": [
    "Python / PyQt 原生桌面工具。",
    "原始项目列表明确的格式转换用途。"
   ],
   "challenge": "如实呈现原生工具，不制造网页版演示或未经证实的兼容能力。"
  }
 }
];
export const text: Record<Locale,Record<string,string>> = {
 "en": {
  "navWork": "Work",
  "navMethod": "Process",
  "navAbout": "About",
  "navContact": "Get in touch",
  "skip": "Skip to projects",
  "role": "AI APPLICATION DEVELOPER",
  "location": "MELBOURNE, AUSTRALIA",
  "heroKicker": "INDEPENDENT BUILDER · AI & SOFTWARE",
  "heroA": "Ideas into",
  "heroB": "intelligence.",
  "heroDesc": "I’m Mingzhe. I build AI applications — and explore the systems that make them work.",
  "heroCta": "Explore my work",
  "resume": "Download CV",
  "scroll": "SCROLL TO EXPLORE",
  "storyTag": "A PORTFOLIO IN FIVE DIMENSIONS",
  "index": "INDEX",
  "optical": "ORIGINAL WEBGL STUDY",
  "live": "REAL-TIME RENDER",
  "static": "STATIC VIEW",
  "software": "SOFTWARE 3D",
  "motionOn": "Pause motion",
  "motionOff": "Enable motion",
  "fairyKicker": "01 / A DESKTOP PRESENCE",
  "fairyA": "Meet",
  "fairyB": "Fairy.",
  "fairyDesc": "Talk through projects, retrieve documents, use tools and preview files. Pet and voice interaction give this local-first AI workspace a desktop presence.",
  "fairyNote": "Local-first · Windows · In development",
  "case": "Inside the project",
  "source": "View source",
  "fairyVisual": "INTERACTIVE VISUAL STUDY · NOT AN APP CAPTURE",
  "idle": "Idle",
  "think": "Think",
  "voice": "Voice",
  "coreKicker": "02 / BENEATH THE INTERFACE",
  "coreA": "The systems",
  "coreB": "behind the spark.",
  "coreDesc": "A shared foundation for the personal and enterprise workbenches: model and tool capabilities, recorded tasks, and state after refresh, cancellation or retry.",
  "coreBoundary": "SHARED BY MOJOCLAW + MOJOAX · FAIRY HAS ITS OWN CORE",
  "coreTag1": "Contracts",
  "coreTag2": "Execution",
  "coreTag3": "Recovery",
  "mojoKicker": "03 / ONE CORE. TWO CONTEXTS.",
  "mojoA": "Personal focus.",
  "mojoB": "Enterprise intent.",
  "mojoDesc": "MojoClaw organises personal conversations, tasks and files. MojoAX arranges task-relevant views for teams. Both consume shared Core capabilities.",
  "clawLabel": "For individuals",
  "axLabel": "For teams & organisations",
  "diagram": "ARCHITECTURE ILLUSTRATION · NOT A LIVE SESSION",
  "methodKicker": "04 / HOW I BUILD",
  "methodA": "AI-assisted.",
  "methodB": "Human-directed.",
  "methodDesc": "The tools accelerate implementation. The work is deciding what to build, giving it context, and checking what actually happened.",
  "methodCallout": "A passing test is evidence.\nNot the whole product.",
  "methodProof": "Examples of my development approach, not a recording of a tool session.",
  "step1": "Define the problem",
  "step1d": "Turn an idea into requirements, boundaries and acceptance criteria.",
  "step2": "Build with context",
  "step2d": "Use Codex and Claude with repository context, constraints and focused tasks.",
  "step3": "Inspect the result",
  "step3d": "Review changes, run focused checks and reproduce real application behaviour.",
  "step4": "Iterate deliberately",
  "step4d": "Investigate failures, refine the task and verify the next change.",
  "archiveKicker": "SELECTED WORK & EARLIER EXPLORATIONS",
  "archiveA": "Built from",
  "archiveB": "curiosity.",
  "archiveDesc": "Four ongoing AI projects. Five earlier experiments. A record of learning by making.",
  "all": "All projects",
  "ai": "AI systems",
  "archive": "Earlier work",
  "detail": "Read project",
  "record": "Project record",
  "publicSource": "Public repository",
  "private": "Private project",
  "aboutKicker": "THE PERSON BEHIND THE PROJECTS",
  "aboutA": "Business systems.",
  "aboutB": "Builder’s mindset.",
  "aboutDesc": "I’m Mingzhe Zhang — also known as Richie — an RMIT Business Information Systems graduate based in Melbourne. My recent work centres on AI-assisted application development, agent workflows and desktop interfaces.",
  "aboutDesc2": "I use Codex and Claude throughout planning, implementation, debugging and validation. My focus is turning an idea into working behaviour, while being clear about what is still in development.",
  "background": "Background",
  "degree": "Bachelor of Business Information Systems",
  "diploma": "Diploma of Information Technology",
  "intern": "Intern · Beijing Anxin",
  "internDesc": "Supported big-data platform construction and maintenance; contributed to frontend and backend tasks under supervision, with exposure to production-safety AI and system monitoring.",
  "school": "Haileybury · Secondary education",
  "languages": "English / Mandarin (native)",
  "citizen": "Australian citizen",
  "guitar": "Away from the screen: guitar.",
  "skillsTitle": "Tools I work with",
  "skillsNote": "Project technologies and learning foundations — not proficiency scores.",
  "skills1": "AI-assisted development",
  "skills2": "Application technologies",
  "skills3": "Systems & tooling",
  "skills4": "Applied AI",
  "contactKicker": "HAVE A PROJECT, A QUESTION, OR AN IDEA?",
  "contactA": "Let’s build",
  "contactB": "something real.",
  "contactDesc": "Open to conversations about AI applications, agent systems and opportunities to learn through real projects.",
  "copy": "Copy email",
  "copied": "Email copied",
  "footer": "Designed around the work. Built for the curious.",
  "evidence": "Content & source notes",
  "close": "Close",
  "contribution": "My contribution",
  "capabilities": "Project scope",
  "challenge": "What I focus on",
  "basis": "Source basis",
  "limits": "Current limits",
  "sourceAction": "Open source record",
  "catalogCount": "PROJECTS",
  "evidenceTitle": "The work, with context.",
  "evidenceIntro": "This site separates project descriptions, personal contribution statements and runtime verification. It does not turn every repository claim into a release claim.",
  "evidenceCv": "Identity, education, internship and personal contribution statements come from the supplied original and updated CVs.",
  "evidenceRepo": "Public Fairy documentation and earlier portfolio configuration provide project context. Reviewed private Mojo documentation supports only public-safe summaries; private source is not distributed.",
  "evidenceScope": "Native Fairy/Mojo services and old server-backed projects were not run to create this site. The new WebGL portfolio is tested separately. Illustrations are labelled, and old project entries retain their limitations.",
  "evidencePrivacy": "The downloadable CV contains supplied contact information. The website omits the residential street address and does not contain API keys, private repository paths or analytics trackers.",
  "menu": "Open navigation",
  "contactLink": "Email Mingzhe",
  "experienceSource": "Background from supplied CVs",
  "modeNative": "NATIVE SCROLL",
  "modeGsap": "GSAP SCROLL",
  "fallback": "The 3D view is unavailable. All project content remains accessible.",
  "look": "VIEW STUDY",
  "back": "Back to top"
 },
 "zh": {
  "navWork": "作品",
  "navMethod": "开发方法",
  "navAbout": "关于我",
  "navContact": "联系我",
  "skip": "跳到项目列表",
  "role": "AI 应用开发者",
  "location": "澳大利亚 · 墨尔本",
  "heroKicker": "独立开发 · AI 与软件",
  "heroA": "让想法，",
  "heroB": "成为智能。",
  "heroDesc": "我是 Mingzhe。开发 AI 应用，也探索让它们真正运转的底层系统。",
  "heroCta": "探索我的作品",
  "resume": "下载简历",
  "scroll": "向下滚动，进入我的开发世界",
  "storyTag": "穿越五个维度的个人作品集",
  "index": "目录",
  "optical": "原创 WEBGL 视觉探索",
  "live": "实时渲染",
  "static": "静态视图",
  "software": "软件 3D",
  "motionOn": "暂停动态效果",
  "motionOff": "开启动效",
  "fairyKicker": "01 / 不止一个聊天窗口",
  "fairyA": "认识",
  "fairyB": "Fairy。",
  "fairyDesc": "围绕项目对话、检索文档、使用工具并预览生成文件。桌宠与语音，让这个本地优先的 AI 助手有了更直接的桌面交互。",
  "fairyNote": "本地优先 · Windows · 持续开发",
  "case": "深入了解项目",
  "source": "查看源码",
  "fairyVisual": "交互视觉演绎 · 非原生应用截图",
  "idle": "待机",
  "think": "思考",
  "voice": "语音",
  "coreKicker": "02 / 界面之下",
  "coreA": "智能背后，",
  "coreB": "是系统。",
  "coreDesc": "个人版与企业版共用的运行基础：组织模型和工具、记录任务，并关注刷新、取消和重试之后，界面应该恢复什么状态。",
  "coreBoundary": "由 MOJOCLAW 与 MOJOAX 共享 · FAIRY 拥有自己的 CORE",
  "coreTag1": "契约",
  "coreTag2": "执行",
  "coreTag3": "恢复",
  "mojoKicker": "03 / 同一核心，不同场景",
  "mojoA": "个人的专注。",
  "mojoB": "企业的协同。",
  "mojoDesc": "MojoClaw 把个人的聊天、任务与文件组织起来；MojoAX 围绕团队业务安排工作界面。两个产品通过共享 Core 执行 AI 工作。",
  "clawLabel": "面向个人",
  "axLabel": "面向团队与组织",
  "diagram": "架构示意 · 非真实运行会话",
  "methodKicker": "04 / 我的开发方式",
  "methodA": "AI 辅助。",
  "methodB": "由我判断。",
  "methodDesc": "工具加快实现。真正的工作，是决定要做什么、提供足够的上下文，并核实实际发生了什么。",
  "methodCallout": "测试通过是一份证据。\n不是产品的全部。",
  "methodProof": "这里展示开发方法，不是 AI 工具会话的录屏。",
  "step1": "明确问题",
  "step1d": "把想法拆解为需求、模块边界与验收标准。",
  "step2": "带着上下文开发",
  "step2d": "结合仓库上下文、约束与具体任务使用 Codex 和 Claude。",
  "step3": "检查实际结果",
  "step3d": "审查修改、运行针对性检查，并复现真实应用行为。",
  "step4": "有依据地迭代",
  "step4d": "排查失败原因、调整任务，再验证下一次修改。",
  "archiveKicker": "重点项目与早期探索",
  "archiveA": "从好奇，",
  "archiveB": "到作品。",
  "archiveDesc": "四个持续开发的 AI 项目，五个早期探索。记录在实践中学习的过程。",
  "all": "全部项目",
  "ai": "AI 系统",
  "archive": "早期作品",
  "detail": "了解项目",
  "record": "项目记录",
  "publicSource": "公开仓库",
  "private": "私有项目",
  "aboutKicker": "作品背后的人",
  "aboutA": "信息系统背景。",
  "aboutB": "持续构建的习惯。",
  "aboutDesc": "我是 Mingzhe Zhang，也可以叫我 Richie，毕业于 RMIT Business Information Systems，现居墨尔本。近期主要探索 AI 辅助应用开发、智能体工作流和桌面交互。",
  "aboutDesc2": "从规划、实现到排错与验证，我会持续使用 Codex 和 Claude。重点是把想法变成真实可用的行为，同时清楚区分哪些部分仍在开发。",
  "background": "学习与经历",
  "degree": "商业信息系统学士",
  "diploma": "信息技术文凭",
  "intern": "实习 · Beijing Anxin",
  "internDesc": "协助大数据平台建设与维护，在指导下参与前后端任务，接触安全生产 AI 应用与系统监测。",
  "school": "Haileybury · 中学教育",
  "languages": "英语 / 中文（母语）",
  "citizen": "澳大利亚公民",
  "guitar": "屏幕之外：弹吉他。",
  "skillsTitle": "开发中使用的工具",
  "skillsNote": "项目技术与学习基础，而不是技能熟练度评分。",
  "skills1": "AI 辅助开发",
  "skills2": "应用技术",
  "skills3": "系统与工具",
  "skills4": "AI 应用能力",
  "contactKicker": "有项目、有问题，或者有一个新想法？",
  "contactA": "一起做点",
  "contactB": "真正的东西。",
  "contactDesc": "欢迎交流 AI 应用、智能体系统，以及在真实项目中持续学习的机会。",
  "copy": "复制邮箱",
  "copied": "邮箱已复制",
  "footer": "以真实作品为中心，为好奇而构建。",
  "evidence": "内容与来源说明",
  "close": "关闭",
  "contribution": "我的参与",
  "capabilities": "项目范围",
  "challenge": "关注的问题",
  "basis": "来源依据",
  "limits": "当前限制",
  "sourceAction": "查看原始记录",
  "catalogCount": "个项目",
  "evidenceTitle": "展示作品，也保留上下文。",
  "evidenceIntro": "本站区分项目描述、个人贡献陈述和实际运行验证，不把仓库中的每一句描述都转换为正式发布承诺。",
  "evidenceCv": "身份、教育、实习与个人贡献表述，依据已提供的原简历和更新版简历。",
  "evidenceRepo": "Fairy 公开文档和旧作品集配置提供项目背景；已查阅的私有 Mojo 文档只用于适合公开的概括，不分发私有源码。",
  "evidenceScope": "本次制作未运行 Fairy 原生应用、Mojo 服务或旧站中需要服务端的项目。新 WebGL 作品集独立测试；示意均有标识，旧项目保留其限制。",
  "evidencePrivacy": "下载简历包含已提供的联系方式。网页不展示住宅街道地址，不包含 API 密钥、私有仓库路径或分析追踪器。",
  "menu": "打开导航",
  "contactLink": "给 Mingzhe 发邮件",
  "experienceSource": "背景信息来自已提供的简历",
  "modeNative": "原生滚动",
  "modeGsap": "GSAP 滚动",
  "fallback": "3D 视图暂不可用，所有项目信息仍可正常阅读。",
  "look": "视觉探索",
  "back": "返回顶部"
 }
};
